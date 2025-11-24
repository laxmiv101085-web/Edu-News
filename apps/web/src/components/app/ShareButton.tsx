import React, { useState } from 'react';
import { Share2, Twitter, Linkedin, Link as LinkIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';
import { toast } from 'react-hot-toast';

interface ShareButtonProps {
    title: string;
    url: string;
}

const ShareButton = ({ title, url }: ShareButtonProps) => {
    const [isOpen, setIsOpen] = useState(false);

    const shareData = {
        title: 'EduNews - ' + title,
        text: title,
        url: url
    };

    const handleShare = async () => {
        // Try native share first (mobile)
        if (navigator.share) {
            try {
                await navigator.share(shareData);
                return;
            } catch (err) {
                console.log('Error sharing:', err);
            }
        }

        // Fallback to custom menu
        setIsOpen(!isOpen);
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(url);
        toast.success('Link copied to clipboard!');
        setIsOpen(false);
    };

    const shareToTwitter = () => {
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`, '_blank');
        setIsOpen(false);
    };

    const shareToLinkedIn = () => {
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank');
        setIsOpen(false);
    };

    const shareToWhatsApp = () => {
        window.open(`https://wa.me/?text=${encodeURIComponent(title + ' ' + url)}`, '_blank');
        setIsOpen(false);
    };

    return (
        <div className="relative">
            <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={handleShare}
                className="p-2 rounded-full bg-bg-dark/50 backdrop-blur-md border border-white/10 text-neutral-400 hover:bg-white/10 hover:text-white transition-colors"
                title="Share article"
            >
                <Share2 className="w-5 h-5" />
            </motion.button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 10 }}
                        className="absolute bottom-full right-0 mb-2 p-2 bg-bg-dark/90 backdrop-blur-xl border border-white/10 rounded-xl shadow-xl flex flex-col gap-2 min-w-[160px] z-50"
                    >
                        <button onClick={shareToWhatsApp} className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/10 text-sm text-neutral-200 hover:text-white transition-colors text-left">
                            <span className="text-green-500">📱</span> WhatsApp
                        </button>
                        <button onClick={shareToTwitter} className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/10 text-sm text-neutral-200 hover:text-white transition-colors text-left">
                            <Twitter className="w-4 h-4 text-blue-400" /> Twitter
                        </button>
                        <button onClick={shareToLinkedIn} className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/10 text-sm text-neutral-200 hover:text-white transition-colors text-left">
                            <Linkedin className="w-4 h-4 text-blue-600" /> LinkedIn
                        </button>
                        <button onClick={copyToClipboard} className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/10 text-sm text-neutral-200 hover:text-white transition-colors text-left border-t border-white/10 mt-1 pt-2">
                            <LinkIcon className="w-4 h-4" /> Copy Link
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ShareButton;
