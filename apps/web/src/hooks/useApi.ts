import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useMemo } from "react";

export interface UseApiConfig<TData, TError = AxiosError> {
  key: UseQueryOptions<TData, TError>["queryKey"];
  queryFn: () => Promise<TData>;
  enabled?: boolean;
  staleTime?: number;
}

export const useApi = <TData, TError = AxiosError>({
  key,
  queryFn,
  enabled = true,
  staleTime = 60_000,
}: UseApiConfig<TData, TError>) => {
  const query = useQuery<TData, TError>({
    queryKey: key,
    queryFn,
    enabled,
    staleTime,
    retry: (failureCount, error: any) => {
      if (error?.response?.status === 404) {
        return false;
      }
      return failureCount < 2;
    },
  });

  return useMemo(
    () => ({
      data: query.data,
      isLoading: query.isLoading,
      isFetching: query.isFetching,
      error: query.error,
      refetch: query.refetch,
    }),
    [query.data, query.isLoading, query.isFetching, query.error, query.refetch]
  );
};

export default useApi;




