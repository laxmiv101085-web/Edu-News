import React from 'react';
import { Bookmark } from 'lucide-react';
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
            whileTap={{ scale: 0.95 }}
            onClick={handleToggle}
            className={clsx(
                'px-3 py-1.5 rounded-full transition-all duration-300 backdrop-blur-md border border-white/10 flex items-center gap-1.5 text-xs font-medium',
                saved
                    ? 'bg-accent-yellow/20 text-accent-yellow border-accent-yellow/30'
                    : 'bg-bg-dark/50 text-neutral-400 hover:bg-white/10 hover:text-white'
            )}
            title={saved ? "Remove from bookmarks" : "Save to bookmarks"}
        >
            <Bookmark className={clsx('w-3.5 h-3.5', saved && 'fill-current')} />
            <span>{saved ? 'Saved' : 'Save'}</span>
        </motion.button>
    );
};

export default SaveButton;
