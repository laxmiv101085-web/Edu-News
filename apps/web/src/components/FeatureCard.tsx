import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface FeatureCardProps {
    icon: LucideIcon;
    title: string;
    description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon: Icon, title, description }) => {
    return (
        <motion.div
            whileHover={{ y: -6 }}
            className="glass-card p-6 rounded-2xl group cursor-pointer hover:border-white/20 transition-colors"
        >
            <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mb-4 group-hover:bg-accent-yellow/10 transition-colors">
                <Icon className="w-6 h-6 text-neutral-300 group-hover:text-accent-yellow transition-colors" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
            <p className="text-sm text-neutral-400 leading-relaxed">{description}</p>
        </motion.div>
    );
};

export default FeatureCard;
