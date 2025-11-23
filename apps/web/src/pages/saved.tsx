import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import NewsCard from '../components/app/NewsCard';
import { Bookmark } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { Article } from '../lib/news/types';

export default function Saved() {
    const { user } = useAuth();
    const [savedArticles, setSavedArticles] = useState<Article[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSaved = async () => {
            if (!user) {
                setSavedArticles([]);
                setLoading(false);
                return;
            }

            try {
                const token = localStorage.getItem('auth_token');
                if (!token) {
                    console.error('No auth token found');
                    setLoading(false);
                    return;
                }

                const res = await fetch('/api/user/saved', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });
                const data = await res.json();
                setSavedArticles(data.saved || []);
            } catch (error) {
                console.error('Failed to fetch saved articles:', error);
            }
            setLoading(false);
        };

        fetchSaved();
    }, [user]);

    if (!user) {
        return (
            <Layout title="Saved Items - EduNews">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="text-center py-20 bg-white/5 rounded-3xl border border-white/10">
                        <Bookmark className="w-12 h-12 text-neutral-600 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-white mb-2">Sign in to view saved items</h3>
                        <p className="text-neutral-400">Articles you save will appear here.</p>
                    </div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout title="Saved Items - EduNews">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="flex items-center gap-4 mb-12">
                    <div className="w-12 h-12 rounded-2xl bg-accent-yellow/10 flex items-center justify-center text-accent-yellow">
                        <Bookmark className="w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="text-4xl font-bold text-white mb-2">Saved Items</h1>
                        <p className="text-neutral-400">Your personal collection of important updates.</p>
                    </div>
                </div>

                {loading ? (
                    <div className="text-center py-20">
                        <p className="text-neutral-400">Loading...</p>
                    </div>
                ) : savedArticles.length > 0 ? (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {savedArticles.map((article, index) => (
                            <NewsCard key={article.id} article={article} index={index} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-white/5 rounded-3xl border border-white/10">
                        <Bookmark className="w-12 h-12 text-neutral-600 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-white mb-2">No saved items yet</h3>
                        <p className="text-neutral-400">Articles you save will appear here.</p>
                    </div>
                )}
            </div>
        </Layout>
    );
}
