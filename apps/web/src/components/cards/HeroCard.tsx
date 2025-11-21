import { m } from "framer-motion";
import Link from "next/link";
import { BookmarkPlus, ExternalLink } from "lucide-react";
import Button from "@/components/ui/Button";
import { Article } from "@/types/article";

interface HeroCardProps {
  article: Article;
  onBookmark?: (id: string) => void;
}

export const HeroCard = ({ article, onBookmark }: HeroCardProps) => {
  return (
    <m.section
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
      className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary-600 via-primary-700 to-neutral-900 p-8 text-white shadow-deep"
    >
      <div className="grid gap-8 lg:grid-cols-2">
        <div className="space-y-5">
          <div className="inline-flex rounded-full border border-white/30 px-4 py-1 text-xs uppercase tracking-[0.2em]">
            Featured Story
          </div>
          <h1 className="font-display text-4xl leading-tight tracking-tight lg:text-5xl">{article.title}</h1>
          <p className="text-base text-white/85 lg:text-lg">{article.summary ?? article.shortSummary}</p>
          <div className="flex flex-wrap gap-3 text-sm text-white/70">
            <span>{article.source?.name ?? "Verified Source"}</span>
            <span aria-hidden>•</span>
            <span>{article.publishedAt ? new Date(article.publishedAt).toLocaleDateString() : "Just in"}</span>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button asChild>
              <Link href={article.url ?? `/item/${article.id}`}>
                <span className="inline-flex items-center gap-2">
                  Read Update
                  <ExternalLink className="h-4 w-4" />
                </span>
              </Link>
            </Button>
            <Button
              variant="ghost"
              onClick={() => onBookmark?.(article.id)}
              aria-label="Bookmark featured article"
              className="text-white"
            >
              <BookmarkPlus className="h-4 w-4" />
              Save for later
            </Button>
          </div>
        </div>

        <m.div
          className="glass-panel relative h-80 overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-deep"
          whileHover={{ y: -6 }}
          transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.4),_transparent_55%)]" />
          <div className="relative flex h-full flex-col justify-between p-6 text-neutral-900">
            <div>
              <p className="text-xs uppercase tracking-widest text-neutral-500">Key deadline</p>
              <p className="text-4xl font-bold text-neutral-900">
                {article.tags?.[0] ?? article.type ?? "Deadline Soon"}
              </p>
              <p className="mt-2 text-sm text-neutral-600">
                {article.longSummary?.split(".")[0] ?? "Stay updated with important milestones and notifications."}
              </p>
            </div>
            <div className="rounded-2xl bg-white/90 p-4 shadow-medium">
              <p className="text-xs uppercase tracking-[0.4em] text-neutral-500">Next steps</p>
              <p className="mt-2 text-sm text-neutral-800">
                Review criteria, gather documents, and submit before the final deadline to stay ahead.
              </p>
            </div>
          </div>
        </m.div>
      </div>
    </m.section>
  );
};

export default HeroCard;


