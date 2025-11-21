import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { User, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const AuthButton = () => {
    const { user, signInWithGoogle, logout } = useAuth();
    const [isOpen, setIsOpen] = useState(false);

    if (user) {
        return (
            <div className="relative">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="flex items-center space-x-2 bg-white/5 hover:bg-white/10 border border-white/10 px-4 py-2 rounded-full transition-all"
                >
                    {user.photoURL ? (
                        <img src={user.photoURL} alt={user.displayName || 'User'} className="w-6 h-6 rounded-full" />
                    ) : (
                        <User className="w-4 h-4 text-accent-yellow" />
                    )}
                    <span className="text-sm font-medium text-white max-w-[100px] truncate">
                        {user.displayName || 'User'}
                    </span>
                </button>

                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            className="absolute right-0 mt-2 w-48 bg-bg-dark border border-white/10 rounded-xl shadow-xl z-50 overflow-hidden"
                        >
                            <button
                                onClick={() => {
                                    logout();
                                    setIsOpen(false);
                                }}
                                className="flex items-center w-full px-4 py-3 text-sm text-neutral-400 hover:text-white hover:bg-white/5 transition-colors"
                            >
                                <LogOut className="w-4 h-4 mr-2" />
                                Sign Out
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        );
    }

    return (
        <button
            onClick={signInWithGoogle}
            className="flex items-center space-x-2 bg-accent-yellow hover:bg-accent-yellow/90 text-bg-dark px-4 py-2 rounded-full transition-all font-bold text-sm"
        >
            <User className="w-4 h-4" />
            <span>Sign In</span>
        </button>
    );
};
