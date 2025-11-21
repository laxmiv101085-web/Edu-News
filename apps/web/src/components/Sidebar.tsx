import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import {
    Home,
    Newspaper,
    Bookmark,
    Settings,
    LogOut,
    GraduationCap,
} from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

const navItems = [
    { label: "Home", icon: Home, href: "/" },
    { label: "News Feed", icon: Newspaper, href: "/feed" },
    { label: "Saved", icon: Bookmark, href: "/saved" },
    { label: "Settings", icon: Settings, href: "/settings" },
];

export const Sidebar = () => {
    const router = useRouter();

    return (
        <aside className="fixed left-0 top-0 h-screen w-64 bg-white/60 backdrop-blur-xl border-r border-white/20 hidden lg:flex flex-col z-50 shadow-lg shadow-neutral-200/20">
            <div className="p-6 flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-primary-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary-600/30">
                    <GraduationCap size={24} />
                </div>
                <span className="font-display font-bold text-xl text-neutral-900 tracking-tight">
                    EduNews
                </span>
            </div>

            <nav className="flex-1 px-4 py-6 space-y-2">
                {navItems.map((item) => {
                    const isActive = router.pathname === item.href;
                    return (
                        <Link key={item.href} href={item.href} passHref>
                            <motion.div
                                whileHover={{ x: 4 }}
                                className={cn(
                                    "flex items-center gap-3 px-4 py-3 rounded-xl transition-colors cursor-pointer",
                                    isActive
                                        ? "bg-primary-50 text-primary-600 font-medium"
                                        : "text-neutral-500 hover:bg-neutral-50 hover:text-neutral-900"
                                )}
                            >
                                <item.icon size={20} />
                                <span>{item.label}</span>
                                {isActive && (
                                    <motion.div
                                        layoutId="active-pill"
                                        className="absolute left-0 w-1 h-8 bg-primary-600 rounded-r-full"
                                    />
                                )}
                            </motion.div>
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-neutral-100">
                <button className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-neutral-500 hover:bg-red-50 hover:text-red-600 transition-colors">
                    <LogOut size={20} />
                    <span>Sign Out</span>
                </button>
            </div>
        </aside>
    );
};
