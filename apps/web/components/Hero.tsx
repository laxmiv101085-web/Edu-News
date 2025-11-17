import Button from "./Button";
import { ChevronRightIcon } from "@heroicons/react/24/solid";

export default function Hero() {
  return (
    <section className="hero-bg card-glass mx-auto max-w-6xl mt-8 p-8 md:p-12">
      <div className="grid md:grid-cols-2 gap-8 items-center">
        <div>
          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight">Stay Updated with Educational News</h1>
          <p className="mt-4 text-base text-slate-700 max-w-xl">
            Get real-time notifications about exams, scholarships, results, and admissions from trusted sources. Never miss an important deadline.
          </p>

          <div className="mt-6 flex gap-4">
            <Button variant="primary"><a href="/signup" className="flex items-center gap-2">Get Started <ChevronRightIcon className="w-4 h-4" /></a></Button>
            <Button variant="outline"><a href="/feed">Browse Feed</a></Button>
          </div>

          <div className="mt-8 grid grid-cols-3 gap-4">
            <div className="feature-card">
              <div className="text-xl">💡</div>
              <h3 className="mt-3 font-semibold">AI-Powered Summaries</h3>
              <p className="mt-2 text-sm text-slate-600">Concise summaries of educational notices automatically extracted.</p>
            </div>
            <div className="feature-card">
              <div className="text-xl">🔔</div>
              <h3 className="mt-3 font-semibold">Smart Notifications</h3>
              <p className="mt-2 text-sm text-slate-600">Custom alerts for exams, scholarships and results.</p>
            </div>
            <div className="feature-card">
              <div className="text-xl">🔎</div>
              <h3 className="mt-3 font-semibold">Search & Filter</h3>
              <p className="mt-2 text-sm text-slate-600">Find notices by name, type, location or keywords.</p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center">
          <div className="w-full max-w-md p-6 card-glass article-card animate-float">
            <p className="text-xs text-slate-500">Featured</p>
            <h3 className="mt-2 font-semibold text-lg">JEE Mains 2026 - Official Notification Released</h3>
            <p className="mt-2 text-sm text-slate-600">Exam date announced. Apply before <strong>2026-02-01</strong>.</p>
            <div className="mt-4 flex items-center justify-between">
              <div className="kicker tag-exam">Exam</div>
              <div className="text-xs text-slate-500">Published 2h ago</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

