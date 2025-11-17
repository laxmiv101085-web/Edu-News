import React from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import ArticleCard from "@/components/ArticleCard";

export default function Home() {
  const sample = [
    { id: "1", title: "JEE Mains 2026 - Official Notification Released", summary: "Exam date announced. Apply before 2026-02-01.", category: "exam", publishedAt: new Date().toISOString() },
    { id: "2", title: "New Scholarships for Engineering Students", summary: "Apply by 2026-03-10 for merit-based grants.", category: "scholarship", publishedAt: new Date().toISOString() }
  ];

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="px-6 md:px-12">
        <Hero />
        <section className="max-w-6xl mx-auto mt-10">
          <h2 className="mb-6">Latest Notices</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {sample.map(a => <ArticleCard key={a.id} article={a} />)}
          </div>
        </section>
      </main>
    </div>
  );
}

