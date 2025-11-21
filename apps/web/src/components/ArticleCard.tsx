import React from "react";
import { Card } from "./Card";
import { Calendar, Clock, Bookmark } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

interface ArticleCardProps {
    id: string;
    title: string;
    excerpt: string;
    category: string;
    date: string;
    readTime: string;
    imageUrl: string;
    isSaved?: boolean;
}

export const ArticleCard = ({
    id,
    title,
    excerpt,
    category,
    date,
    readTime,
    imageUrl,
    isSaved,
}: ArticleCardProps) => {
    return (
        <Link href={`/article/${id}`}>
            <Card className="group h-full flex flex-col cursor-pointer overflow-hidden">
                <div className="relative h-48 overflow-hidden">
                    <motion.img
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.4 }}
                        src={imageUrl}
                        alt={title}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 left-3">
                        <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-xs font-bold text-primary-700 rounded-full shadow-sm">
                            {category}
                        </span>
                    </div>
                    <button
                        className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full text-neutral-400 hover:text-primary-600 transition-colors shadow-sm"
                        onClick={(e) => {
                            e.preventDefault();
                            // Handle save logic
                        }}
                    >
                        <Bookmark
                            size={16}
                            className={isSaved ? "fill-primary-600 text-primary-600" : ""}
                        />
                    </button>
                </div>
                <div className="p-5 flex-1 flex flex-col">
                    <h3 className="text-lg font-bold text-neutral-900 mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors">
                        {title}
                    </h3>
                    <p className="text-neutral-500 text-sm line-clamp-2 mb-4 flex-1">
                        {excerpt}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-neutral-400 mt-auto">
                        <div className="flex items-center gap-1">
                            <Calendar size={14} />
                            <span>{date}</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <Clock size={14} />
                            <span>{readTime}</span>
                        </div>
                    </div>
                </div>
            </Card>
        </Link>
    );
};
