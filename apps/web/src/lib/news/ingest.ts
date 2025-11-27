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
            articles = Array.from({ length: 50 }, (_, i) => ({
                id: `mock-${i + 1}`,
                title: `Mock Article ${i + 1}: Education Update`,
                summary: `This is a generated mock summary for article ${i + 1}. It simulates real content when the backend is not available.`,
                url: 'https://example.com',
                image_url: `https://source.unsplash.com/random/800x600?education,school&sig=${i}`,
                publishedAt: new Date(Date.now() - i * 3600000).toISOString(),
                source: { id: 'mock', name: 'Mock Source' },
                category: ['exams', 'scholarships', 'policy', 'admissions'][i % 4] as any,
                tags: ['mock', 'education'],
                language: 'en'
            }));
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
