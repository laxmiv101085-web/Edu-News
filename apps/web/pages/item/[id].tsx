import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

interface Item {
  id: string;
  title: string;
  body: string;
  shortSummary: string;
  longSummary: string;
  type: string;
  publishedAt: string;
  url: string;
  tags: string[];
  extractedEntities: any;
  source: {
    name: string;
    trustLevel: number;
    url: string;
  };
}

export default function ItemPage() {
  const router = useRouter();
  const { id } = router.query;
  const [item, setItem] = useState<Item | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      loadItem();
    }
  }, [id]);

  const loadItem = async () => {
    try {
      const response = await axios.get(`${API_URL}/feed/items/${id}`);
      setItem(response.data);
    } catch (error) {
      console.error('Error loading item:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!item) {
    return <div className="min-h-screen flex items-center justify-center">Item not found</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/feed" className="text-2xl font-bold text-primary-600">
                EduNews
              </Link>
            </div>
            <Link href="/feed" className="flex items-center text-gray-700 hover:text-primary-600">
              ← Back to Feed
            </Link>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <article className="bg-white rounded-lg shadow-md p-8">
          <div className="mb-6">
            <div className="flex justify-between items-start mb-4">
              <h1 className="text-3xl font-bold text-gray-900">{item.title}</h1>
              <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded">
                {item.type}
              </span>
            </div>
            <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
              <span>{item.source.name}</span>
              <span>•</span>
              <span>Trust Level: {item.source.trustLevel}/10</span>
              <span>•</span>
              <span>{new Date(item.publishedAt).toLocaleDateString()}</span>
            </div>
          </div>

          {item.shortSummary && (
            <div className="mb-6 p-4 bg-blue-50 rounded-lg">
              <h2 className="font-semibold mb-2">Summary</h2>
              <p className="text-gray-700">{item.shortSummary}</p>
            </div>
          )}

          {item.longSummary && (
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-3">Detailed Summary</h2>
              <p className="text-gray-700 leading-relaxed">{item.longSummary}</p>
            </div>
          )}

          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-3">Full Content</h2>
            <div className="text-gray-700 whitespace-pre-wrap">{item.body}</div>
          </div>

          {item.extractedEntities && (
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <h2 className="font-semibold mb-3">Key Information</h2>
              <dl className="grid grid-cols-2 gap-4">
                {item.extractedEntities.examName && (
                  <>
                    <dt className="font-medium">Exam Name:</dt>
                    <dd>{item.extractedEntities.examName}</dd>
                  </>
                )}
                {item.extractedEntities.institution && (
                  <>
                    <dt className="font-medium">Institution:</dt>
                    <dd>{item.extractedEntities.institution}</dd>
                  </>
                )}
                {item.extractedEntities.lastDate && (
                  <>
                    <dt className="font-medium">Last Date:</dt>
                    <dd>{item.extractedEntities.lastDate}</dd>
                  </>
                )}
                {item.extractedEntities.startDate && (
                  <>
                    <dt className="font-medium">Start Date:</dt>
                    <dd>{item.extractedEntities.startDate}</dd>
                  </>
                )}
              </dl>
            </div>
          )}

          {item.tags && item.tags.length > 0 && (
            <div className="mb-6">
              <h2 className="font-semibold mb-2">Tags</h2>
              <div className="flex flex-wrap gap-2">
                {item.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="flex space-x-4 pt-6 border-t">
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
            >
              View Original Source
            </a>
            <button className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              Share
            </button>
          </div>
        </article>
      </main>
    </div>
  );
}

