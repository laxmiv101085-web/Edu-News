import { Article } from './types';
import { v4 as uuidv4 } from 'uuid';

export const normalizeArticle = (raw: any, sourceName: string, category: Article['category']): Article => {
    // Extract image from various possible RSS fields
    let imageUrl = raw.enclosure?.url ||
        raw.image?.url ||
        raw.image ||
        raw.urlToImage ||
        raw['media:content']?.['$']?.url ||
        raw['media:thumbnail']?.['$']?.url;

    // If no image found, try to extract from content
    if (!imageUrl && raw.content) {
        const imgMatch = raw.content.match(/<img[^>]+src="([^">]+)"/);
        if (imgMatch) {
            imageUrl = imgMatch[1];
        }
    }

    // This is a generic normalizer, specific providers might need their own mapping
    return {
        id: raw.id || raw.guid || uuidv4(),
        source: {
            id: sourceName.toLowerCase().replace(/\s+/g, '-'),
            name: sourceName,
            url: raw.sourceUrl || raw.link,
        },
        title: raw.title || 'No Title',
        summary: raw.description || raw.summary || raw.contentSnippet || '',
        content: raw.content || raw.contentSnippet || '',
        url: raw.link || raw.url,
        publishedAt: raw.pubDate ? new Date(raw.pubDate).toISOString() : new Date().toISOString(),
        category: category,
        tags: [],
        image_url: imageUrl,
        language: 'en',
    };
};
