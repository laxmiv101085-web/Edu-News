import React from "react";
import { Search, Bell } from "lucide-react";
import { Button } from "./Button";

export const Topbar = () => {
    return (
        <header className="sticky top-0 z-40 w-full bg-white/60 backdrop-blur-xl border-b border-white/20 supports-[backdrop-filter]:bg-white/40">
            <div className="flex items-center justify-between px-6 py-4 lg:pl-72">
                <div className="flex-1 max-w-xl">
                    <div className="relative group">
                        <Search
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 group-focus-within:text-primary-500 transition-colors"
                            size={20}
                        />
                        <input
                            type="text"
                            placeholder="Search for scholarships, exams..."
                            className="w-full pl-10 pr-4 py-2.5 bg-neutral-50 border-none rounded-xl text-neutral-900 placeholder-neutral-400 focus:ring-2 focus:ring-primary-100 focus:bg-white transition-all outline-none"
                        />
                    </div>
                </div>

                <div className="flex items-center gap-4 ml-4">
                    <button className="relative p-2 text-neutral-500 hover:bg-neutral-50 rounded-full transition-colors">
                        <Bell size={20} />
                        <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                    </button>
                    <div className="h-8 w-px bg-neutral-200"></div>
                    <div className="flex items-center gap-3">
                        <div className="text-right hidden sm:block">
                            <p className="text-sm font-medium text-neutral-900">Alex Johnson</p>
                            <p className="text-xs text-neutral-500">Student</p>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary-500 to-accent-500 p-0.5">
                            <div className="w-full h-full rounded-full bg-white border-2 border-transparent overflow-hidden">
                                <img
                                    src="https://api.dicebear.com/7.x/avataaars/svg?seed=Alex"
                                    alt="Profile"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};
