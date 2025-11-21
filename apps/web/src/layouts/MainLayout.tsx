import React from "react";
import { Sidebar } from "../components/Sidebar";
import { Topbar } from "../components/Topbar";

interface MainLayoutProps {
    children: React.ReactNode;
}

export const MainLayout = ({ children }: MainLayoutProps) => {
    return (
        <div className="min-h-screen bg-[#020617] font-sans text-neutral-100 relative overflow-hidden selection:bg-primary-500/30 selection:text-primary-200">
            {/* Dynamic Background Effects */}
            <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-primary-900/20 rounded-full mix-blend-screen filter blur-[120px] opacity-50 animate-blob"></div>
                <div className="absolute top-[20%] right-[-10%] w-[50%] h-[50%] bg-purple-900/20 rounded-full mix-blend-screen filter blur-[120px] opacity-40 animate-blob animation-delay-2000"></div>
                <div className="absolute bottom-[-20%] left-[20%] w-[50%] h-[50%] bg-blue-900/20 rounded-full mix-blend-screen filter blur-[120px] opacity-40 animate-blob animation-delay-4000"></div>
            </div>

            <Sidebar />
            <div className="lg:pl-72 transition-all duration-300 relative z-10">
                <Topbar />
                <main className="p-8 max-w-7xl mx-auto animate-slide-fade">
                    {children}
                </main>
            </div>
        </div>
    );
};
