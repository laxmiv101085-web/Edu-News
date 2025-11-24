import React from 'react';
import { Heart } from 'lucide-react';
import clsx from 'clsx';
import { motion } from 'framer-motion';
import { useBookmarks } from '../../hooks/useBookmarks';

interface SaveButtonProps {
    articleId: number;
}

const SaveButton = ({ articleId }: SaveButtonProps) => {
    const { isSaved, toggleBookmark } = useBookmarks();
    const saved = isSaved(articleId);

    const handleToggle = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        toggleBookmark(articleId);
    };

    return (
        <motion.button
            whileTap={{ scale: 0.8 }}
            onClick={handleToggle}
            className={clsx(
                'p-2 rounded-full transition-all duration-300 backdrop-blur-md border border-white/10',
                saved
                    ? 'bg-red-500/20 text-red-500 border-red-500/30'
                    : 'bg-bg-dark/50 text-neutral-400 hover:bg-white/10 hover:text-white'
            )}
            title={saved ? "Remove from bookmarks" : "Save to bookmarks"}
        >
            <Heart className={clsx('w-5 h-5', saved && 'fill-current')} />
        </motion.button>
    );
};

export default SaveButton;
