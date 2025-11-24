import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import NewsCard from '../components/app/NewsCard';
import CategoryFilters from '../components/app/CategoryFilters';
import SearchBar from '../components/app/SearchBar';
import { Filter, RefreshCw } from 'lucide-react';
import { useRouter } from 'next/router';
import { useFeedStream } from '../hooks/useFeedStream';
import { useAuth } from '../hooks/useAuth';

export default function Feed() {
  const router = useRouter();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Get category from URL or default to 'all'
  const activeCategory = (router.query.category as string) || 'all';

  const setActiveCategory = (category: string) => {
    router.push({
      pathname: '/feed',
      query: category === 'all' ? {} : { category },
    }, undefined, { shallow: true });
  };

  // Use paginated feed stream
  const { articles, isLoading, hasMore, loadMore, error } = useFeedStream({
    category: activeCategory,
    search: debouncedSearch
  });

  const seoTitle = activeCategory === 'all'
    ? 'Latest Education News & Updates'
    : `${activeCategory.charAt(0).toUpperCase() + activeCategory.slice(1)} News - EduNews`;

  return (
    <Layout
      title={seoTitle}
      description={`Stay updated with the latest ${activeCategory === 'all' ? 'education' : activeCategory} news, exam results, and scholarship announcements in real-time.`}
      keywords={`education news, ${activeCategory}, exam results, scholarships, india`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Your Feed</h1>
            <p className="text-neutral-400">
              {user ? `Welcome back, ${user.name?.split(' ')[0]}!` : 'Real-time education updates.'}
            </p>
          </div>
          <SearchBar value={searchQuery} onChange={setSearchQuery} />
        </div>

        <div className="flex items-center gap-4 mb-8 overflow-x-auto pb-2">
          <div className="flex items-center text-neutral-400 text-sm font-medium">
            <Filter className="w-4 h-4 mr-2" />
            Filters:
          </div>
          <CategoryFilters activeCategory={activeCategory} onSelectCategory={setActiveCategory} />
        </div>

        {error && (
          <div className="text-red-400 mb-8 text-center bg-red-500/10 p-4 rounded-xl border border-red-500/20">
            {error}
          </div>
        )}

        {articles.length > 0 ? (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {articles.map((article, index) => (
                <NewsCard key={`${article.id}-${index}`} article={article} index={index} />
              ))}
            </div>

            {hasMore && (
              <div className="flex justify-center pb-12">
                <button
                  onClick={loadMore}
                  disabled={isLoading}
                  className="px-8 py-3 rounded-xl bg-white/5 border border-white/10 text-white font-medium hover:bg-white/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <RefreshCw className="w-5 h-5 animate-spin" />
                      Loading...
                    </>
                  ) : (
                    'Load More Articles'
                  )}
                </button>
              </div>
            )}

            {!hasMore && articles.length > 0 && (
              <div className="text-center text-neutral-500 pb-12">
                You've reached the end of the feed.
              </div>
            )}
          </>
        ) : (
          !isLoading && (
            <div className="text-center py-20">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/5 mb-4">
                <Filter className="w-8 h-8 text-neutral-500" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">No updates found</h3>
              <p className="text-neutral-400">Try adjusting your search or filters.</p>
            </div>
          )
        )}

        {isLoading && articles.length === 0 && (
          <div className="flex justify-center py-20">
            <RefreshCw className="w-8 h-8 text-accent-yellow animate-spin" />
          </div>
        )}
      </div>
    </Layout>
  );
}
