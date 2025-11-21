import { m } from "framer-motion";
import Link from "next/link";
import { CategoryOption } from "./CategoryRail";
import cn from "@/lib/utils/cn";

interface MobileActionBarProps {
  categories: CategoryOption[];
}

export const MobileActionBar = ({ categories }: MobileActionBarProps) => {
  return (
    <div className="fixed inset-x-0 bottom-3 z-40 px-4 lg:hidden">
      <m.nav
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
        className="mx-auto flex max-w-md items-center justify-between rounded-2xl bg-surface/90 px-4 py-3 shadow-medium ring-1 ring-border/60 backdrop-blur-lg"
        aria-label="Mobile quick filters"
      >
        {categories.map((category) => {
          const Icon = category.icon;
          return (
            <Link
              key={category.id}
              href={category.href}
              className={cn(
                "group flex flex-col items-center gap-1 text-xs font-medium text-text-muted transition hover:text-primary-600"
              )}
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-neutral-100 text-primary-600 transition group-active:scale-95 dark:bg-white/5">
                <Icon className="h-5 w-5" aria-hidden />
              </span>
              {category.label}
            </Link>
          );
        })}
      </m.nav>
    </div>
  );
};

export default MobileActionBar;


