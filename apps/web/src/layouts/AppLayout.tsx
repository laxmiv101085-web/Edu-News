import { ReactNode } from "react";
import { GraduationCap, Bookmark, ListChecks, School, Sparkles } from "lucide-react";
import Navbar from "@/components/navigation/Navbar";
import CategoryRail from "@/components/navigation/CategoryRail";
import MobileActionBar from "@/components/navigation/MobileActionBar";
import { AnimateLayout } from "@/lib/motion/AnimateLayout";
import { ErrorBoundary } from "@/components/feedback/ErrorBoundary";

const categories = [
  { id: "all", label: "All Stories", icon: Sparkles, href: "/feed" },
  { id: "exam", label: "Exam Alerts", icon: GraduationCap, href: "/feed?type=EXAM" },
  { id: "scholarship", label: "Scholarships", icon: Bookmark, href: "/feed?type=SCHOLARSHIP" },
  { id: "admission", label: "Admissions", icon: School, href: "/feed?type=ADMISSION" },
  { id: "saved", label: "Saved", icon: ListChecks, href: "/profile#saved" },
];

interface AppLayoutProps {
  children: ReactNode;
}

export const AppLayout = ({ children }: AppLayoutProps) => {
  return (
    <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text-primary)]">
      <Navbar />
      <div className="mx-auto flex w-full max-w-6xl gap-6 px-4 pb-24 pt-6 lg:px-8">
        <div className="hidden w-60 shrink-0 lg:block">
          <CategoryRail categories={categories} />
        </div>
        <main className="flex-1">
          <ErrorBoundary>
            <AnimateLayout>{children}</AnimateLayout>
          </ErrorBoundary>
        </main>
      </div>
      <MobileActionBar categories={categories} />
    </div>
  );
};

export default AppLayout;

