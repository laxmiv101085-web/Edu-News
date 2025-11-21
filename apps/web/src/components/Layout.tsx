import React from 'react';
import Head from 'next/head';
import Navbar from './Navbar';
import Footer from './Footer';

interface LayoutProps {
    children: React.ReactNode;
    title?: string;
}

const Layout = ({ children, title = 'EduNews - Stay Ahead' }: LayoutProps) => {
    return (
        <div className="min-h-screen bg-bg-dark font-sans text-neutral-100 selection:bg-accent-yellow/30 selection:text-accent-yellow overflow-x-hidden">
            <Head>
                <title>{title}</title>
                <meta name="description" content="Real-time updates for scholarships, exams, admissions, results, and government education notifications." />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            {/* Global Background Effects */}
            <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-accent-yellow/5 rounded-full mix-blend-screen filter blur-[120px] opacity-20 animate-blob"></div>
                <div className="absolute top-[20%] right-[-10%] w-[50%] h-[50%] bg-accent-cyan/5 rounded-full mix-blend-screen filter blur-[120px] opacity-20 animate-blob animation-delay-2000"></div>
                <div className="absolute bottom-[-20%] left-[20%] w-[50%] h-[50%] bg-accent-indigo/5 rounded-full mix-blend-screen filter blur-[120px] opacity-20 animate-blob animation-delay-4000"></div>
                <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] mix-blend-overlay"></div>
            </div>

            <Navbar />

            <main className="relative z-10 pt-20 min-h-screen flex flex-col">
                {children}
            </main>

            <Footer />
        </div>
    );
};

export default Layout;
