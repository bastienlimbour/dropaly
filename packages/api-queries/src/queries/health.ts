import { queryOptions as createQueryOptions } from "@tanstack/react-query";

import type { ApiClient } from "@dropaly/api-client";

export function createHealthQueries(apiClient: ApiClient) {
  const keys = {
    all: () => ["health"] as const,
  };

  const queries = {
    check: () =>
      createQueryOptions({
        queryKey: keys.all(),
        async queryFn() {
          const { data } = await apiClient.GET("/api/health");
          return data;
        },
      }),
  };

  return { queryKeys: keys, queryOptions: queries };
}
