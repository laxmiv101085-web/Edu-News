import Link from "next/link";

export default function ArticleCard({ article }: { article: any }) {
  const published = article.publishedAt?new Date(article.publishedAt):null;
  const tagClass = article.category === "exam" ? "tag-exam" :
                   article.category === "scholarship" ? "tag-scholar" : "tag-result";

  return (
    <article className="article-card p-4 mb-4 rounded-xl">
      <div className="flex justify-between items-start gap-3">
        <div>
          <h3 className="font-semibold text-lg"><Link href={`/item/${article.id}`}>{article.title}</Link></h3>
          <p className="text-sm mt-2 text-slate-600 line-clamp-2">{article.summary}</p>
        </div>
        <div className="text-right">
          <div className={`kicker ${tagClass}`}>{article.category}</div>
          <div className="text-xs text-slate-500 mt-2">{published?published.toISOString().split("T")[0]:"-"}</div>
        </div>
      </div>
    </article>
  )
}

