import { Article, NewsProvider } from './types';
import { normalizeArticle } from './normalizer';

// Example adapter for NewsAPI.org
export class NewsAPIProvider implements NewsProvider {
    name = 'NewsAPI';
    apiKey: string;

    constructor(apiKey: string) {
        this.apiKey = apiKey;
    }

    async fetchArticles(): Promise<Article[]> {
        if (!this.apiKey) return [];

        try {
            const response = await fetch(
                `https://newsapi.org/v2/top-headlines?country=in&category=science&apiKey=${this.apiKey}`
            );
            const data = await response.json();

            if (data.status !== 'ok') {
                console.error('NewsAPI error:', data.message);
                return [];
            }

            return data.articles.map((item: any) => ({
                ...normalizeArticle(item, 'NewsAPI', 'general'),
                image: item.urlToImage, // Specific mapping for NewsAPI
                id: item.url, // Use URL as ID for dedupe
            }));
        } catch (error) {
            console.error('Failed to fetch from NewsAPI:', error);
            return [];
        }
    }
}

// You can add more providers here (NewsCatcher, GDELT, etc.)
