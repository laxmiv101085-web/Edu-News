import { RSSProvider } from './rss';
import { NewsAPIProvider } from './providers';
import { Article } from './types';
import { cacheSet, cacheGet } from '../redis';
import { db } from '../db';

// Define sources
const sources = [
    new RSSProvider('Hindustan Times', 'https://www.hindustantimes.com/feeds/rss/education/rssfeed.xml', 'general'),
    new RSSProvider('Times of India', 'https://timesofindia.indiatimes.com/rssfeeds/913168846.cms', 'general'),
    new RSSProvider('NDTV Education', 'https://feeds.feedburner.com/ndtvnews-education', 'general'),
    new RSSProvider('Indian Express', 'https://indianexpress.com/section/education/feed/', 'general'),
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
    await cacheSet('latest_news_v2', uniqueArticles, 1800);

    // Store in Firestore (for persistence/search)
    try {
        const batchSize = 500;
        for (let i = 0; i < uniqueArticles.length; i += batchSize) {
            const batch = uniqueArticles.slice(i, i + batchSize);
            await Promise.all(
                batch.map((article) =>
                    db.setDoc('articles', article.id.replace(/\//g, '_'), article)
                )
            );
        }
    } catch (error) {
        console.warn('Failed to store articles in Firestore (running in fallback mode):', error);
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
            articles = await cacheGet<Article[]>('latest_news_v2');
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

        // If we don't have enough articles, fetch live from RSS
        if (!articles || articles.length < 10) {
            console.log('Insufficient data, fetching live RSS feeds...');
            try {
                articles = await ingestNews();
            } catch (e) {
                console.error('Live RSS fetch failed:', e);
            }
        }

        // If STILL no articles (RSS failed), use minimal mock data as last resort
        if (!articles || articles.length === 0) {
            console.log('Using fallback mock data as last resort');
            // Use a fixed base date for stable timestamps (e.g., today at 9 AM)
            const baseDate = new Date();
            baseDate.setHours(9, 0, 0, 0);

            articles = Array.from({ length: 10 }, (_, i) => ({
                id: `mock-${i + 1}`,
                title: `Education Update ${i + 1}`,
                summary: `We are currently unable to fetch live news. Please check back later.`,
                url: 'https://example.com',
                image_url: `https://picsum.photos/seed/${i + 1}/800/600`,
                publishedAt: new Date(baseDate.getTime() - i * 3600000).toISOString(),
                source: { id: 'system', name: 'System' },
                category: 'general',
                tags: ['update'],
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
