import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Bell, User } from 'lucide-react';
import clsx from 'clsx';
import { AuthButton } from './auth/AuthButton';
import { UserProfileDropdown } from './app/UserProfileDropdown';
import { useAuth } from '../hooks/useAuth';

const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const router = useRouter();
    const { user, loading } = useAuth();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { name: 'Home', href: '/' },
        { name: 'Feed', href: '/feed' },
        { name: 'Saved', href: '/saved' },
    ];

    return (
        <>
            <motion.nav
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                className={clsx(
                    'fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b',
                    isScrolled
                        ? 'bg-bg-dark/80 backdrop-blur-md border-white/10 py-4'
                        : 'bg-transparent border-transparent py-6'
                )}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between">
                        {/* Logo */}
                        <Link href="/" className="group relative">
                            <span className="text-2xl font-bold text-white tracking-tighter">
                                Edu<span className="text-accent-yellow">News</span>
                            </span>
                            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-accent-yellow transition-all group-hover:w-full" />
                        </Link>

                        {/* Desktop Nav */}
                        <div className="hidden md:flex items-center space-x-8">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    className={clsx(
                                        'text-sm font-medium transition-colors hover:text-accent-yellow',
                                        router.pathname === link.href ? 'text-accent-yellow' : 'text-neutral-400'
                                    )}
                                >
                                    {link.name}
                                </Link>
                            ))}
                        </div>

                        {/* Actions */}
                        <div className="hidden md:flex items-center space-x-4">
                            {!loading && (
                                user ? <UserProfileDropdown /> : <AuthButton />
                            )}
                        </div>

                        {/* Mobile Menu Button */}
                        <button
                            className="md:hidden p-2 text-white"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        >
                            {isMobileMenuOpen ? <X /> : <Menu />}
                        </button>
                    </div>
                </div>
            </motion.nav>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="fixed inset-0 z-40 bg-bg-dark pt-24 px-4 md:hidden"
                    >
                        <div className="flex flex-col space-y-6">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="text-2xl font-bold text-white hover:text-accent-yellow transition-colors"
                                >
                                    {link.name}
                                </Link>
                            ))}
                            <div className="pt-8 border-t border-white/10">
                                {!loading && (
                                    user ? <UserProfileDropdown /> : <AuthButton />
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default Navbar;
