import { useRouter } from "next/router";
import { useMemo, useState } from "react";
import { Loader2 } from "lucide-react";
import { useApi } from "@/hooks/useApi";
import { fetchArticle, fetchArticles } from "@/lib/api/articles";
import { Article } from "@/types/article";
import ArticleCard from "@/components/cards/ArticleCard";
import ArticleMeta from "@/components/article/ArticleMeta";
import CommentsPlaceholder from "@/components/article/CommentsPlaceholder";
import RelatedArticles from "@/components/article/RelatedArticles";
import ReadingModeToggle from "@/components/article/ReadingModeToggle";
import { useBookmarks } from "@/hooks/useBookmarks";
import { useToast } from "@/components/feedback/ToastProvider";

export default function ItemPage() {
  const router = useRouter();
  const { id } = router.query;
  const [mode, setMode] = useState<"studio" | "focus">("studio");
  const { toggleBookmark } = useBookmarks();
  const { notify } = useToast();

  const { data: article, isLoading } = useApi<Article>({
    key: ["article", id],
    queryFn: () => fetchArticle(String(id)),
    enabled: Boolean(id),
  });

  const { data: related = [] } = useApi<Article[]>({
    key: ["related", article?.type],
    queryFn: () => fetchArticles({ type: article?.type, limit: 3 }),
    enabled: Boolean(article?.type),
  });

  const readingClasses = useMemo(
    () =>
      mode === "focus"
        ? "prose-article mx-auto max-w-3xl rounded-3xl bg-surface/90 p-10 shadow-deep"
        : "prose-article",
    [mode]
  );

  const handleBookmark = async () => {
    if (!article) return;
    await toggleBookmark(article.id);
    notify({
      title: "Saved for later",
      description: "Find this article anytime under your profile bookmarks.",
      intent: "success",
    });
  };

  if (isLoading || !article) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
        <span className="ml-3 text-sm text-text-muted">Loading article...</span>
      </div>
    );
  }

  return (
    <div className="space-y-10 pb-16">
      <ReadingModeToggle value={mode} onChange={setMode} />
      <div className="grid gap-10 lg:grid-cols-[minmax(0,3fr)_1fr]">
        <article className="space-y-8 rounded-3xl border border-border bg-surface/80 p-8 shadow-medium">
          <ArticleMeta article={article} onBookmark={handleBookmark} />

          {article.shortSummary && (
            <div className="rounded-2xl bg-primary-50/70 p-6 text-primary-900 shadow-soft">
              <p className="text-sm uppercase tracking-[0.4em]">Quick take</p>
              <p className="mt-3 text-lg font-medium">{article.shortSummary}</p>
            </div>
          )}

          {article.longSummary && (
            <section className="space-y-3">
              <h2 className="text-2xl font-semibold text-text-primary">Deep dive</h2>
              <p className="text-text-muted">{article.longSummary}</p>
            </section>
          )}

          <section className={readingClasses}>
            {article.body?.split("\n").map((paragraph, index) => (
              <p key={`${paragraph}-${index}`}>{paragraph}</p>
            ))}
          </section>

          {article.tags?.length ? (
            <div className="flex flex-wrap gap-2">
              {article.tags.map((tag) => (
                <span key={tag} className="rounded-full bg-neutral-100 px-4 py-1 text-xs uppercase tracking-[0.3em]">
                  {tag}
                </span>
              ))}
            </div>
          ) : null}

          <CommentsPlaceholder />
        </article>

        <div className="space-y-6">
          <RelatedArticles items={related} />
          <div className="rounded-2xl border border-border bg-surface p-5 shadow-soft">
            <p className="text-sm font-semibold uppercase tracking-[0.4em] text-text-muted">More like this</p>
            <div className="mt-4 space-y-4">
              {related.map((item) => (
                <ArticleCard key={item.id} article={item} layout="horizontal" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

