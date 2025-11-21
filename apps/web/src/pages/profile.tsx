import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

interface AlertRule {
  id: string;
  name: string;
  keywords: string[];
  examNames: string[];
  types: string[];
  locations: string[];
  active: boolean;
}

export default function Profile() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [alertRules, setAlertRules] = useState<AlertRule[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateRule, setShowCreateRule] = useState(false);
  const [fcmToken, setFcmToken] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    loadUser();
    loadAlertRules();
    requestNotificationPermission();
  }, []);

  const loadUser = () => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      setUser(JSON.parse(userStr));
    }
  };

  const loadAlertRules = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/alert-rules`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAlertRules(response.data);
    } catch (error) {
      console.error('Error loading alert rules:', error);
    } finally {
      setLoading(false);
    }
  };

  const requestNotificationPermission = async () => {
    if ('Notification' in window && Notification.permission === 'default') {
      await Notification.requestPermission();
    }
  };

  const registerDevice = async () => {
    if (!fcmToken) {
      alert('Please enter FCM token');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `${API_URL}/user/devices/register`,
        {
          fcmToken,
          platform: 'web',
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert('Device registered successfully');
      setFcmToken('');
    } catch (error) {
      console.error('Error registering device:', error);
      alert('Failed to register device');
    }
  };

  const deleteRule = async (id: string) => {
    if (!confirm('Are you sure you want to delete this rule?')) return;

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/alert-rules/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      loadAlertRules();
    } catch (error) {
      console.error('Error deleting rule:', error);
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
              {user?.email === 'admin@example.com' && (
                <Link href="/admin" className="text-gray-700 hover:text-primary-600">
                  Admin
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Profile</h1>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">User Information</h2>
          <dl className="grid grid-cols-2 gap-4">
            <dt className="font-medium">Name:</dt>
            <dd>{user?.name}</dd>
            <dt className="font-medium">Email:</dt>
            <dd>{user?.email}</dd>
          </dl>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Alert Rules</h2>
            <button
              onClick={() => setShowCreateRule(!showCreateRule)}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
            >
              {showCreateRule ? 'Cancel' : 'Create Rule'}
            </button>
          </div>

          {showCreateRule && (
            <CreateRuleForm
              onSuccess={() => {
                setShowCreateRule(false);
                loadAlertRules();
              }}
            />
          )}

          <div className="space-y-4 mt-4">
            {alertRules.map((rule) => (
              <div key={rule.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold">{rule.name}</h3>
                    <div className="mt-2 text-sm text-gray-600">
                      {rule.keywords.length > 0 && (
                        <p>Keywords: {rule.keywords.join(', ')}</p>
                      )}
                      {rule.examNames.length > 0 && (
                        <p>Exams: {rule.examNames.join(', ')}</p>
                      )}
                      {rule.types.length > 0 && <p>Types: {rule.types.join(', ')}</p>}
                      {rule.locations.length > 0 && (
                        <p>Locations: {rule.locations.join(', ')}</p>
                      )}
                      <p className="mt-1">
                        Status: <span className={rule.active ? 'text-green-600' : 'text-gray-500'}>
                          {rule.active ? 'Active' : 'Inactive'}
                        </span>
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => deleteRule(rule.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Push Notifications</h2>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="FCM Token"
              value={fcmToken}
              onChange={(e) => setFcmToken(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg"
            />
            <button
              onClick={registerDevice}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
            >
              Register Device
            </button>
            <p className="text-sm text-gray-600">
              Register your device to receive push notifications for matching alerts.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

function CreateRuleForm({ onSuccess }: { onSuccess: () => void }) {
  const [name, setName] = useState('');
  const [keywords, setKeywords] = useState('');
  const [examNames, setExamNames] = useState('');
  const [types, setTypes] = useState<string[]>([]);
  const [locations, setLocations] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `${API_URL}/alert-rules`,
        {
          name,
          keywords: keywords.split(',').map((k) => k.trim()).filter(Boolean),
          examNames: examNames.split(',').map((e) => e.trim()).filter(Boolean),
          types,
          locations: locations.split(',').map((l) => l.trim()).filter(Boolean),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      onSuccess();
    } catch (error) {
      console.error('Error creating rule:', error);
      alert('Failed to create rule');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="border rounded-lg p-4 mb-4 space-y-4">
      <input
        type="text"
        placeholder="Rule name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
        className="w-full px-4 py-2 border rounded-lg"
      />
      <input
        type="text"
        placeholder="Keywords (comma-separated)"
        value={keywords}
        onChange={(e) => setKeywords(e.target.value)}
        className="w-full px-4 py-2 border rounded-lg"
      />
      <input
        type="text"
        placeholder="Exam names (comma-separated)"
        value={examNames}
        onChange={(e) => setExamNames(e.target.value)}
        className="w-full px-4 py-2 border rounded-lg"
      />
      <div>
        <label className="block mb-2">Types:</label>
        <div className="flex flex-wrap gap-2">
          {['EXAM', 'SCHOLARSHIP', 'RESULT', 'ADMISSION', 'OTHER'].map((type) => (
            <label key={type} className="flex items-center">
              <input
                type="checkbox"
                checked={types.includes(type)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setTypes([...types, type]);
                  } else {
                    setTypes(types.filter((t) => t !== type));
                  }
                }}
                className="mr-2"
              />
              {type}
            </label>
          ))}
        </div>
      </div>
      <input
        type="text"
        placeholder="Locations (comma-separated)"
        value={locations}
        onChange={(e) => setLocations(e.target.value)}
        className="w-full px-4 py-2 border rounded-lg"
      />
      <button
        type="submit"
        className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
      >
        Create Rule
      </button>
    </form>
  );
}

