import Link from "next/link";
import { Article } from "@/types/article";

interface RelatedArticlesProps {
  items: Article[];
}

export const RelatedArticles = ({ items }: RelatedArticlesProps) => (
  <section className="rounded-2xl border border-border bg-surface p-5 shadow-soft">
    <p className="text-sm font-semibold text-text-muted uppercase tracking-[0.3em]">Related</p>
    <div className="mt-4 space-y-4">
      {items.map((item) => (
        <div key={item.id} className="space-y-1">
          <Link href={`/item/${item.id}`} className="font-medium text-text-primary hover:text-primary-600">
            {item.title}
          </Link>
          <p className="text-sm text-text-muted line-clamp-2">{item.shortSummary ?? item.summary}</p>
        </div>
      ))}
    </div>
  </section>
);

export default RelatedArticles;




