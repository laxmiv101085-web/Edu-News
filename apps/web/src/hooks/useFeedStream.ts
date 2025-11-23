import { useEffect, useState } from 'react';
import { Article } from '../lib/news/types';

export const useFeedStream = (initialArticles: Article[] = []) => {
    const [articles, setArticles] = useState<Article[]>(initialArticles);
    const [isConnected, setIsConnected] = useState(true); // Default to true since we're using REST
    const [isLoading, setIsLoading] = useState(true);

    const fetchArticles = async () => {
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
            const res = await fetch(`${apiUrl}/api/feed?limit=50`);
            const data = await res.json();

            if (data.items) {
                setArticles(data.items);
            }
        } catch (error) {
            console.error('Error fetching articles:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchArticles();

        // Poll every minute for updates
        const interval = setInterval(fetchArticles, 60000);
        return () => clearInterval(interval);
    }, []);

    return { articles, setArticles, isConnected, isLoading };
};
