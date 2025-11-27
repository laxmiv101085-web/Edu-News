import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Calendar, ArrowUpRight } from 'lucide-react';
import SaveButton from './SaveButton';
import ShareButton from './ShareButton';
import { Article } from '../../lib/news/types';
import { formatDistanceToNow } from 'date-fns';
import { getWhatsAppShareUrl, getTwitterShareUrl, getTelegramShareUrl } from '../../lib/utils/shareUtils';

interface NewsCardProps {
    article: Article;
    index?: number;
}

const NewsCard = ({ article, index = 0 }: NewsCardProps) => {
    // Format date as "Nov 27, 2025" instead of relative time
    const dateDisplay = article.publishedAt
        ? new Date(article.publishedAt).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        })
        : new Date().toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: Math.min(index * 0.05, 0.5) }} // Cap delay
            className="group relative flex flex-col bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:bg-white/10 transition-all duration-300 hover:shadow-glass hover:-translate-y-1"
        >
            <Link href={article.url} target="_blank" rel="noopener noreferrer" className="absolute inset-0 z-0" />

            <div className="relative h-48 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-bg-dark to-transparent z-10 opacity-60" />
                <img
                    src={article.image_url || 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=800&q=80'}
                    alt={article.title}
                    onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        // Try multiple fallback images
                        if (!target.dataset.fallbackAttempt) {
                            target.dataset.fallbackAttempt = '1';
                            target.src = 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=800&q=80';
                        } else if (target.dataset.fallbackAttempt === '1') {
                            target.dataset.fallbackAttempt = '2';
                            target.src = 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=800&q=80';
                        } else if (target.dataset.fallbackAttempt === '2') {
                            target.dataset.fallbackAttempt = '3';
                            target.src = 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?auto=format&fit=crop&w=800&q=80';
                        }
                    }}
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4 z-20">
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-bg-dark/50 backdrop-blur-md border border-white/10 text-accent-yellow uppercase tracking-wider">
                        {article.category}
                    </span>
                </div>
                <div className="absolute top-4 right-4 z-20 flex gap-2">
                    <ShareButton title={article.title} url={article.url} />
                    <SaveButton articleId={Number(article.id)} />
                </div>
            </div>

            <div className="p-5 flex flex-col flex-1 relative z-10">
                <div className="flex items-center justify-between mb-3">
                    {/* Removed duplicate category and save button */}
                </div>

                <h3 className="text-lg font-bold text-white mb-2 line-clamp-2 group-hover:text-accent-yellow transition-colors">
                    {article.title}
                </h3>

                <p className="text-neutral-400 text-sm line-clamp-3 mb-4 flex-1">
                    {article.summary}
                </p>

                <div className="flex items-center justify-between text-xs text-neutral-500">
                    <div className="flex items-center gap-2">
                        <Calendar className="w-3 h-3" />
                        <span>{dateDisplay}</span>
                    </div>

                    <div className="flex items-center gap-3">
                        {/* Read Article Link */}
                        <a
                            href={article.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-accent-yellow hover:text-accent-yellow/80 transition-colors font-medium z-20"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <span className="text-xs">Read Article</span>
                            <ArrowUpRight className="w-3 h-3" />
                        </a>

                        {/* Share Buttons */}
                        <div className="flex items-center gap-2 z-20">
                            <a
                                href={getTwitterShareUrl(article.title, article.url)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-1.5 hover:bg-blue-500/20 rounded-full transition-colors"
                                title="Share on Twitter"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <svg className="w-4 h-4 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                                </svg>
                            </a>
                            <a
                                href={getTelegramShareUrl(article.title, article.url)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-1.5 hover:bg-blue-400/20 rounded-full transition-colors"
                                title="Share on Telegram"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <svg className="w-4 h-4 text-blue-300" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
                                </svg>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default React.memo(NewsCard);
