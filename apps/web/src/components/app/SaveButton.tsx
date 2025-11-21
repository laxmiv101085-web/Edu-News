import React, { useState } from 'react';
import { Heart } from 'lucide-react';
import clsx from 'clsx';
import { motion } from 'framer-motion';

interface SaveButtonProps {
    initialSaved?: boolean;
    onToggle?: (saved: boolean) => void;
}

const SaveButton = ({ initialSaved = false, onToggle }: SaveButtonProps) => {
    const [saved, setSaved] = useState(initialSaved);

    const handleToggle = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        const newState = !saved;
        setSaved(newState);
        if (onToggle) onToggle(newState);
    };

    return (
        <motion.button
            whileTap={{ scale: 0.8 }}
            onClick={handleToggle}
            className={clsx(
                'p-2 rounded-full transition-all duration-300',
                saved
                    ? 'bg-red-500/10 text-red-500'
                    : 'bg-white/5 text-neutral-400 hover:bg-white/10 hover:text-white'
            )}
        >
            <Heart className={clsx('w-5 h-5', saved && 'fill-current')} />
        </motion.button>
    );
};

export default SaveButton;
