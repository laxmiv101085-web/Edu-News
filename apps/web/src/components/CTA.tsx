import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const CTA = () => {
    return (
        <section className="py-24 px-6">
            <div className="max-w-5xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="glass-panel p-12 md:p-20 text-center relative overflow-hidden rounded-3xl border border-white/10"
                >
                    {/* Background Gradients */}
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-accent-indigo/10 to-accent-cyan/10 -z-10" />
                    <div className="absolute -top-24 -right-24 w-64 h-64 bg-accent-yellow/20 blur-[100px] rounded-full pointer-events-none" />

                    <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight">
                        Deploy an App to <br />
                        Production in Minutes
                    </h2>
                    <p className="text-lg text-neutral-400 mb-10 max-w-2xl mx-auto">
                        Start building your next big idea with the most advanced development platform.
                        No credit card required.
                    </p>

                    <button className="group px-8 py-4 bg-accent-yellow text-bg-dark font-bold rounded-full hover:shadow-[0_0_30px_rgba(214,255,42,0.4)] transition-all duration-300 flex items-center gap-2 mx-auto">
                        <span>Download Now</span>
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </button>
                </motion.div>
            </div>
        </section>
    );
};

export default CTA;
