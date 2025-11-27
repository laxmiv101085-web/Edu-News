export interface Article {
    id: string;
    source: {
        id: string;
        name: string;
        url?: string;
    };
    title: string;
    summary: string;
    content?: string;
    url: string;
    publishedAt: string; // ISO string
    category: 'scholarships' | 'exams' | 'results' | 'admissions' | 'jobs' | 'general';
    tags: string[];
    image_url?: string;
    language: string;
    authorityScore?: number;
}

export interface NewsProvider {
    name: string;
    fetchArticles: () => Promise<Article[]>;
}
