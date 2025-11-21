export const ArticleCardSkeleton = () => (
  <div className="rounded-2xl border border-border/50 bg-surface p-5 shadow-soft">
    <div className="skeleton h-40 w-full rounded-xl" />
    <div className="mt-4 space-y-3">
      <div className="skeleton h-4 w-1/3 rounded-full" />
      <div className="skeleton h-5 w-3/4 rounded-full" />
      <div className="skeleton h-4 w-full rounded-full" />
      <div className="skeleton h-4 w-2/3 rounded-full" />
    </div>
  </div>
);

export default ArticleCardSkeleton;


