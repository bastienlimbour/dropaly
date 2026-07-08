import { queryOptions } from "@tanstack/react-query";

import type { ApiClient } from "@dropaly/api-client";

export const healthQueryKeys = {
  all: () => ["health"] as const,
};

export function createHealthQueries(apiClient: ApiClient) {
  const healthQueryOptions = {
    check: () =>
      queryOptions({
        queryKey: healthQueryKeys.all(),
        async queryFn() {
          const { data } = await apiClient.GET("/api/health");
          return data;
        },
      }),
  };

  return { queryKeys: healthQueryKeys, queryOptions: healthQueryOptions };
}
