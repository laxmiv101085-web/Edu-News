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
        <aside className="fixed left-0 top-0 h-screen w-72 bg-[#020617]/80 backdrop-blur-xl border-r border-white/5 hidden lg:flex flex-col z-50">
            <div className="p-8 flex items-center gap-4">
                <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary-500/20">
                    <GraduationCap size={24} />
                </div>
                <span className="font-display font-bold text-xl text-white tracking-tight">
                    EduNews
                </span>
            </div>

            <nav className="flex-1 px-6 py-6 space-y-2">
                {navItems.map((item) => {
                    const isActive = router.pathname === item.href;
                    return (
                        <Link key={item.href} href={item.href} passHref>
                            <motion.div
                                whileHover={{ x: 4 }}
                                className={cn(
                                    "flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all cursor-pointer group relative overflow-hidden",
                                    isActive
                                        ? "bg-primary-500/10 text-primary-400"
                                        : "text-neutral-400 hover:text-white hover:bg-white/5"
                                )}
                            >
                                <item.icon size={20} className={cn("transition-colors", isActive ? "text-primary-400" : "group-hover:text-white")} />
                                <span className="font-medium">{item.label}</span>
                                {isActive && (
                                    <motion.div
                                        layoutId="active-glow"
                                        className="absolute inset-0 bg-primary-500/5 rounded-xl"
                                        initial={false}
                                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                    />
                                )}
                            </motion.div>
                        </Link>
                    );
                })}
            </nav>

            <div className="p-6 border-t border-white/5">
                <button className="flex items-center gap-3 px-4 py-3.5 w-full rounded-xl text-neutral-400 hover:bg-red-500/10 hover:text-red-400 transition-all group">
                    <LogOut size={20} className="group-hover:text-red-400 transition-colors" />
                    <span className="font-medium">Sign Out</span>
                </button>
            </div>
        </aside>
    );
};
