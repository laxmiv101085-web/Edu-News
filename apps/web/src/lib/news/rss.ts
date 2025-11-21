import Parser from 'rss-parser';
import { Article, NewsProvider } from './types';
import { normalizeArticle } from './normalizer';

const parser = new Parser();

export class RSSProvider implements NewsProvider {
    name: string;
    url: string;
    category: Article['category'];

    constructor(name: string, url: string, category: Article['category']) {
        this.name = name;
        this.url = url;
        this.category = category;
    }

    async fetchArticles(): Promise<Article[]> {
        try {
            const feed = await parser.parseURL(this.url);
            return feed.items.map((item) => normalizeArticle(item, this.name, this.category));
        } catch (error) {
            console.error(`Failed to fetch RSS feed from ${this.name}:`, error);
            return [];
        }
    }
}
