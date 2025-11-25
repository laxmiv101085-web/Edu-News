import Parser from 'rss-parser';
import axios from 'axios';
import pool from './database.js';
import dotenv from 'dotenv';

dotenv.config();

const rssParser = new Parser({
    customFields: {
        item: [
            ['media:content', 'mediaContent'],
            ['media:thumbnail', 'mediaThumbnail'],
            ['content:encoded', 'contentEncoded'],
            ['description', 'description'],
            ['enclosure', 'enclosure'],
            ['image', 'image'],
            ['itunes:image', 'itunesImage']
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
    // Try media:content (YouTube, etc.)
    if (item.mediaContent) {
        if (item.mediaContent.$ && item.mediaContent.$.url) {
            return item.mediaContent.$.url;
        }
        if (typeof item.mediaContent === 'string') {
            return item.mediaContent;
        }
    }

    // Try media:thumbnail
    if (item['media:thumbnail'] && item['media:thumbnail'].$ && item['media:thumbnail'].$.url) {
        return item['media:thumbnail'].$.url;
    }

    // Try enclosure (common in RSS 2.0)
    if (item.enclosure) {
        if (item.enclosure.url) {
            return item.enclosure.url;
        }
        if (item.enclosure.$ && item.enclosure.$.url) {
            return item.enclosure.$.url;
        }
    }

    // Try direct image field
    if (item.image) {
        if (typeof item.image === 'string') {
            return item.image;
        }
        if (item.image.url) {
            return item.image.url;
        }
    }

    // Try to find image in content:encoded or content
    if (item.contentEncoded || item.content) {
        const content = item.contentEncoded || item.content;

        // Try multiple image patterns
        const patterns = [
            /<img[^>]+src=["']([^"']+)["']/i,
            /<img[^>]+src=([^\s>]+)/i,
            /https?:\/\/[^\s<>"]+\.(?:jpg|jpeg|png|gif|webp)/i
        ];

        for (const pattern of patterns) {
            const match = content.match(pattern);
            if (match) {
                return match[1] || match[0];
            }
        }
    }

    // Try description field
    if (item.description) {
        const imgMatch = item.description.match(/<img[^>]+src=["']([^"']+)["']/i);
        if (imgMatch) {
            return imgMatch[1];
        }
    }

    return null;
}

/**
 * Fetch article page and extract og:image
 */
async function scrapeImageFromUrl(url) {
    if (!url) return null;
    try {
        const response = await axios.get(url, {
            timeout: 5000,
            headers: { 'User-Agent': 'Mozilla/5.0 (compatible; EduNewsBot/1.0)' }
        });
        const html = response.data;

        // Look for og:image
        const ogImageMatch = html.match(/<meta[^>]+property="og:image"[^>]+content="([^">]+)"/i) ||
            html.match(/<meta[^>]+content="([^">]+)"[^>]+property="og:image"/i);

        if (ogImageMatch) {
            return ogImageMatch[1];
        }

        // Look for twitter:image
        const twitterImageMatch = html.match(/<meta[^>]+name="twitter:image"[^>]+content="([^">]+)"/i) ||
            html.match(/<meta[^>]+content="([^">]+)"[^>]+name="twitter:image"/i);

        if (twitterImageMatch) {
            return twitterImageMatch[1];
        }

    } catch (error) {
        // Ignore errors, just return null
        // console.log(`Failed to scrape image from ${url}: ${error.message}`);
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
 * Check if content is education-related
 */
function isEducationalContent(title, content, summary) {
    const text = (title + ' ' + content + ' ' + summary).toLowerCase();

    // Must have education-related keywords
    const educationKeywords = [
        'education', 'school', 'college', 'university', 'student',
        'exam', 'test', 'jee', 'neet', 'upsc', 'gate', 'cat',
        'admission', 'scholarship', 'result', 'cutoff', 'merit',
        'cbse', 'icse', 'board', 'iit', 'nit', 'aiims',
        'registration', 'counseling', 'syllabus', 'course',
        'degree', 'diploma', 'coaching', 'academic', 'learning'
    ];

    // Definitely NOT education - auto-reject
    const excludeKeywords = [
        'murder', 'rape', 'killed', 'arrested', 'crime',
        'cricket', 'football', 'bollywood', 'actor',
        'stock market', 'shares', 'profit'
    ];

    // Check for exclude keywords first
    const hasExcluded = excludeKeywords.some(keyword => text.includes(keyword));
    if (hasExcluded) return false;

    // Accept if has any education keyword
    const hasEducation = educationKeywords.some(keyword => text.includes(keyword));
    return hasEducation;
}

/**
 * Categorize article based on title and content
 */
function categorizeArticle(title, content) {
    const text = (title + ' ' + content).toLowerCase();

    // Exams - Registration, dates, patterns, syllabus
    if (text.match(/\b(jee|neet|upsc|gate|cat|clat|nda|cds|ssc|ibps|rrb|railway)\b/i) &&
        text.match(/\b(registration|exam|test|admit card|hall ticket|pattern|syllabus|schedule|date|application)\b/i)) {
        return 'exams';
    }

    // Results - Cutoffs, merit lists, answer keys, marks
    if (text.match(/\b(result|cutoff|cut off|merit|rank|topper|marks|answer key|scorecard|qualifying)\b/i)) {
        return 'results';
    }

    // Scholarships - Financial aid, fellowships
    if (text.match(/\b(scholarship|fellowship|grant|stipend|financial aid|award)\b/i)) {
        return 'scholarships';
    }

    // Admissions - College admissions, counseling, seat allotment
    if (text.match(/\b(admission|admissions|counseling|counselling|seat allotment|application|apply|enrollment)\b/i)) {
        return 'admissions';
    }

    // Policy - Government decisions, new rules
    if (text.match(/\b(policy|government|ministry|ugc|aicte|rule|regulation|announcement)\b/i)) {
        return 'policy';
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

            // If no image found, try to scrape it
            if (!article.image_url) {
                article.image_url = await scrapeImageFromUrl(article.url);
            }

            // Categorize
            article.category = categorizeArticle(article.title, article.content);

            // Filter: Only process educational content
            if (!isEducationalContent(article.title, article.content, article.summary)) {
                console.log(`⊘ Skipping non-educational article: ${article.title.substring(0, 50)}...`);
                skipped++;
                continue;
            }

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

                // Filter: Only process educational content
                if (!isEducationalContent(article.title, article.content, article.summary)) {
                    skipped++;
                    continue;
                }

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
