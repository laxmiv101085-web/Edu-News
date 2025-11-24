import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import NewsCard from '../components/app/NewsCard';
import { useAuth } from '../hooks/useAuth';
import api from '../lib/api/client';
import { Article } from '../lib/news/types';
import { Bookmark, Loader2 } from 'lucide-react';
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function SavedArticles() {
    const { user, loading: authLoading } = useAuth();
    const [articles, setArticles] = useState<Article[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/login');
        }
    }, [user, authLoading, router]);

    useEffect(() => {
        const fetchSavedArticles = async () => {
            if (!user) return;
            try {
                const response = await api.get('/api/bookmarks');
                setArticles(response.data);
            } catch (error) {
                console.error('Error fetching saved articles:', error);
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchSavedArticles();
        }
    }, [user]);

    if (authLoading || (loading && user)) {
        return (
            <Layout title="Saved Articles - EduNews">
                <div className="min-h-screen flex items-center justify-center">
                    <Loader2 className="w-8 h-8 text-accent-yellow animate-spin" />
                </div>
            </Layout>
        );
    }

    return (
        <Layout
            title="Saved Articles - EduNews"
            description="Your personal collection of saved education news, exam updates, and scholarship information."
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
                    <div>
                        <h1 className="text-4xl font-bold text-white mb-2">Saved Articles</h1>
                        <p className="text-neutral-400">
                            Your personal collection of important updates.
                        </p>
                    </div>
                </div>

                {articles.length > 0 ? (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {articles.map((article, index) => (
                            <NewsCard key={article.id} article={article} index={index} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-white/5 rounded-2xl border border-white/10">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/5 mb-4">
                            <Bookmark className="w-8 h-8 text-neutral-500" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">No saved articles yet</h3>
                        <p className="text-neutral-400 mb-6">
                            Save articles you want to read later or keep for reference.
                        </p>
                        <Link
                            href="/feed"
                            className="inline-flex items-center px-6 py-3 rounded-xl bg-accent-blue text-white font-medium hover:bg-accent-blue/90 transition-colors"
                        >
                            Browse News Feed
                        </Link>
                    </div>
                )}
            </div>
        </Layout>
    );
}
