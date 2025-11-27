import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../ui/Button';
import { ArrowRight, Download, X } from 'lucide-react';
import Link from 'next/link';

import { useAuth } from '../../hooks/useAuth';
import api from '../../lib/api/client';

interface Article {
    id: string;
    title: string;
    summary: string;
    category: string;
    publishedAt: string;
    url: string;
    image_url?: string;
}

const Hero = () => {
    const { user } = useAuth();
    const [showModal, setShowModal] = useState(false);
    const [topNews, setTopNews] = useState<Article[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchTopNews = async () => {
        setLoading(true);
        try {
            // Fetch many more articles to filter through (need more to get 25 high-quality after strict filtering)
            const response = await api.get('/api/feed', { params: { limit: 500 } });
            const data = response.data;

            // Filter for JEE, NEET, and Board Exam keywords ONLY (strict matching)
            const examArticles = (data.items || []).filter((article: Article) => {
                const text = (article.title + ' ' + article.summary).toLowerCase();

                // Must contain at least one of these SPECIFIC exam identifiers
                const specificExamKeywords = [
                    'jee', 'jee main', 'jee advanced', 'joint entrance',
                    'neet', 'neet ug', 'neet pg', 'medical entrance',
                    'cbse', 'icse', 'state board',
                    'class 10', 'class 12', 'class x', 'class xii',
                    '10th board', '12th board', 'board exam',
                    'iit ', ' iit', 'nit ', ' nit', 'aiims'
                ];

                // Exclude articles with these keywords (banking, jobs, politics, rankings, etc.)
                const excludeKeywords = [
                    'bank', 'baroda', 'sbi', 'ibps', 'rbi',
                    'upsc', 'ssc', 'railway', 'rrb',
                    'abroad', 'scholarship', 'study abroad',
                    'wage', 'salary', 'career', 'recruitment',
                    'pm modi', 'government scheme', 'nitish kumar',
                    'minister', 'cabinet', 'political', 'qualification 2025: cm',
                    'alumnus award', 'distinguished alumnus', 'qs ranking',
                    'qs asia', 'world ranking', 'fell in qs', 'honors those',
                    'global ranking', 'university ranking'
                ];

                // Check if article contains excluded keywords
                const hasExcluded = excludeKeywords.some(keyword => text.includes(keyword));
                if (hasExcluded) return false;

                // Check if article contains specific exam keywords
                return specificExamKeywords.some(keyword => text.includes(keyword));
            });

            // Remove duplicates based on title similarity
            const uniqueArticles = examArticles.filter((article: Article, index: number, self: Article[]) => {
                // Check if this is the first occurrence of a similar title
                return index === self.findIndex((a: Article) => {
                    // Normalize titles for comparison
                    const title1 = article.title.toLowerCase().trim();
                    const title2 = a.title.toLowerCase().trim();

                    // Check for exact or very similar titles
                    if (title1 === title2) return true;

                    // Check if titles are very similar (more than 70% overlap)
                    const words1 = title1.split(' ').filter((w: string) => w.length > 3);
                    const words2 = title2.split(' ').filter((w: string) => w.length > 3);
                    const commonWords = words1.filter((w: string) => words2.includes(w));
                    const similarity = commonWords.length / Math.max(words1.length, words2.length);

                    return similarity > 0.7;
                });
            });

            // Get top 25 exam-related articles (reduced from 50 for better quality)
            setTopNews(uniqueArticles.slice(0, 25));
        } catch (error) {
            console.error('Failed to fetch top news:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleGetUpdates = () => {
        setShowModal(true);
        fetchTopNews();
    };

    return (
        <section className="relative pt-20 pb-32 overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="inline-flex items-center px-3 py-1 rounded-full bg-white/5 border border-white/10 text-accent-yellow text-sm font-medium mb-6 backdrop-blur-sm">
                            <span className="w-2 h-2 rounded-full bg-accent-yellow mr-2 animate-pulse"></span>
                            New: Scholarship Portal Live
                        </div>

                        <h1 className="text-5xl lg:text-7xl font-bold text-white leading-[1.1] mb-6 tracking-tight">
                            {user ? (
                                <>
                                    Welcome back, <br />
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                                        {user.name?.split(' ')[0]}
                                    </span>
                                </>
                            ) : (
                                <>
                                    Stay Ahead of Every <br />
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                                        Educational Opportunity
                                    </span>
                                </>
                            )}
                        </h1>

                        <p className="text-lg text-neutral-400 mb-8 max-w-xl leading-relaxed">
                            Real-time updates for scholarships, exams, admissions, results, and government education notifications. Never miss a deadline again.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <Button size="lg" icon={<ArrowRight className="w-5 h-5" />} onClick={handleGetUpdates}>
                                Get Updates
                            </Button>
                            <Button variant="secondary" size="lg" icon={<Download className="w-5 h-5" />}>
                                Download App
                            </Button>
                        </div>

                        <div className="mt-12 flex items-center gap-4 text-sm text-neutral-500">
                            <div className="flex -space-x-2">
                                {[1, 2, 3, 4].map((i) => (
                                    <div key={i} className="w-8 h-8 rounded-full bg-neutral-800 border-2 border-bg-dark flex items-center justify-center text-xs text-white">
                                        {String.fromCharCode(64 + i)}
                                    </div>
                                ))}
                            </div>
                            <p>Trusted by 50k+ students</p>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="relative hidden lg:block"
                    >
                        {/* Abstract UI Representation */}
                        <div className="relative w-full aspect-square max-w-lg mx-auto">
                            <div className="absolute inset-0 bg-gradient-to-tr from-accent-yellow/20 to-accent-cyan/20 rounded-full filter blur-3xl animate-pulse"></div>

                            {/* Floating Cards */}
                            <motion.div
                                animate={{ y: [0, -20, 0] }}
                                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                                className="absolute top-10 right-10 w-64 p-4 bg-bg-glass backdrop-blur-xl border border-white/10 rounded-2xl shadow-glass z-20"
                            >
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-10 h-10 rounded-full bg-accent-yellow/20 flex items-center justify-center text-accent-yellow">
                                        🎓
                                    </div>
                                    <div>
                                        <div className="h-2 w-24 bg-white/20 rounded mb-1"></div>
                                        <div className="h-2 w-16 bg-white/10 rounded"></div>
                                    </div>
                                </div>
                                <div className="h-2 w-full bg-white/5 rounded mb-2"></div>
                                <div className="h-2 w-3/4 bg-white/5 rounded"></div>
                            </motion.div>

                            <motion.div
                                animate={{ y: [0, 30, 0] }}
                                transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                                className="absolute bottom-20 left-0 w-72 p-5 bg-bg-glass backdrop-blur-xl border border-white/10 rounded-2xl shadow-glass z-10"
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <div className="w-12 h-12 rounded-xl bg-accent-cyan/20 flex items-center justify-center text-accent-cyan">
                                        📝
                                    </div>
                                    <span className="px-2 py-1 rounded-md bg-accent-yellow/20 text-accent-yellow text-xs font-bold">New</span>
                                </div>
                                <div className="h-3 w-32 bg-white/20 rounded mb-2"></div>
                                <div className="h-2 w-full bg-white/10 rounded mb-2"></div>
                                <div className="h-2 w-2/3 bg-white/10 rounded"></div>
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Top News Modal */}
            <AnimatePresence>
                {showModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                        onClick={() => setShowModal(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            className="bg-bg-dark border border-white/10 rounded-3xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex justify-between items-center mb-6">
                                <div>
                                    <h2 className="text-2xl font-bold text-white">🎯 Top 25 Exam Updates</h2>
                                    <p className="text-sm text-neutral-400 mt-1">JEE, NEET & 10th/12th Board Exams</p>
                                </div>
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="p-2 hover:bg-white/10 rounded-full transition-colors"
                                >
                                    <X className="w-6 h-6 text-neutral-400" />
                                </button>
                            </div>

                            {loading ? (
                                <div className="flex justify-center py-12">
                                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent-yellow"></div>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {topNews.map((article, index) => (
                                        <a
                                            key={article.id}
                                            href={article.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="block p-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all"
                                        >
                                            <div className="flex gap-4">
                                                <div className="flex-shrink-0 w-12 h-12 bg-accent-yellow/20 rounded-lg flex items-center justify-center text-2xl font-bold text-accent-yellow">
                                                    {index + 1}
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <span className="px-2 py-1 rounded-md bg-accent-cyan/20 text-accent-cyan text-xs font-medium capitalize">
                                                            {article.category}
                                                        </span>
                                                        <span className="text-xs text-neutral-500">
                                                            {article.publishedAt
                                                                ? new Date(article.publishedAt).toLocaleDateString('en-US', {
                                                                    month: 'short',
                                                                    day: 'numeric',
                                                                    year: 'numeric'
                                                                })
                                                                : new Date().toLocaleDateString('en-US', {
                                                                    month: 'short',
                                                                    day: 'numeric',
                                                                    year: 'numeric'
                                                                })
                                                            }
                                                        </span>
                                                    </div>
                                                    <h3 className="text-white font-semibold mb-2 line-clamp-2">{article.title}</h3>
                                                    <p className="text-neutral-400 text-sm line-clamp-2">{article.summary}</p>
                                                </div>
                                            </div>
                                        </a>
                                    ))}

                                    <Link href="/feed">
                                        <button className="w-full mt-4 px-6 py-3 bg-accent-yellow text-bg-dark font-semibold rounded-xl hover:bg-accent-yellow/90 transition-colors">
                                            View All News →
                                        </button>
                                    </Link>
                                </div>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
};

export default Hero;
