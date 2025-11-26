import React from 'react';
import Link from 'next/link';
import { Twitter, Instagram, Linkedin, Github } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-bg-dark border-t border-white/5 py-12 relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl">
                    <div className="grid md:grid-cols-3 gap-8">
                        {/* Column 1 */}
                        <div>
                            <h4 className="font-bold text-white text-lg mb-4">EduNews</h4>
                            <p className="text-sm text-neutral-400 leading-relaxed">
                                Your personal hub for exam updates, results, admissions and scholarships. Stay ahead of every important education deadline.
                            </p>
                        </div>

                        {/* Column 2 */}
                        <div>
                            <h4 className="font-bold text-white text-lg mb-4">Explore</h4>
                            <ul className="space-y-2 text-sm text-neutral-400">
                                <li className="hover:text-accent-yellow cursor-pointer transition-colors">
                                    <Link href="/">Home</Link>
                                </li>
                                <li className="hover:text-accent-yellow cursor-pointer transition-colors">
                                    <Link href="/feed">Feed</Link>
                                </li>
                                <li className="hover:text-accent-yellow cursor-pointer transition-colors">
                                    <Link href="/saved">Saved</Link>
                                </li>
                                <li className="hover:text-accent-yellow cursor-pointer transition-colors">Exam Calendar</li>
                                <li className="hover:text-accent-yellow cursor-pointer transition-colors">College Alerts</li>
                                <li className="hover:text-accent-yellow cursor-pointer transition-colors">Scholarship Tracker</li>
                                <li className="hover:text-accent-yellow cursor-pointer transition-colors">FAQ</li>
                            </ul>
                        </div>

                        {/* Column 3 */}
                        <div>
                            <h4 className="font-bold text-white text-lg mb-4">Contact</h4>
                            <ul className="space-y-2 text-sm text-neutral-400">
                                <li>genzfounders2006@gmail.com</li>
                                <li>Lucknow, India</li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="mt-8 text-center text-neutral-500 text-xs">
                    © {new Date().getFullYear()} EduNews. All rights reserved.
                </div>
            </div>
        </footer>
    );
};

export default Footer;
