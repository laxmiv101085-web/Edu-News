import api from "./client";
import { Article } from "@/types/article";

export const fetchArticle = async (id: string) => {
  const { data } = await api.get<Article>(`/feed/items/${id}`);
  return data;
};

export const fetchArticles = async (params: Record<string, string | number | undefined> = {}) => {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== "") {
      searchParams.set(key, String(value));
    }
  });
  const { data } = await api.get<{ items: Article[] }>(`/feed?${searchParams.toString()}`);
  return data.items ?? [];
};


