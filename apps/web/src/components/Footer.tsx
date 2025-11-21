import React from 'react';
import Link from 'next/link';
import { Twitter, Instagram, Linkedin, Github } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-bg-dark border-t border-white/5 pt-20 pb-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                    <div className="col-span-1 md:col-span-2">
                        <Link href="/" className="text-2xl font-bold text-white tracking-tighter mb-6 block">
                            Edu<span className="text-accent-yellow">News</span>
                        </Link>
                        <p className="text-neutral-400 max-w-sm mb-8">
                            Stay ahead of every educational opportunity. Real-time updates for scholarships, exams, admissions, and more.
                        </p>
                        <div className="flex space-x-4">
                            {[Twitter, Instagram, Linkedin, Github].map((Icon, i) => (
                                <a
                                    key={i}
                                    href="#"
                                    className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-neutral-400 hover:bg-accent-yellow hover:text-bg-dark transition-all"
                                >
                                    <Icon className="w-5 h-5" />
                                </a>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h3 className="text-white font-bold mb-6">Platform</h3>
                        <ul className="space-y-4">
                            {['Scholarships', 'Exam Alerts', 'Results', 'Admissions', 'News Feed'].map((item) => (
                                <li key={item}>
                                    <Link href="#" className="text-neutral-400 hover:text-accent-yellow transition-colors">
                                        {item}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-white font-bold mb-6">Company</h3>
                        <ul className="space-y-4">
                            {['About Us', 'Careers', 'Privacy Policy', 'Terms of Service', 'Contact'].map((item) => (
                                <li key={item}>
                                    <Link href="#" className="text-neutral-400 hover:text-accent-yellow transition-colors">
                                        {item}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center">
                    <p className="text-neutral-500 text-sm">
                        © {new Date().getFullYear()} EduNews. All rights reserved.
                    </p>
                    <p className="text-neutral-500 text-sm mt-2 md:mt-0">
                        Designed for Students. Built with ❤️.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
