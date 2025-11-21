import { m } from "framer-motion";
import Link from "next/link";
import { Bookmark, LinkIcon } from "lucide-react";
import cn from "@/lib/utils/cn";
import Button from "@/components/ui/Button";
import { Article } from "@/types/article";

interface ArticleCardProps {
  article: Article;
  layout?: "vertical" | "horizontal";
  onBookmark?: (id: string) => void;
}

export const ArticleCard = ({ article, layout = "vertical", onBookmark }: ArticleCardProps) => {
  const Tag = article.type ?? article.category ?? "Update";
  const published = article.publishedAt ? new Date(article.publishedAt).toLocaleDateString() : "Recently";

  return (
    <m.article
      layout
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 300, damping: 26 }}
      className={cn(
        "group relative overflow-hidden rounded-2xl border border-border/80 bg-surface shadow-soft",
        layout === "horizontal" ? "grid grid-cols-[160px,1fr]" : "flex flex-col"
      )}
    >
      <div
        className={cn(
          "relative h-48 overflow-hidden bg-gradient-to-br from-primary-100 via-white to-accent-100",
          { "h-full": layout === "horizontal" }
        )}
      >
        <span className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(37,99,235,0.15),_transparent_55%)]" />
      </div>

      <div className="flex flex-1 flex-col gap-4 p-5">
        <div className="flex items-center justify-between text-xs uppercase tracking-[0.3em] text-text-muted">
          <span>{Tag}</span>
          <span>{published}</span>
        </div>

        <div className="space-y-2">
          <Link href={`/item/${article.id}`} className="text-lg font-semibold text-text-primary">
            {article.title}
          </Link>
          <p className="text-sm text-text-muted line-clamp-3">{article.shortSummary ?? article.summary}</p>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-text-muted">
          <div className="flex flex-wrap gap-2">
            {(article.tags ?? []).slice(0, 2).map((tag) => (
              <span key={tag} className="rounded-full bg-neutral-100 px-3 py-1 text-[11px] uppercase tracking-[0.3em]">
                {tag}
              </span>
            ))}
          </div>
          <span>Source · {article.source?.name ?? "Official"}</span>
        </div>

        <div className="flex items-center justify-between">
          <Button asChild variant="ghost" className="text-sm text-primary-600">
            <Link href={`/item/${article.id}`} aria-label={`Open article ${article.title}`}>
              <span className="inline-flex items-center gap-2">
                Read more
                <LinkIcon className="h-4 w-4" />
              </span>
            </Link>
          </Button>
          <button
            type="button"
            onClick={() => onBookmark?.(article.id)}
            className="rounded-full bg-neutral-100 p-2 text-primary-600 transition hover:bg-primary-50"
            aria-label="Bookmark article"
          >
            <Bookmark className="h-4 w-4" />
          </button>
        </div>
      </div>
    </m.article>
  );
};

export default ArticleCard;


