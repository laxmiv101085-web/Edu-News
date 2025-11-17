import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

interface Source {
  id: string;
  name: string;
  url: string;
  sourceType: string;
  trustLevel: number;
  pollIntervalMinutes: number;
  active: boolean;
  lastFetch: string | null;
}

export default function Admin() {
  const router = useRouter();
  const [sources, setSources] = useState<Source[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateSource, setShowCreateSource] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }
    loadSources();
  }, []);

  const loadSources = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/sources`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSources(response.data);
    } catch (error) {
      console.error('Error loading sources:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteSource = async (id: string) => {
    if (!confirm('Are you sure you want to delete this source?')) return;

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/sources/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      loadSources();
    } catch (error) {
      console.error('Error deleting source:', error);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
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
            <div className="flex items-center space-x-4">
              <Link href="/feed" className="text-gray-700 hover:text-primary-600">
                Feed
              </Link>
              <Link href="/profile" className="text-gray-700 hover:text-primary-600">
                Profile
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Panel</h1>
          <button
            onClick={() => setShowCreateSource(!showCreateSource)}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
          >
            {showCreateSource ? 'Cancel' : 'Add Source'}
          </button>
        </div>

        {showCreateSource && (
          <CreateSourceForm
            onSuccess={() => {
              setShowCreateSource(false);
              loadSources();
            }}
          />
        )}

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  URL
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Trust Level
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Poll Interval
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sources.map((source) => (
                <tr key={source.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {source.name}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    <a href={source.url} target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline">
                      {source.url.substring(0, 50)}...
                    </a>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {source.sourceType}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {source.trustLevel}/10
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {source.pollIntervalMinutes} min
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        source.active
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {source.active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => deleteSource(source.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}

function CreateSourceForm({ onSuccess }: { onSuccess: () => void }) {
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [sourceType, setSourceType] = useState('RSS');
  const [trustLevel, setTrustLevel] = useState(5);
  const [pollIntervalMinutes, setPollIntervalMinutes] = useState(60);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `${API_URL}/sources`,
        {
          name,
          url,
          sourceType,
          trustLevel,
          pollIntervalMinutes,
          active: true,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      onSuccess();
    } catch (error) {
      console.error('Error creating source:', error);
      alert('Failed to create source');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 mb-6 space-y-4">
      <input
        type="text"
        placeholder="Source name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
        className="w-full px-4 py-2 border rounded-lg"
      />
      <input
        type="url"
        placeholder="URL"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        required
        className="w-full px-4 py-2 border rounded-lg"
      />
      <select
        value={sourceType}
        onChange={(e) => setSourceType(e.target.value)}
        className="w-full px-4 py-2 border rounded-lg"
      >
        <option value="RSS">RSS</option>
        <option value="API">API</option>
        <option value="HTML">HTML</option>
      </select>
      <input
        type="number"
        placeholder="Trust Level (1-10)"
        value={trustLevel}
        onChange={(e) => setTrustLevel(parseInt(e.target.value))}
        min="1"
        max="10"
        required
        className="w-full px-4 py-2 border rounded-lg"
      />
      <input
        type="number"
        placeholder="Poll Interval (minutes)"
        value={pollIntervalMinutes}
        onChange={(e) => setPollIntervalMinutes(parseInt(e.target.value))}
        min="1"
        required
        className="w-full px-4 py-2 border rounded-lg"
      />
      <button
        type="submit"
        className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
      >
        Create Source
      </button>
    </form>
  );
}

