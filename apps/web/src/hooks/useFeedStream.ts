import { useEffect, useState, useCallback, useRef } from 'react';
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
    const [isLoading, setIsLoading] = useState(initialArticles.length === 0);
    const [error, setError] = useState<string | null>(null);

    // Ref to track the current active request to prevent race conditions
    const activeRequestRef = useRef<string>('');

    const fetchArticles = useCallback(async (pageNum: number, isReset: boolean, background: boolean = false) => {
        // Generate a unique ID for this request
        const requestId = `${category}-${search}-${pageNum}-${Date.now()}`;
        activeRequestRef.current = requestId;

        try {
            if (!background) {
                setIsLoading(true);
                setError(null);
            }

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
            if (activeRequestRef.current === requestId) {
                const newArticles = res.data?.items || [];
                const pagination = res.data?.pagination || { page: 1, totalPages: 1 };

                setArticles(prev => isReset ? newArticles : [...prev, ...newArticles]);
                setHasMore(pagination.page < pagination.totalPages);
            }

        } catch (err) {
            // Only update error if this is still the active request
            if (activeRequestRef.current === requestId) {
                console.error('Error fetching articles:', err);
                if (!background) setError('Failed to load articles');
            }
        } finally {
            // Only turn off loading if this is still the active request
            if (activeRequestRef.current === requestId && !background) {
                setIsLoading(false);
            }
        }
    }, [category, search]);

    // Reset when filters change
    useEffect(() => {
        setPage(1);
        setHasMore(true);
        setArticles([]); // Clear existing articles to avoid showing stale data
        setIsLoading(true); // Show loading state immediately
        fetchArticles(1, true);
    }, [fetchArticles]);

    // Auto-refresh every 60 seconds
    useEffect(() => {
        const refreshInterval = setInterval(() => {
            // Only auto-refresh if we are on the first page to avoid disrupting the user
            if (page === 1) {
                console.log('🔄 Auto-refreshing feed...');
                fetchArticles(1, true, true);
            }
        }, 60000); // 60 seconds

        return () => clearInterval(refreshInterval);
    }, [fetchArticles, page]);



    const loadMore = () => {
        if (!isLoading && hasMore) {
            const nextPage = page + 1;
            setPage(nextPage);
            fetchArticles(nextPage, false);
        }
    };

    return { articles, isLoading, hasMore, loadMore, error };
};
