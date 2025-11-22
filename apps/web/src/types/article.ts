export interface Article {
  id: string;
  title: string;
  body?: string;
  shortSummary?: string;
  longSummary?: string;
  summary?: string;
  category?: string;
  type?: string;
  tags?: string[];
  url?: string;
  imageUrl?: string;
  publishedAt?: string;
  source?: {
    name: string;
    trustLevel?: number;
    url?: string;
  };
}




