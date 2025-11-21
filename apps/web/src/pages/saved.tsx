import React from "react";
import { MainLayout } from "../layouts/MainLayout";
import { ArticleCard } from "../components/ArticleCard";
import { Button } from "../components/Button";
import { Bookmark } from "lucide-react";
import Link from "next/link";

// Simulating empty state for demonstration, toggle to see items
const savedArticles: any[] = [];

export default function Saved() {
    return (
        <MainLayout>
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-neutral-900">Saved Articles</h1>
                <p className="text-neutral-500 mt-2">
                    Your personal collection of important updates and resources.
                </p>
            </div>

            {savedArticles.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {savedArticles.map((article) => (
                        <ArticleCard key={article.id} {...article} isSaved={true} />
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                    <div className="w-24 h-24 bg-neutral-100 rounded-full flex items-center justify-center mb-6 text-neutral-400">
                        <Bookmark size={48} />
                    </div>
                    <h2 className="text-xl font-bold text-neutral-900 mb-2">
                        No saved articles yet
                    </h2>
                    <p className="text-neutral-500 max-w-md mb-8">
                        When you find something interesting, tap the bookmark icon to save it here for later reading.
                    </p>
                    <Link href="/feed">
                        <Button variant="primary">Browse News Feed</Button>
                    </Link>
                </div>
            )}
        </MainLayout>
    );
}
