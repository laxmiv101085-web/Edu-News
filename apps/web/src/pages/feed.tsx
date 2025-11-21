import React, { useState, useMemo } from 'react';
import Layout from '../components/Layout';
import NewsCard from '../components/app/NewsCard';
import CategoryFilters from '../components/app/CategoryFilters';
import SearchBar from '../components/app/SearchBar';
import { motion } from 'framer-motion';
import { Filter, RefreshCw } from 'lucide-react';
import { useRouter } from 'next/router';
import { useFeedStream } from '../hooks/useFeedStream';
import { useAuth } from '../hooks/useAuth';

export default function Feed() {
  const router = useRouter();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');

  // Get category from URL or default to 'all'
  const activeCategory = (router.query.category as string) || 'all';

  const setActiveCategory = (category: string) => {
    router.push({
      pathname: '/feed',
      query: category === 'all' ? {} : { category },
    }, undefined, { shallow: true });
  };

  // Use real-time feed stream
  const { articles, isConnected } = useFeedStream([]);

  const filteredArticles = useMemo(() => {
    return articles.filter((article) => {
      const matchesCategory = activeCategory === 'all' || article.category === activeCategory;
      const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.summary.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [articles, activeCategory, searchQuery]);

  return (
    <Layout title="News Feed - EduNews">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Your Feed</h1>
            <p className="text-neutral-400">
              {isConnected ? 'Live updates active.' : 'Connecting to live updates...'}
              {user && ` Welcome back, ${user.displayName?.split(' ')[0]}!`}
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

        {filteredArticles.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredArticles.map((article, index) => (
              <NewsCard key={article.id} article={article} index={index} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/5 mb-4">
              <Filter className="w-8 h-8 text-neutral-500" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">No updates found</h3>
            <p className="text-neutral-400">Try adjusting your search or filters.</p>
          </div>
        )}
      </div>
    </Layout>
  );
}
