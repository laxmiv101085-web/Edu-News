import { Share2, BookmarkCheck } from "lucide-react";
import { Article } from "@/types/article";
import FloatingAction from "@/components/actions/FloatingAction";

interface ArticleMetaProps {
  article: Article;
  onBookmark?: () => void;
  onShare?: () => void;
}

export const ArticleMeta = ({ article, onBookmark, onShare }: ArticleMetaProps) => (
  <header className="space-y-4">
    <p className="text-xs uppercase tracking-[0.4em] text-text-muted">{article.type ?? "Update"}</p>
    <h1 className="font-display text-4xl leading-tight">{article.title}</h1>
    <div className="flex flex-wrap items-center gap-4 text-sm text-text-muted">
      <span>{article.source?.name ?? "Official Source"}</span>
      <span aria-hidden>•</span>
      <span>{article.publishedAt ? new Date(article.publishedAt).toLocaleDateString() : "Just in"}</span>
      <span aria-hidden>•</span>
      <span>{article.tags?.slice(0, 2).join(", ")}</span>
    </div>
    <div className="flex flex-wrap gap-2">
      <FloatingAction icon={BookmarkCheck} label="Bookmark" onClick={onBookmark} />
      <FloatingAction
        icon={Share2}
        label="Share"
        onClick={() => {
          onShare?.();
          if (navigator.share && article.url) {
            navigator.share({ title: article.title, url: article.url }).catch(() => undefined);
          }
        }}
        className="bg-white text-primary-600"
      />
    </div>
  </header>
);

export default ArticleMeta;


