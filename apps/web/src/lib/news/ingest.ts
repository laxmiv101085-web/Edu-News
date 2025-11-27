import { RSSProvider } from './rss';
import { NewsAPIProvider } from './providers';
import { Article } from './types';
import { cacheSet, cacheGet } from '../redis';
import { db } from '../db';

// Define sources
const sources = [
    // Example RSS feeds (replace with real ones)
    new RSSProvider('UGC India', 'https://www.ugc.ac.in/rss.aspx', 'policy'),
    new RSSProvider('Education Times', 'https://timesofindia.indiatimes.com/rssfeeds/913168846.cms', 'general'),
    // Add NewsAPI if key exists
    ...(process.env.NEWSAPI_KEY ? [new NewsAPIProvider(process.env.NEWSAPI_KEY)] : []),
];

export const ingestNews = async () => {
    console.log('Starting news ingestion...');
    let allArticles: Article[] = [];

    // Fetch from all sources in parallel
    const results = await Promise.allSettled(sources.map((s) => s.fetchArticles()));

    results.forEach((result) => {
        if (result.status === 'fulfilled') {
            allArticles = [...allArticles, ...result.value];
        }
    });

    // Deduplicate by URL
    const uniqueArticles = Array.from(new Map(allArticles.map((item) => [item.url, item])).values());

    console.log(`Fetched ${uniqueArticles.length} unique articles.`);

    // Cache in Redis (TTL 30 mins)
    await cacheSet('latest_news', uniqueArticles, 1800);

    // Store in Firestore (for persistence/search)
    // Batch writes to avoid hitting limits too fast
    const batchSize = 500;
    for (let i = 0; i < uniqueArticles.length; i += batchSize) {
        const batch = uniqueArticles.slice(i, i + batchSize);
        await Promise.all(
            batch.map((article) =>
                db.setDoc('articles', article.id.replace(/\//g, '_'), article) // Sanitize ID for Firestore path
            )
        );
    }

    return uniqueArticles;
};

export const getLatestNews = async (
    category?: string,
    limit: number = 20,
    page: number = 1
): Promise<{ articles: Article[]; total: number }> => {
    let articles: Article[] | null = null;

    try {
        // Try Redis first
        try {
            articles = await cacheGet<Article[]>('latest_news');
        } catch (e) {
            console.warn('Redis cache failed:', e);
        }

        if (!articles) {
            // Fallback to DB if cache miss
            try {
                const snapshot = await db.collection('articles').orderBy('publishedAt', 'desc').limit(limit).get();
                articles = snapshot.docs.map(d => d.data() as Article);
            } catch (e) {
                console.warn('Firestore fetch failed:', e);
            }
        }

        // If still no articles (DB failed or empty), use mock data
        if (!articles || articles.length === 0) {
            console.log('Using fallback mock data');
            articles = [
                {
                    id: '1',
                    title: 'CBSE Board Exams 2025: Date Sheet Released',
                    summary: 'The Central Board of Secondary Education has released the date sheet for Class 10 and 12 board exams for the academic session 2024-25.',
                    url: 'https://www.cbse.gov.in',
                    image_url: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=800&q=80',
                    publishedAt: new Date().toISOString(),
                    source: { id: 'cbse', name: 'CBSE' },
                    category: 'exams',
                    tags: ['board exams', 'cbse', 'class 10', 'class 12'],
                    language: 'en'
                },
                {
                    id: '2',
                    title: 'New Scholarship Scheme for Engineering Students',
                    summary: 'The Ministry of Education announces a new scholarship scheme for meritorious engineering students from economically weaker sections.',
                    url: 'https://www.education.gov.in',
                    image_url: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=800&q=80',
                    publishedAt: new Date(Date.now() - 86400000).toISOString(),
                    source: { id: 'moe', name: 'Ministry of Education' },
                    category: 'scholarships',
                    tags: ['scholarship', 'engineering', 'financial aid'],
                    language: 'en'
                },
                {
                    id: '3',
                    title: 'NEP 2020 Implementation: Key Updates',
                    summary: 'Universities across the country are adopting the new 4-year undergraduate programme structure as per NEP 2020 guidelines.',
                    url: 'https://www.ugc.ac.in',
                    image_url: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=800&q=80',
                    publishedAt: new Date(Date.now() - 172800000).toISOString(),
                    source: { id: 'ugc', name: 'UGC' },
                    category: 'policy',
                    tags: ['NEP 2020', 'higher education', 'university'],
                    language: 'en'
                }
            ];
        }

        if (!articles) return { articles: [], total: 0 };

        // Filter by category
        let filtered = category && category !== 'all'
            ? articles.filter((a) => a.category === category)
            : articles;

        // Pagination
        const start = (page - 1) * limit;
        const paginated = filtered.slice(start, start + limit);

        return {
            articles: paginated,
            total: filtered.length,
        };
    } catch (error) {
        console.error('getLatestNews critical error:', error);
        return { articles: [], total: 0 };
    }
};
