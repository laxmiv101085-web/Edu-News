import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

const Highlight = () => {
    return (
        <section className="py-24 relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
                            Your All-in-One <br />
                            <span className="text-accent-yellow">Educational News Platform</span>
                        </h2>
                        <p className="text-lg text-neutral-400 mb-8 leading-relaxed">
                            Trusted by students preparing for competitive exams, college admissions, and government schemes. We aggregate updates from 500+ official sources.
                        </p>

                        <div className="space-y-4 mb-8">
                            {[
                                'Real-time notifications for deadlines',
                                'Personalized feed based on your interests',
                                'Verified official updates only',
                                'Save and track application status'
                            ].map((item, i) => (
                                <div key={i} className="flex items-center text-neutral-300">
                                    <CheckCircle2 className="w-5 h-5 text-accent-cyan mr-3" />
                                    {item}
                                </div>
                            ))}
                        </div>

                        <div className="mb-12">
                            <h3 className="text-2xl font-bold text-white mb-2">Smart Personalized Feed</h3>
                            <p className="text-neutral-400 mb-4">
                                Your homepage automatically shows the most relevant updates based on your class, exams, and interests.
                            </p>
                            <Link href="/feed" className="inline-flex items-center text-accent-yellow font-medium hover:text-white transition-colors">
                                See how it works <ArrowRight className="w-4 h-4 ml-2" />
                            </Link>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                        className="relative"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-accent-yellow/10 to-accent-cyan/10 rounded-3xl filter blur-3xl"></div>
                        <div className="relative bg-bg-dark border border-white/10 rounded-3xl p-6 shadow-2xl">
                            {/* Mock Feed UI */}
                            <div className="flex items-center justify-between mb-6 border-b border-white/5 pb-4">
                                <div className="flex gap-2">
                                    <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50"></div>
                                    <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50"></div>
                                    <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50"></div>
                                </div>
                                <div className="h-2 w-20 bg-white/10 rounded-full"></div>
                            </div>

                            <div className="space-y-4">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                                        <div className="flex justify-between items-start mb-3">
                                            <div className="h-2 w-16 bg-accent-yellow/20 rounded-full"></div>
                                            <div className="h-2 w-12 bg-white/10 rounded-full"></div>
                                        </div>
                                        <div className="h-4 w-3/4 bg-white/20 rounded mb-2"></div>
                                        <div className="h-3 w-full bg-white/10 rounded"></div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default Highlight;
