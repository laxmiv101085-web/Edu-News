import React from "react";
import { useRouter } from "next/router";
import { MainLayout } from "../../layouts/MainLayout";
import { Button } from "../../components/Button";
import { ArrowLeft, Share2, Bookmark, Calendar, Clock, User } from "lucide-react";
import { motion } from "framer-motion";

export default function ArticleDetail() {
    const router = useRouter();
    const { id } = router.query;

    return (
        <MainLayout>
            <div className="max-w-5xl mx-auto">
                <Button
                    variant="ghost"
                    leftIcon={<ArrowLeft size={18} />}
                    onClick={() => router.back()}
                    className="mb-6 pl-0 hover:bg-transparent hover:text-primary-600"
                >
                    Back to Feed
                </Button>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    {/* Main Content */}
                    <article className="lg:col-span-8">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <span className="inline-block px-3 py-1 bg-primary-50 text-primary-700 text-sm font-bold rounded-full mb-4">
                                Scholarships
                            </span>
                            <h1 className="text-3xl md:text-5xl font-bold text-neutral-900 leading-tight mb-6 font-display">
                                Top 10 Scholarships for International Students in 2024
                            </h1>

                            <div className="flex items-center gap-6 text-neutral-500 text-sm mb-8 pb-8 border-b border-neutral-100">
                                <div className="flex items-center gap-2">
                                    <User size={16} />
                                    <span>Sarah Mitchell</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Calendar size={16} />
                                    <span>Nov 20, 2024</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Clock size={16} />
                                    <span>5 min read</span>
                                </div>
                            </div>

                            <div className="relative h-[400px] rounded-2xl overflow-hidden mb-10 shadow-lg">
                                <img
                                    src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80&w=1200"
                                    alt="Students studying"
                                    className="w-full h-full object-cover"
                                />
                            </div>

                            <div className="prose prose-lg prose-neutral max-w-none">
                                <p className="lead text-xl text-neutral-600 mb-6">
                                    Finding the right scholarship can be a daunting task, but it is one of the most rewarding ways to fund your education. Here is a comprehensive list of the top fully funded scholarships available for international students this year.
                                </p>

                                <h3>1. Fulbright Foreign Student Program (USA)</h3>
                                <p>
                                    The Fulbright Program is one of the most prestigious scholarships in the world. It operates in more than 160 countries and offers approximately 4,000 grants annually. The program covers tuition, airfare, a living stipend, and health insurance.
                                </p>

                                <h3>2. Chevening Scholarships (UK)</h3>
                                <p>
                                    Funded by the UK Foreign, Commonwealth and Development Office, Chevening Scholarships enable outstanding emerging leaders from all over the world to pursue one-year master’s degrees in the UK.
                                </p>

                                <h3>3. Australia Awards Scholarships</h3>
                                <p>
                                    Administered by the Department of Foreign Affairs and Trade, these scholarships provide opportunities for people from developing countries, particularly those in the Indo-Pacific region, to undertake full time undergraduate or postgraduate study at participating Australian universities and TAFE institutions.
                                </p>

                                <div className="bg-primary-50 p-6 rounded-xl my-8 border border-primary-100">
                                    <h4 className="text-primary-800 font-bold mb-2 mt-0">Pro Tip</h4>
                                    <p className="text-primary-700 m-0">
                                        Start your application process at least 6-8 months before the deadline. Gather all necessary documents like transcripts, letters of recommendation, and test scores early.
                                    </p>
                                </div>

                                <h3>4. DAAD Scholarships (Germany)</h3>
                                <p>
                                    The German Academic Exchange Service (DAAD) offers a wide range of scholarships for international students to study in Germany at various degree levels.
                                </p>

                                <p>
                                    Applying for scholarships requires dedication and attention to detail. Make sure to tailor your essays to each specific program and highlight your unique strengths and experiences.
                                </p>
                            </div>
                        </motion.div>
                    </article>

                    {/* Sidebar */}
                    <aside className="lg:col-span-4 space-y-8">
                        <div className="sticky top-32">
                            <div className="bg-white rounded-2xl p-6 shadow-soft border border-neutral-100 mb-6">
                                <h3 className="font-bold text-lg mb-4">Actions</h3>
                                <div className="flex flex-col gap-3">
                                    <Button variant="primary" leftIcon={<Bookmark size={18} />} className="w-full justify-center">
                                        Save Article
                                    </Button>
                                    <Button variant="secondary" leftIcon={<Share2 size={18} />} className="w-full justify-center">
                                        Share
                                    </Button>
                                </div>
                            </div>

                            <div className="bg-white rounded-2xl p-6 shadow-soft border border-neutral-100">
                                <h3 className="font-bold text-lg mb-4">Related News</h3>
                                <div className="space-y-4">
                                    {[1, 2, 3].map((i) => (
                                        <div key={i} className="group cursor-pointer">
                                            <h4 className="font-medium text-neutral-900 group-hover:text-primary-600 transition-colors line-clamp-2 mb-1">
                                                How to Write a Winning Scholarship Essay
                                            </h4>
                                            <p className="text-xs text-neutral-500">3 min read</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
        </MainLayout>
    );
}
