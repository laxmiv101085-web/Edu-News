import { useState, useEffect, useCallback } from 'react';
import api from '../lib/api/client';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-hot-toast';

export const useBookmarks = () => {
  const { user } = useAuth();
  const [savedIds, setSavedIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch bookmarks
  const fetchBookmarks = useCallback(async () => {
    if (!user) return;

    try {
      setLoading(true);
      const response = await api.get('/api/bookmarks');
      const ids = response.data.map((article: any) => Number(article.id));
      setSavedIds(ids);
    } catch (error) {
      console.error('Error fetching bookmarks:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchBookmarks();
  }, [fetchBookmarks]);

  const isSaved = (articleId: number | string) => savedIds.includes(Number(articleId));

  const toggleBookmark = async (articleId: number | string) => {
    if (!user) {
      toast.error('Please login to save articles');
      return;
    }

    const id = Number(articleId);

    // Optimistic update
    const currentlySaved = isSaved(id);
    setSavedIds(prev =>
      currentlySaved
        ? prev.filter(savedId => savedId !== id)
        : [...prev, id]
    );

    try {
      if (currentlySaved) {
        await api.delete(`/api/bookmarks/${id}`);
        toast.success('Article removed from bookmarks');
      } else {
        await api.post('/api/bookmarks', { articleId: id });
        toast.success('Article saved to bookmarks');
      }
    } catch (error) {
      // Revert on error
      setSavedIds(prev =>
        currentlySaved
          ? [...prev, id]
          : prev.filter(savedId => savedId !== id)
      );
      toast.error('Failed to update bookmark');
      console.error('Bookmark error:', error);
    }
  };

  return {
    savedIds,
    isSaved,
    toggleBookmark,
    loading,
    refreshBookmarks: fetchBookmarks
  };
};
