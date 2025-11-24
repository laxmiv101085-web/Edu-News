import { Article } from './types';
import { v4 as uuidv4 } from 'uuid';

export const normalizeArticle = (raw: any, sourceName: string, category: Article['category']): Article => {
    // This is a generic normalizer, specific providers might need their own mapping
    return {
        id: raw.id || uuidv4(),
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
        image_url: raw.enclosure?.url || raw.image || raw.urlToImage, // Handle RSS enclosure or API image fields
        language: 'en',
    };
};
