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
    // Try Redis first
    let articles = await cacheGet<Article[]>('latest_news');

    if (!articles) {
        // Fallback to DB if cache miss (or trigger ingest)
        // For now, let's just return empty or trigger ingest if we were in a real server context
        // In a serverless function, we might query Firestore here
        const snapshot = await db.collection('articles').orderBy('publishedAt', 'desc').limit(limit).get();
        articles = snapshot.docs.map(d => d.data() as Article);
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
};
