import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

interface Item {
  id: string;
  title: string;
  shortSummary: string;
  longSummary: string;
  type: string;
  publishedAt: string;
  url: string;
  tags: string[];
  source: {
    name: string;
    trustLevel: number;
  };
}

export default function Feed() {
  const router = useRouter();
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [filters, setFilters] = useState({
    type: '',
    search: '',
  });

  useEffect(() => {
    loadFeed();
  }, [page, filters]);

  const loadFeed = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '20',
        ...(filters.type && { type: filters.type }),
        ...(filters.search && { search: filters.search }),
      });

      const response = await axios.get(`${API_URL}/feed?${params}`);
      const newItems = response.data.items || [];
      
      if (page === 1) {
        setItems(newItems);
      } else {
        setItems((prev) => [...prev, ...newItems]);
      }
      
      setHasMore(newItems.length === 20);
    } catch (error) {
      console.error('Error loading feed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPage(1);
  };

  const loadMore = () => {
    if (!loading && hasMore) {
      setPage((prev) => prev + 1);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="text-2xl font-bold text-primary-600">
                EduNews
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/profile" className="text-gray-700 hover:text-primary-600">
                Profile
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">News Feed</h1>
          
          <div className="flex flex-wrap gap-4 mb-4">
            <input
              type="text"
              placeholder="Search..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="px-4 py-2 border rounded-lg flex-1 min-w-[200px]"
            />
            <select
              value={filters.type}
              onChange={(e) => handleFilterChange('type', e.target.value)}
              className="px-4 py-2 border rounded-lg"
            >
              <option value="">All Types</option>
              <option value="EXAM">Exams</option>
              <option value="SCHOLARSHIP">Scholarships</option>
              <option value="RESULT">Results</option>
              <option value="ADMISSION">Admissions</option>
              <option value="OTHER">Other</option>
            </select>
          </div>
        </div>

        {loading && items.length === 0 ? (
          <div className="text-center py-12">Loading...</div>
        ) : (
          <div className="space-y-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => router.push(`/item/${item.id}`)}
              >
                <div className="flex justify-between items-start mb-2">
                  <h2 className="text-xl font-semibold text-gray-900">{item.title}</h2>
                  <span className="px-2 py-1 bg-primary-100 text-primary-700 rounded text-sm">
                    {item.type}
                  </span>
                </div>
                <p className="text-gray-600 mb-3">{item.shortSummary || item.longSummary}</p>
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span>{item.source.name}</span>
                    <span>•</span>
                    <span>{new Date(item.publishedAt).toLocaleDateString()}</span>
                  </div>
                  {item.tags && item.tags.length > 0 && (
                    <div className="flex space-x-2">
                      {item.tags.slice(0, 3).map((tag, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {hasMore && (
              <button
                onClick={loadMore}
                disabled={loading}
                className="w-full py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50"
              >
                {loading ? 'Loading...' : 'Load More'}
              </button>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

