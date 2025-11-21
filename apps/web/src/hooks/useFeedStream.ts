import { useEffect, useState } from 'react';
import { Article } from '../lib/news/types';

export const useFeedStream = (initialArticles: Article[] = []) => {
    const [articles, setArticles] = useState<Article[]>(initialArticles);
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        const eventSource = new EventSource('/api/stream/updates');

        eventSource.onopen = () => {
            setIsConnected(true);
            console.log('SSE Connected');
        };

        eventSource.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                if (data.type === 'update') {
                    console.log('New update received, refreshing feed...');
                    // In a real app, we might fetch only the new items or just re-fetch the list
                    // For simplicity, let's just re-fetch the latest
                    fetch('/api/feeds/list?limit=5')
                        .then(res => res.json())
                        .then(data => {
                            if (data.articles) {
                                setArticles(prev => {
                                    // Merge and dedupe
                                    const newIds = new Set(data.articles.map((a: Article) => a.id));
                                    const filteredPrev = prev.filter(a => !newIds.has(a.id));
                                    return [...data.articles, ...filteredPrev];
                                });
                            }
                        });
                }
            } catch (e) {
                console.error('Error parsing SSE message', e);
            }
        };

        eventSource.onerror = (error) => {
            console.error('SSE Error', error);
            eventSource.close();
            setIsConnected(false);
            // Reconnect logic could go here (EventSource auto-reconnects by default though)
        };

        return () => {
            eventSource.close();
        };
    }, []);

    return { articles, setArticles, isConnected };
};
