import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Calendar, ArrowUpRight } from 'lucide-react';
import SaveButton from './SaveButton';
import ShareButton from './ShareButton';
import { Article } from '../../lib/news/types';
import { formatDistanceToNow } from 'date-fns';

interface NewsCardProps {
    article: Article;
    index?: number;
}

const NewsCard = ({ article, index = 0 }: NewsCardProps) => {
    const dateDisplay = article.publishedAt
        ? formatDistanceToNow(new Date(article.publishedAt), { addSuffix: true })
        : 'Recently';

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.05 }}
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

            <div className="p-6 flex-1 flex flex-col">
                <div className="flex items-center text-neutral-400 text-xs mb-3">
                    <Calendar className="w-3 h-3 mr-2" />
                    {dateDisplay} • {article.source.name}
                </div>

                <h3 className="text-xl font-bold text-white mb-3 line-clamp-2 group-hover:text-accent-yellow transition-colors">
                    {article.title}
                </h3>

                <p className="text-neutral-400 text-sm line-clamp-2 mb-6 flex-1">
                    {article.summary}
                </p>

                <div className="flex items-center text-accent-cyan text-sm font-medium group/link">
                    Read Article
                    <ArrowUpRight className="w-4 h-4 ml-1 transform group-hover/link:translate-x-1 group-hover/link:-translate-y-1 transition-transform" />
                </div>
            </div>
        </motion.div>
    );
};

export default NewsCard;
