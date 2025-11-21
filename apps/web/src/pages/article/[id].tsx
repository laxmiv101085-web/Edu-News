import React from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import { articles } from '../../data/articles';
import { Calendar, Share2, ArrowLeft, Clock } from 'lucide-react';
import Link from 'next/link';
import Button from '../../components/ui/Button';
import SaveButton from '../../components/app/SaveButton';

export default function ArticlePage() {
    const router = useRouter();
    const { id } = router.query;
    const article = articles.find((a) => a.id === id);

    if (!article) {
        return (
            <Layout title="Article Not Found">
                <div className="flex flex-col items-center justify-center min-h-[60vh]">
                    <h1 className="text-2xl font-bold text-white mb-4">Article not found</h1>
                    <Link href="/feed">
                        <Button variant="outline">Back to Feed</Button>
                    </Link>
                </div>
            </Layout>
        );
    }

    return (
        <Layout title={`${article.title} - EduNews`}>
            <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <Link href="/feed" className="inline-flex items-center text-neutral-400 hover:text-white mb-8 transition-colors">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Feed
                </Link>

                <div className="mb-8">
                    <div className="flex items-center gap-4 mb-6">
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-accent-yellow/10 text-accent-yellow border border-accent-yellow/20 uppercase tracking-wider">
                            {article.category}
                        </span>
                        <div className="flex items-center text-neutral-400 text-sm">
                            <Calendar className="w-4 h-4 mr-2" />
                            {article.date}
                        </div>
                        <div className="flex items-center text-neutral-400 text-sm">
                            <Clock className="w-4 h-4 mr-2" />
                            5 min read
                        </div>
                    </div>

                    <h1 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
                        {article.title}
                    </h1>
                </div>

                <div className="relative aspect-video rounded-2xl overflow-hidden mb-12 border border-white/10 shadow-2xl">
                    <img
                        src={article.image}
                        alt={article.title}
                        className="w-full h-full object-cover"
                    />
                </div>

                <div className="grid lg:grid-cols-12 gap-12">
                    <div className="lg:col-span-8">
                        <div
                            className="prose prose-invert prose-lg max-w-none prose-headings:text-white prose-p:text-neutral-300 prose-a:text-accent-cyan hover:prose-a:text-accent-yellow prose-strong:text-white prose-li:text-neutral-300"
                            dangerouslySetInnerHTML={{ __html: article.content }}
                        />
                    </div>

                    <div className="lg:col-span-4 space-y-6">
                        <div className="p-6 rounded-2xl bg-white/5 border border-white/10 sticky top-24">
                            <h3 className="text-lg font-bold text-white mb-4">Actions</h3>
                            <div className="space-y-3">
                                <Button className="w-full justify-center" icon={<Share2 className="w-4 h-4" />}>
                                    Share Article
                                </Button>
                                <div className="flex items-center justify-between p-3 rounded-xl bg-bg-dark border border-white/10">
                                    <span className="text-neutral-300 font-medium">Save for later</span>
                                    <SaveButton />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </article>
        </Layout>
    );
}
