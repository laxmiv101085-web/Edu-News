import React from 'react';
import { motion } from 'framer-motion';
import Button from '../ui/Button';
import { ArrowRight, Download } from 'lucide-react';

const Hero = () => {
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
                            Stay Ahead of Every <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-yellow to-accent-cyan">
                                Educational Opportunity
                            </span>
                        </h1>

                        <p className="text-lg text-neutral-400 mb-8 max-w-xl leading-relaxed">
                            Real-time updates for scholarships, exams, admissions, results, and government education notifications. Never miss a deadline again.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <Button size="lg" icon={<ArrowRight className="w-5 h-5" />}>
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
        </section>
    );
};

export default Hero;
