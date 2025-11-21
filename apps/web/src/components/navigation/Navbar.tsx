import { AnimatePresence, m } from "framer-motion";
import { Bookmark, Bell, CircleUserRound, Moon, Search, SunMedium } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useMemo, useState } from "react";
import Button from "@/components/ui/Button";
import { useTheme } from "@/hooks/useTheme";
import cn from "@/lib/utils/cn";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Feed", href: "/feed" },
  { label: "Admin", href: "/admin" },
];

type SearchResult = {
  id: string;
  title: string;
  href: string;
  category: string;
};

const demoResults: SearchResult[] = [
  { id: "1", title: "JEE Main 2026 Official Notice", href: "/item/1", category: "Exam" },
  { id: "2", title: "State Scholarship Portal Round 2", href: "/item/2", category: "Scholarship" },
  { id: "3", title: "AICTE Internship Drive", href: "/item/3", category: "Career" },
];

export const Navbar = () => {
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(0);

  const filteredResults = useMemo(() => {
    if (!query) return demoResults;
    return demoResults.filter((item) => item.title.toLowerCase().includes(query.toLowerCase()));
  }, [query]);

  const handleKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (event) => {
    if (!filteredResults.length) return;

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setHighlightedIndex((prev) => (prev + 1) % filteredResults.length);
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      setHighlightedIndex((prev) => (prev - 1 + filteredResults.length) % filteredResults.length);
    }

    if (event.key === "Enter") {
      const item = filteredResults[highlightedIndex];
      if (item) {
        router.push(item.href);
        setIsFocused(false);
      }
    }
  };

  const handleResultClick = (href: string) => {
    router.push(href);
    setIsFocused(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur bg-surface/70 border-b border-border/40">
      <m.nav
        initial={{ y: -24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
        className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-3 lg:px-8"
        aria-label="Primary"
      >
        <Link href="/" className="flex items-center gap-3 font-display text-lg font-semibold">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary-600 text-white shadow-soft">
            Ed
          </span>
          <span className="hidden sm:inline text-text-primary">Educational App</span>
        </Link>

        <div className="hidden items-center gap-4 text-sm font-medium text-text-muted lg:flex">
          {navLinks.map((link) => {
            const isActive = router.pathname === link.href;
            return (
              <Link key={link.href} href={link.href} className="relative px-1 py-2">
                {isActive && (
                  <m.span
                    layoutId="nav-underline"
                    className="absolute inset-x-0 -bottom-1 h-0.5 rounded-full bg-primary-500"
                  />
                )}
                {link.label}
              </Link>
            );
          })}
        </div>

        <div className="relative ml-auto flex w-full max-w-md flex-1 items-center">
          <label htmlFor="site-search" className="sr-only">
            Search articles
          </label>
          <div className="relative w-full">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
            <input
              id="site-search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setTimeout(() => setIsFocused(false), 120)}
              onKeyDown={handleKeyDown}
              placeholder="Search exams, scholarships, results..."
              className="w-full rounded-xl border border-border/60 bg-white/70 py-2.5 pl-10 pr-3 text-sm text-text-primary shadow-soft/30 focus:border-primary-500 focus:bg-white focus:outline-none"
            />
            <AnimatePresence>
              {isFocused && filteredResults.length > 0 && (
                <m.ul
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 4 }}
                  transition={{ duration: 0.2 }}
                  className="absolute left-0 right-0 top-12 z-50 rounded-2xl border border-border bg-surface/95 p-2 shadow-medium backdrop-blur-lg"
                >
                  {filteredResults.map((result, index) => (
                    <li key={result.id}>
                      <button
                        type="button"
                        onMouseDown={(event) => event.preventDefault()}
                        onClick={() => handleResultClick(result.href)}
                        className={cn(
                          "flex w-full flex-col rounded-xl px-3 py-2 text-left text-sm",
                          highlightedIndex === index ? "bg-primary-50 text-primary-600" : "text-text-muted"
                        )}
                      >
                        <span className="font-medium text-text-primary">{result.title}</span>
                        <span className="text-xs uppercase tracking-widest text-text-muted">{result.category}</span>
                      </button>
                    </li>
                  ))}
                </m.ul>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="ml-2 flex items-center gap-1">
          <Button
            variant="ghost"
            aria-label="Toggle theme"
            className="text-text-muted"
            onClick={toggleTheme}
            title="Toggle theme"
          >
            {theme === "light" ? <Moon className="h-5 w-5" /> : <SunMedium className="h-5 w-5" />}
          </Button>
          <Button variant="ghost" aria-label="Bookmarks" className="text-text-muted">
            <Bookmark className="h-5 w-5" />
          </Button>
          <Button variant="ghost" aria-label="Notifications" className="text-text-muted">
            <Bell className="h-5 w-5" />
          </Button>
          <Button variant="secondary" aria-label="Account">
            <CircleUserRound className="h-5 w-5" />
          </Button>
        </div>
      </m.nav>
    </header>
  );
};

export default Navbar;


