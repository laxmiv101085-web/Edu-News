import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import SEO from './SEO';

interface LayoutProps {
    children: React.ReactNode;
    title?: string;
    description?: string;
    image?: string;
    article?: boolean;
    keywords?: string;
    author?: string;
    publishedAt?: string;
}

const Layout = ({
    children,
    title,
    description,
    image,
    article,
    keywords,
    author,
    publishedAt
}: LayoutProps) => {
    return (
        <div className="min-h-screen bg-bg-dark font-sans text-neutral-100 selection:bg-accent-yellow/30 selection:text-accent-yellow overflow-x-hidden">
            <SEO
                title={title}
                description={description}
                image={image}
                article={article}
                keywords={keywords}
                author={author}
                publishedAt={publishedAt}
            />

            {/* Global Background Effects */}
            {/* Global Background Effects - GYPTO Theme */}
            <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-[#050505]">
                {/* Main Gradient Orb (Top Left) */}
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-600/20 rounded-full mix-blend-screen filter blur-[100px] opacity-40 animate-blob"></div>

                {/* Secondary Gradient Orb (Center Right) */}
                <div className="absolute top-[20%] right-[-5%] w-[40%] h-[40%] bg-pink-600/20 rounded-full mix-blend-screen filter blur-[100px] opacity-30 animate-blob animation-delay-2000"></div>

                {/* Bottom Gradient Orb (Bottom Left) */}
                <div className="absolute bottom-[-10%] left-[10%] w-[45%] h-[45%] bg-blue-600/20 rounded-full mix-blend-screen filter blur-[100px] opacity-30 animate-blob animation-delay-4000"></div>

                {/* Noise Texture */}
                <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.05] mix-blend-overlay"></div>
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
