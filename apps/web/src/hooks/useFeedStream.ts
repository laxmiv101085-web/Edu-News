import { useEffect, useState, useCallback } from 'react';
import { Article } from '../lib/news/types';
import api from '../lib/api/client';

interface UseFeedProps {
    category?: string;
    search?: string;
    initialArticles?: Article[];
}

export const useFeedStream = ({ category = 'all', search = '', initialArticles = [] }: UseFeedProps) => {
    const [articles, setArticles] = useState<Article[]>(initialArticles);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Ref to track the current active request to prevent race conditions
    const activeRequestRef = useState<{ id: string }>({ id: '' })[0];

    const fetchArticles = useCallback(async (pageNum: number, isReset: boolean) => {
        // Generate a unique ID for this request
        const requestId = `${category}-${search}-${pageNum}-${Date.now()}`;
        activeRequestRef.id = requestId;

        try {
            setIsLoading(true);
            setError(null);

            const params = new URLSearchParams({
                page: pageNum.toString(),
                limit: '12',
            });

            if (category && category !== 'all') {
                params.append('category', category);
            }

            if (search) {
                params.append('search', search);
            }

            const res = await api.get(`/api/feeds/list?${params.toString()}`);

            // Only update state if this is still the active request
            if (activeRequestRef.id === requestId) {
                const newArticles = res.data?.items || [];
                const pagination = res.data?.pagination || { page: 1, totalPages: 1 };

                setArticles(prev => isReset ? newArticles : [...prev, ...newArticles]);
                setHasMore(pagination.page < pagination.totalPages);
            }

        } catch (err) {
            // Only update error if this is still the active request
            if (activeRequestRef.id === requestId) {
                console.error('Error fetching articles:', err);
                setError('Failed to load articles');
            }
        } finally {
            // Only turn off loading if this is still the active request
            if (activeRequestRef.id === requestId) {
                setIsLoading(false);
            }
        }
    }, [category, search, activeRequestRef]);

    // Reset when filters change
    useEffect(() => {
        setPage(1);
        setHasMore(true);
        fetchArticles(1, true);
    }, [fetchArticles]);

    // Auto-refresh every 60 seconds
    useEffect(() => {
        const refreshInterval = setInterval(() => {
            console.log('🔄 Auto-refreshing feed...');
            // When auto-refreshing, we want to fetch the first page and reset the articles
            fetchArticles(1, true);
        }, 60000); // 60 seconds

        return () => clearInterval(refreshInterval);
    }, [fetchArticles]);

    const loadMore = () => {
        if (!isLoading && hasMore) {
            const nextPage = page + 1;
            setPage(nextPage);
            fetchArticles(nextPage, false);
        }
    };

    return { articles, isLoading, hasMore, loadMore, error };
};
