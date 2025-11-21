import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Download } from 'lucide-react';

const Hero = () => {
    return (
        <section className="relative pt-32 pb-20 overflow-hidden">
            {/* Background Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-accent-cyan/20 blur-[120px] rounded-full pointer-events-none opacity-30" />

            <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
                {/* Text Content */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="relative z-10"
                >
                    <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tight leading-[1.1] mb-6">
                        It’s time to <br />
                        make your <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-cyan to-accent-indigo">software</span>
                    </h1>
                    <p className="text-xl text-neutral-400 mb-8 max-w-lg leading-relaxed">
                        What do you want to <span className="text-white font-medium">build</span> today?
                        Experience the next generation of development tools.
                    </p>

                    <div className="flex flex-wrap gap-4">
                        <button className="group relative px-8 py-4 bg-accent-yellow text-bg-dark font-bold rounded-full hover:shadow-[0_0_30px_rgba(214,255,42,0.3)] transition-all duration-300 flex items-center gap-2">
                            <Download className="w-5 h-5" />
                            <span>Download</span>
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </button>
                        <button className="px-8 py-4 text-white font-medium border border-white/10 rounded-full hover:bg-white/5 transition-colors">
                            View Documentation
                        </button>
                    </div>
                </motion.div>

                {/* Visual Content */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="relative"
                >
                    <div className="relative z-10 rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-[#0f172a]/80 backdrop-blur-xl">
                        {/* Fake Browser Header */}
                        <div className="h-10 bg-white/5 border-b border-white/5 flex items-center px-4 gap-2">
                            <div className="w-3 h-3 rounded-full bg-red-500/50" />
                            <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                            <div className="w-3 h-3 rounded-full bg-green-500/50" />
                        </div>
                        {/* Code Content */}
                        <div className="p-6 font-mono text-sm text-neutral-300 overflow-hidden">
                            <div className="flex gap-4">
                                <div className="text-neutral-600 select-none text-right">
                                    1<br />2<br />3<br />4<br />5<br />6<br />7<br />8
                                </div>
                                <div>
                                    <span className="text-purple-400">import</span> <span className="text-yellow-300">{`{ useState }`}</span> <span className="text-purple-400">from</span> <span className="text-green-400">'react'</span>;<br />
                                    <br />
                                    <span className="text-purple-400">function</span> <span className="text-blue-400">App</span>() {'{'}<br />
                                    &nbsp;&nbsp;<span className="text-purple-400">const</span> [<span className="text-yellow-300">count</span>, <span className="text-yellow-300">setCount</span>] = <span className="text-blue-400">useState</span>(<span className="text-orange-400">0</span>);<br />
                                    <br />
                                    &nbsp;&nbsp;<span className="text-purple-400">return</span> (<br />
                                    &nbsp;&nbsp;&nbsp;&nbsp;&lt;<span className="text-red-400">div</span> <span className="text-yellow-300">className</span>=<span className="text-green-400">"app"</span>&gt;<br />
                                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&lt;<span className="text-red-400">h1</span>&gt;Hello World&lt;/<span className="text-red-400">h1</span>&gt;<br />
                                    &nbsp;&nbsp;&nbsp;&nbsp;&lt;/<span className="text-red-400">div</span>&gt;<br />
                                    &nbsp;&nbsp;);<br />
                                    {'}'}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Decorative Elements */}
                    <div className="absolute -top-10 -right-10 w-40 h-40 bg-accent-indigo/30 rounded-full blur-3xl animate-pulse" />
                    <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-accent-cyan/30 rounded-full blur-3xl animate-pulse delay-700" />
                </motion.div>
            </div>
        </section>
    );
};

export default Hero;
