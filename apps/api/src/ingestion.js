import Parser from 'rss-parser';
import axios from 'axios';
import pool from './database.js';
import dotenv from 'dotenv';

dotenv.config();

const rssParser = new Parser({
    customFields: {
        item: [
            ['media:content', 'mediaContent'],
            ['content:encoded', 'contentEncoded'],
            ['description', 'description']
        ]
    }
});

// Get news sources from environment
const NEWS_SOURCES = process.env.NEWS_SOURCES
    ? process.env.NEWS_SOURCES.split(',')
    : [];

/**
 * Extract image URL from various RSS feed formats
 */
function extractImageUrl(item) {
    // Try media:content
    if (item.mediaContent && item.mediaContent.$) {
        return item.mediaContent.$.url;
    }

    // Try enclosure
    if (item.enclosure && item.enclosure.url) {
        return item.enclosure.url;
    }

    // Try to find image in content
    if (item.contentEncoded || item.content) {
        const content = item.contentEncoded || item.content;
        const imgMatch = content.match(/<img[^>]+src="([^">]+)"/);
        if (imgMatch) {
            return imgMatch[1];
        }
    }

    return null;
}

/**
 * Clean and truncate text
 */
function cleanText(text, maxLength = 500) {
    if (!text) return '';

    // Remove HTML tags
    const cleaned = text.replace(/<[^>]*>/g, '').trim();

    if (cleaned.length <= maxLength) {
        return cleaned;
    }

    return cleaned.substring(0, maxLength) + '...';
}

/**
 * Categorize article based on title and content
 */
function categorizeArticle(title, content) {
    const text = (title + ' ' + content).toLowerCase();

    if (text.match(/\b(exam|test|jee|neet|upsc|gate|cat|gmat)\b/)) {
        return 'exam';
    }
    if (text.match(/\b(scholarship|grant|fellowship|stipend)\b/)) {
        return 'scholarship';
    }
    if (text.match(/\b(result|score|marks|rank)\b/)) {
        return 'result';
    }
    if (text.match(/\b(admission|enrollment|application)\b/)) {
        return 'admission';
    }

    return 'general';
}

/**
 * Ingest articles from a single RSS feed
 */
async function ingestFromFeed(feedUrl) {
    try {
        console.log(`📥 Fetching feed: ${feedUrl}`);

        let feed;

        // Check if it's a JSON feed or RSS feed
        if (feedUrl.endsWith('.json')) {
            const response = await axios.get(feedUrl);
            feed = response.data;

            // Process JSON feed
            if (feed.items) {
                return await processJsonFeed(feed);
            }
        } else {
            // Parse RSS feed
            feed = await rssParser.parseURL(feedUrl);
            return await processRssFeed(feed);
        }

    } catch (error) {
        console.error(`❌ Error ingesting from ${feedUrl}:`, error.message);
        return { success: false, error: error.message };
    }
}

/**
 * Process RSS feed items
 */
async function processRssFeed(feed) {
    let inserted = 0;
    let skipped = 0;

    for (const item of feed.items || []) {
        try {
            const article = {
                title: cleanText(item.title, 500),
                content: cleanText(item.contentEncoded || item.content || item.description, 5000),
                summary: cleanText(item.description || item.summary, 500),
                url: item.link || item.guid,
                author: item.creator || item.author || feed.title,
                source: feed.title || 'Unknown',
                image_url: extractImageUrl(item),
                published_at: item.pubDate ? new Date(item.pubDate) : new Date(),
                category: 'general'
            };

            // Categorize
            article.category = categorizeArticle(article.title, article.content);

            // Insert into database
            const result = await insertArticle(article);

            if (result.success) {
                inserted++;
            } else {
                skipped++;
            }

        } catch (error) {
            console.error(`Error processing item:`, error.message);
            skipped++;
        }
    }

    return { success: true, inserted, skipped, total: feed.items?.length || 0 };
}

/**
 * Process JSON feed items
 */
async function processJsonFeed(feed) {
    let inserted = 0;
    let skipped = 0;

    for (const item of feed.items || []) {
        try {
            const article = {
                title: cleanText(item.title, 500),
                content: cleanText(item.content_html || item.content_text || item.summary, 5000),
                summary: cleanText(item.summary || item.content_text, 500),
                url: item.url || item.id,
                author: item.author?.name || feed.title,
                source: feed.title || 'Unknown',
                image_url: item.image || item.banner_image,
                published_at: item.date_published ? new Date(item.date_published) : new Date(),
                category: 'general'
            };

            // Categorize
            article.category = categorizeArticle(article.title, article.content);

            // Insert into database
            const result = await insertArticle(article);

            if (result.success) {
                inserted++;
            } else {
                skipped++;
            }

        } catch (error) {
            console.error(`Error processing item:`, error.message);
            skipped++;
        }
    }

    return { success: true, inserted, skipped, total: feed.items?.length || 0 };
}

/**
 * Insert article into database (skip if URL already exists)
 */
async function insertArticle(article) {
    const client = await pool.connect();

    try {
        // Check if article already exists
        const existing = await client.query(
            'SELECT id FROM articles WHERE url = $1',
            [article.url]
        );

        if (existing.rows.length > 0) {
            return { success: false, reason: 'duplicate' };
        }

        // Insert new article
        await client.query(
            `INSERT INTO articles 
       (title, content, summary, category, source, author, image_url, url, published_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
            [
                article.title,
                article.content,
                article.summary,
                article.category,
                article.source,
                article.author,
                article.image_url,
                article.url,
                article.published_at
            ]
        );

        return { success: true };

    } catch (error) {
        console.error('Error inserting article:', error.message);
        return { success: false, error: error.message };
    } finally {
        client.release();
    }
}

/**
 * Ingest from NewsAPI.org
 */
async function ingestFromNewsAPI() {
    const apiKey = process.env.NEWS_API_KEY;
    if (!apiKey) return { success: false, message: 'No NEWS_API_KEY configured' };

    try {
        console.log('📥 Fetching from NewsAPI.org...');
        // Fetch education related news
        const response = await axios.get('https://newsapi.org/v2/everything', {
            params: {
                q: 'education OR "entrance exam" OR university OR scholarship OR "cbse board"',
                language: 'en',
                sortBy: 'publishedAt',
                apiKey: apiKey
            }
        });

        const articles = response.data.articles || [];
        let inserted = 0;
        let skipped = 0;

        for (const item of articles) {
            try {
                // Skip removed content
                if (item.title === '[Removed]') continue;

                const article = {
                    title: cleanText(item.title, 500),
                    content: cleanText(item.content || item.description, 5000),
                    summary: cleanText(item.description, 500),
                    url: item.url,
                    author: item.author || item.source.name,
                    source: item.source.name || 'NewsAPI',
                    image_url: item.urlToImage,
                    published_at: item.publishedAt ? new Date(item.publishedAt) : new Date(),
                    category: 'general'
                };

                // Categorize
                article.category = categorizeArticle(article.title, article.content);

                // Insert into database
                const result = await insertArticle(article);
                if (result.success) inserted++;
                else skipped++;

            } catch (err) {
                console.error('Error processing NewsAPI item:', err.message);
                skipped++;
            }
        }

        return { success: true, inserted, skipped, total: articles.length };

    } catch (error) {
        console.error('❌ Error fetching from NewsAPI:', error.message);
        return { success: false, error: error.message };
    }
}

/**
 * Run ingestion for all configured feeds
 */
export async function runIngestion() {
    console.log('🚀 Starting news ingestion...');
    const results = [];

    // 1. Ingest from NewsAPI (if configured)
    if (process.env.NEWS_API_KEY) {
        const newsApiResult = await ingestFromNewsAPI();
        results.push({ source: 'NewsAPI', ...newsApiResult });
    }

    // 2. Ingest from RSS Feeds
    if (NEWS_SOURCES.length > 0) {
        console.log(`📡 Processing ${NEWS_SOURCES.length} RSS source(s)`);
        for (const feedUrl of NEWS_SOURCES) {
            const result = await ingestFromFeed(feedUrl.trim());
            results.push({ feedUrl: feedUrl.trim(), ...result });
        }
    } else {
        console.log('⚠️  No RSS sources configured');
    }

    // Summary
    const totalInserted = results.reduce((sum, r) => sum + (r.inserted || 0), 0);
    const totalSkipped = results.reduce((sum, r) => sum + (r.skipped || 0), 0);

    console.log(`✅ Ingestion complete! Inserted: ${totalInserted}, Skipped: ${totalSkipped}`);

    return {
        success: true,
        results,
        summary: {
            totalInserted,
            totalSkipped,
            totalSources: NEWS_SOURCES.length + (process.env.NEWS_API_KEY ? 1 : 0)
        }
    };
}

export default { runIngestion };
