import React from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, Calendar, Award, BookOpen } from 'lucide-react';

const features = [
    {
        title: 'Scholarships',
        description: 'Latest scholarship alerts with eligibility, deadlines and application guides.',
        icon: GraduationCap,
        color: 'text-accent-yellow',
        bg: 'bg-accent-yellow/10',
    },
    {
        title: 'Exam Alerts',
        description: 'Never miss an important exam date or official announcement.',
        icon: Calendar,
        color: 'text-accent-cyan',
        bg: 'bg-accent-cyan/10',
    },
    {
        title: 'Results & Cutoffs',
        description: 'Instant updates from boards, universities, and major entrance exams.',
        icon: Award,
        color: 'text-purple-400',
        bg: 'bg-purple-400/10',
    },
    {
        title: 'Admissions',
        description: 'UG/PG admission notifications, counselling updates and new program announcements.',
        icon: BookOpen,
        color: 'text-pink-400',
        bg: 'bg-pink-400/10',
    },
];

const Features = () => {
    return (
        <section className="py-24 relative">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {features.map((feature, index) => (
                        <motion.div
                            key={feature.title}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            viewport={{ once: true }}
                            className="group p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300 backdrop-blur-sm"
                        >
                            <div className={`w-12 h-12 rounded-xl ${feature.bg} ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                                <feature.icon className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                            <p className="text-neutral-400 leading-relaxed">
                                {feature.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Features;
