import React from "react";
import { MainLayout } from "../layouts/MainLayout";
import { Button } from "../components/Button";
import { Card } from "../components/Card";
import { ArticleCard } from "../components/ArticleCard";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, TrendingUp, Award } from "lucide-react";

const featuredArticles = [
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
];

export default function Home() {
  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="mb-12">
        <Card
          variant="glass"
          className="relative overflow-hidden bg-gradient-to-br from-primary-600 to-primary-800 text-white border-none p-8 md:p-12"
          hoverEffect={false}
        >
          <div className="relative z-10 max-w-2xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-sm font-medium mb-6">
                <Sparkles size={14} className="text-yellow-300" />
                <span>New Updates Available</span>
              </span>
              <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6 font-display">
                Stay Ahead of Every Educational Opportunity
              </h1>
              <p className="text-primary-100 text-lg mb-8 max-w-xl">
                Get real-time alerts on scholarships, exams, and admissions. Curated news tailored for your academic success.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button
                  size="lg"
                  className="bg-white text-primary-700 hover:bg-primary-50 border-none"
                  rightIcon={<ArrowRight size={18} />}
                >
                  Read Latest Updates
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="text-white border-white/30 hover:bg-white/10"
                >
                  Explore Categories
                </Button>
              </div>
            </motion.div>
          </div>

          {/* Abstract Background Shapes */}
          <div className="absolute top-0 right-0 w-full h-full overflow-hidden pointer-events-none">
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary-500 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob"></div>
            <div className="absolute top-0 -right-4 w-72 h-72 bg-accent-500 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-2000"></div>
            <div className="absolute -bottom-8 right-20 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-4000"></div>
          </div>
        </Card>
      </section>

      {/* Quick Stats / Features */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {[
          {
            icon: Award,
            label: "Scholarships",
            count: "500+",
            color: "text-yellow-600",
            bg: "bg-yellow-50",
          },
          {
            icon: TrendingUp,
            label: "Exam Alerts",
            count: "Live",
            color: "text-blue-600",
            bg: "bg-blue-50",
          },
          {
            icon: Sparkles,
            label: "Success Stories",
            count: "1k+",
            color: "text-purple-600",
            bg: "bg-purple-50",
          },
        ].map((item, idx) => (
          <Card key={idx} className="p-6 flex items-center gap-4">
            <div className={`p-3 rounded-xl ${item.bg} ${item.color}`}>
              <item.icon size={24} />
            </div>
            <div>
              <p className="text-sm text-neutral-500 font-medium">
                {item.label}
              </p>
              <p className="text-2xl font-bold text-neutral-900">
                {item.count}
              </p>
            </div>
          </Card>
        ))}
      </section>

      {/* Featured News */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-neutral-900">Featured News</h2>
          <Button variant="ghost" rightIcon={<ArrowRight size={16} />}>
            View All
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredArticles.map((article) => (
            <ArticleCard key={article.id} {...article} />
          ))}
        </div>
      </section>
    </MainLayout>
  );
}
