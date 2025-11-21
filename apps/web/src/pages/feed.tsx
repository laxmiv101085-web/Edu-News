import React from "react";
import { MainLayout } from "../layouts/MainLayout";
import { ArticleCard } from "../components/ArticleCard";
import { Button } from "../components/Button";
import { Filter } from "lucide-react";

const feedArticles = [
  {
    id: "1",
    title: "Top 10 Scholarships for International Students in 2024",
    excerpt:
      "Discover the best fully funded scholarships available for students worldwide. Apply now before deadlines close.",
    category: "Scholarships",
    date: "Nov 20, 2024",
    readTime: "5 min read",
    imageUrl:
      "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: "2",
    title: "JEE Advanced 2025: Major Syllabus Changes Announced",
    excerpt:
      "The organizing institute has released the updated syllabus for the upcoming JEE Advanced examination.",
    category: "Exams",
    date: "Nov 19, 2024",
    readTime: "3 min read",
    imageUrl:
      "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: "3",
    title: "Harvard University Admissions: What You Need to Know",
    excerpt:
      "A comprehensive guide to the application process, requirements, and tips for getting into Harvard.",
    category: "Admissions",
    date: "Nov 18, 2024",
    readTime: "7 min read",
    imageUrl:
      "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: "4",
    title: "New Education Policy 2024 Implementation Guide",
    excerpt:
      "Everything schools and colleges need to know about the latest updates to the National Education Policy.",
    category: "Policy",
    date: "Nov 17, 2024",
    readTime: "6 min read",
    imageUrl:
      "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: "5",
    title: "Best Online Courses for Data Science in 2025",
    excerpt:
      "A curated list of the top-rated data science courses from Coursera, edX, and Udacity.",
    category: "Career",
    date: "Nov 16, 2024",
    readTime: "8 min read",
    imageUrl:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: "6",
    title: "CBSE Board Exam Datesheet Released",
    excerpt:
      "The Central Board of Secondary Education has announced the dates for Class 10 and 12 board exams.",
    category: "Exams",
    date: "Nov 15, 2024",
    readTime: "2 min read",
    imageUrl:
      "https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&q=80&w=800",
  },
];

const categories = ["All", "Scholarships", "Exams", "Admissions", "Policy", "Career"];

export default function Feed() {
  const [activeCategory, setActiveCategory] = React.useState("All");

  return (
    <MainLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-neutral-900 mb-6">Latest News</h1>

        <div className="flex flex-wrap items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            leftIcon={<Filter size={16} />}
            className="mr-2"
          >
            Filter
          </Button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${activeCategory === cat
                  ? "bg-neutral-900 text-white shadow-md"
                  : "bg-white text-neutral-600 hover:bg-neutral-100 border border-neutral-200"
                }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {feedArticles.map((article) => (
          <ArticleCard key={article.id} {...article} />
        ))}
      </div>

      <div className="mt-12 flex justify-center">
        <Button variant="secondary" size="lg" isLoading={false}>
          Load More Articles
        </Button>
      </div>
    </MainLayout>
  );
}
