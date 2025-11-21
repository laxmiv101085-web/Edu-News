import { m } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/router";
import { LucideIcon } from "lucide-react";
import cn from "@/lib/utils/cn";

export interface CategoryOption {
  id: string;
  label: string;
  icon: LucideIcon;
  href: string;
}

interface CategoryRailProps {
  categories: CategoryOption[];
}

const hoverTransition = { type: "spring" as const, stiffness: 500, damping: 30 };

export const CategoryRail = ({ categories }: CategoryRailProps) => {
  const router = useRouter();
  const activeSegment = (router.query.type as string) ?? router.query.category ?? "all";

  return (
    <aside aria-label="Quick filters" className="glass-panel px-4 py-6">
      <p className="text-xs uppercase tracking-widest text-text-muted">Browse</p>
      <div className="mt-4 flex flex-col gap-2">
        {categories.map((category) => {
          const isActive = activeSegment === category.id;
          const Icon = category.icon;
          return (
            <Link
              key={category.id}
              href={category.href}
              className={cn(
                "relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition",
                isActive ? "text-primary-600" : "text-text-muted hover:text-text-primary"
              )}
            >
              {isActive && (
                <m.span
                  layoutId="category-pill"
                  className="absolute inset-0 rounded-lg bg-primary-50/80 dark:bg-primary-600/10"
                  transition={hoverTransition}
                />
              )}
              <span className="relative z-10 flex h-8 w-8 items-center justify-center rounded-lg bg-primary-50/60 text-primary-600 dark:bg-white/5">
                <Icon className="h-4 w-4" aria-hidden />
              </span>
              <span className="relative z-10">{category.label}</span>
            </Link>
          );
        })}
      </div>
    </aside>
  );
};

export default CategoryRail;


