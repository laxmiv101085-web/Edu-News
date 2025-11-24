import Parser from 'rss-parser';
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

async function testImageExtraction() {
    const testFeeds = [
        'https://indianexpress.com/section/india/education/feed/',
        'https://www.thehindu.com/feeder/default.rss',
        'https://timesofindia.indiatimes.com/rssfeeds/913168846.cms'
    ];

    console.log('🧪 Testing Image Extraction from RSS Feeds\n');

    for (const feedUrl of testFeeds) {
        try {
            console.log(`📡 Testing: ${feedUrl}`);
            const feed = await rssParser.parseURL(feedUrl);

            let withImages = 0;
            let withoutImages = 0;

            for (const item of feed.items.slice(0, 5)) {
                const imageUrl = extractImageUrl(item);
                if (imageUrl) {
                    withImages++;
                    console.log(`   ✅ ${item.title.substring(0, 50)}...`);
                    console.log(`      Image: ${imageUrl.substring(0, 80)}...`);
                } else {
                    withoutImages++;
                    console.log(`   ❌ ${item.title.substring(0, 50)}... (NO IMAGE)`);
                }
            }

            console.log(`   Summary: ${withImages} with images, ${withoutImages} without\n`);

        } catch (error) {
            console.error(`   ❌ Error: ${error.message}\n`);
        }
    }
}

testImageExtraction();
