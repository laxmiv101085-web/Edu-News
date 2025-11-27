import { Article } from './types';
import { v4 as uuidv4 } from 'uuid';

// Smart categorization based on article content
const detectCategory = (title: string, summary: string, defaultCategory: Article['category']): Article['category'] => {
    const text = (title + ' ' + summary).toLowerCase();

    // Check for job/vacancy keywords
    if (text.includes('vacancy') || text.includes('vacancies') || text.includes('recruitment') ||
        text.includes('hiring') || text.includes('jobs') || text.includes('employment')) {
        return 'jobs';
    }

    // Check for exam keywords (datesheet, timetable, exam, CTET, etc.)
    if (text.includes('exam') || text.includes('test') || text.includes('datesheet') ||
        text.includes('timetable') || text.includes('ctet') || text.includes('jee') ||
        text.includes('neet') || text.includes('entrance')) {
        return 'exams';
    }

    // Check for result keywords
    if (text.includes('result') || text.includes('scorecard') || text.includes('marks') ||
        text.includes('qualified') || text.includes('pass')) {
        return 'results';
    }

    // Check for admission keywords
    if (text.includes('admission') || text.includes('counseling') || text.includes('seat allotment') ||
        text.includes('application form') || text.includes('registration')) {
        return 'admissions';
    }

    // Check for scholarship keywords
    if (text.includes('scholarship') || text.includes('fellowship') || text.includes('grant')) {
        return 'scholarships';
    }

    return defaultCategory;
};

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
        const imgMatch = raw.content.match(/\<img[^>]+src="([^">]+)"/);
        if (imgMatch) {
            imageUrl = imgMatch[1];
        }
    }

    const title = raw.title || 'No Title';
    const summary = raw.description || raw.summary || raw.contentSnippet || '';

    // Auto-detect category based on content
    const smartCategory = detectCategory(title, summary, category);

    // This is a generic normalizer, specific providers might need their own mapping
    return {
        id: raw.id || raw.guid || uuidv4(),
        source: {
            id: sourceName.toLowerCase().replace(/\s+/g, '-'),
            name: sourceName,
            url: raw.sourceUrl || raw.link,
        },
        title,
        summary,
        content: raw.content || raw.contentSnippet || '',
        url: raw.link || raw.url,
        publishedAt: raw.pubDate ? new Date(raw.pubDate).toISOString() : new Date().toISOString(),
        category: smartCategory,
        tags: [],
        image_url: imageUrl,
        language: 'en',
    };
};
