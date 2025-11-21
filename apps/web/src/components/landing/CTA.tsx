import React from 'react';
import Button from '../ui/Button';
import { ArrowRight } from 'lucide-react';

const CTA = () => {
    return (
        <section className="py-24 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-bg-dark to-accent-yellow/5"></div>
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                <div className="p-12 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-accent-yellow via-accent-cyan to-accent-indigo"></div>

                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                        Never Miss a Scholarship or <br /> Exam Update Again
                    </h2>
                    <p className="text-lg text-neutral-400 mb-8 max-w-2xl mx-auto">
                        Join the fastest growing community of students and stay ahead in your educational journey.
                    </p>

                    <Button size="lg" icon={<ArrowRight className="w-5 h-5" />}>
                        Start Now
                    </Button>
                </div>
            </div>
        </section>
    );
};

export default CTA;
