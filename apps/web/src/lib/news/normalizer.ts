import { Article } from './types';
import { v4 as uuidv4 } from 'uuid';

// Smart categorization based on article content
const detectCategory = (title: string, summary: string, defaultCategory: Article['category']): Article['category'] => {
    const text = (title + ' ' + summary).toLowerCase();

    // PRIORITY 1: Check for job/vacancy keywords FIRST (most specific)
    const jobKeywords = [
        'vacancy', 'vacancies', 'recruitment', 'hiring', 'jobs', 'employment',
        'ssc', 'railway', 'rrb', 'ibps', 'bank recruitment', 'government jobs',
        'posts', 'mts', 'havaldar', 'constable', 'clerk', 'stenographer',
        'recruitment 2025', 'recruitment 2026', 'application invited'
    ];
    if (jobKeywords.some(keyword => text.includes(keyword))) {
        return 'jobs';
    }

    // PRIORITY 2: Check for exam keywords (very comprehensive)
    const examKeywords = [
        'exam', 'test', 'examination', 'datesheet', 'date sheet',
        'timetable', 'time table', 'ctet', 'tet', 'jee', 'neet',
        'entrance', 'entrance exam', 'competitive exam',
        'rbse', 'cbse', 'icse', 'board exam', 'board examination',
        'class 10', 'class 12', '10th', '12th', 'ssc exam', 'hsc exam',
        'admit card', 'hall ticket', 'exam schedule', 'exam notification',
        'upcoming exam', 'exam date', 'conduct exam', 'hold exam',
        'exam registration', 'apply for exam', 'exam form'
    ];
    if (examKeywords.some(keyword => text.includes(keyword))) {
        return 'exams';
    }

    // PRIORITY 3: Check for result keywords
    const resultKeywords = [
        'result', 'results', 'scorecard', 'score card', 'marks',
        'qualified', 'pass', 'merit list', 'toppers', 'declaration',
        'result declared', 'result released', 'result announced',
        'check result', 'download result', 'result out'
    ];
    if (resultKeywords.some(keyword => text.includes(keyword))) {
        return 'results';
    }

    // PRIORITY 4: Check for admission keywords
    const admissionKeywords = [
        'admission', 'admissions', 'counseling', 'counselling',
        'seat allotment', 'application form', 'registration',
        'apply online', 'online application', 'last date',
        'admission process', 'admission notification'
    ];
    if (admissionKeywords.some(keyword => text.includes(keyword))) {
        return 'admissions';
    }

    // PRIORITY 5: Check for scholarship keywords
    const scholarshipKeywords = [
        'scholarship', 'scholarships', 'fellowship', 'fellowships',
        'grant', 'financial aid', 'stipend', 'scholarship program'
    ];
    if (scholarshipKeywords.some(keyword => text.includes(keyword))) {
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

    // Special handling for PM Narendra Modi channel - use his official portrait
    if (sourceName === 'Narendra Modi' && !imageUrl) {
        imageUrl = 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/49/Narendra_Modi_2022_portrait.jpg/800px-Narendra_Modi_2022_portrait.jpg';
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
