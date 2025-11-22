import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const STORAGE_KEY = "educational-app-bookmarks";

const readBookmarks = (): string[] => {
  if (typeof window === "undefined") return [];
  try {
    const value = window.localStorage.getItem(STORAGE_KEY);
    return value ? JSON.parse(value) : [];
  } catch {
    return [];
  }
};

const writeBookmarks = (bookmarks: string[]) => {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(bookmarks));
};

export const useBookmarks = () => {
  const queryClient = useQueryClient();

  const { data: bookmarks = [] } = useQuery({
    queryKey: ["bookmarks"],
    queryFn: async () => readBookmarks(),
  });

  const mutation = useMutation({
    mutationFn: async (id: string) => {
      const next = bookmarks.includes(id) ? bookmarks.filter((value) => value !== id) : [...bookmarks, id];
      writeBookmarks(next);
      return next;
    },
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ["bookmarks"] });
      const previous = queryClient.getQueryData<string[]>(["bookmarks"]);
      const next = previous?.includes(id) ? previous.filter((value) => value !== id) : [...(previous ?? []), id];
      queryClient.setQueryData(["bookmarks"], next);
      return { previous };
    },
    onError: (_error, _variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(["bookmarks"], context.previous);
      }
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["bookmarks"], data);
    },
  });

  const isBookmarked = (id: string) => bookmarks.includes(id);

  return {
    bookmarks,
    toggleBookmark: mutation.mutateAsync,
    isBookmarked,
    isPending: mutation.isPending,
  };
};

export default useBookmarks;




