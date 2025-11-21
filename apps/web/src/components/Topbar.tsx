import React from "react";
import { Search, Bell, ChevronDown } from "lucide-react";
import { Button } from "./Button";

export const Topbar = () => {
    return (
        <header className="sticky top-0 z-40 w-full bg-[#020617]/80 backdrop-blur-xl border-b border-white/5 supports-[backdrop-filter]:bg-[#020617]/40">
            <div className="flex items-center justify-between px-8 py-5">
                <div className="flex-1 max-w-xl">
                    <div className="relative group">
                        <Search
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500 group-focus-within:text-primary-400 transition-colors"
                            size={20}
                        />
                        <input
                            type="text"
                            placeholder="Search for scholarships, exams..."
                            className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/5 rounded-2xl text-neutral-200 placeholder-neutral-500 focus:ring-2 focus:ring-primary-500/50 focus:bg-white/10 transition-all outline-none"
                        />
                    </div>
                </div>

                <div className="flex items-center gap-6 ml-4">
                    <button className="relative p-2.5 text-neutral-400 hover:bg-white/5 hover:text-white rounded-xl transition-all">
                        <Bell size={22} />
                        <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-[#020617]"></span>
                    </button>
                    <div className="h-8 w-px bg-white/10"></div>
                    <button className="flex items-center gap-3 hover:bg-white/5 p-2 rounded-xl transition-all group">
                        <div className="text-right hidden sm:block">
                            <p className="text-sm font-medium text-neutral-200 group-hover:text-white transition-colors">Alex Johnson</p>
                            <p className="text-xs text-neutral-500">Student</p>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary-500 to-accent-500 p-0.5">
                            <div className="w-full h-full rounded-full bg-[#020617] border-2 border-transparent overflow-hidden">
                                <img
                                    src="https://api.dicebear.com/7.x/avataaars/svg?seed=Alex"
                                    alt="Profile"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </div>
                        <ChevronDown size={16} className="text-neutral-500 group-hover:text-white transition-colors" />
                    </button>
                </div>
            </div>
        </header>
    );
};
