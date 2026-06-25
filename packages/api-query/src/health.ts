import { queryOptions } from "@tanstack/react-query";

import type { ApiClient } from "@dropaly/api-client";

export function createHealthQueries(apiClient: ApiClient) {
  const keys = {
    all: () => ["health"] as const,
  };

  return {
    all: keys.all,
    check: () =>
      queryOptions({
        queryKey: keys.all(),
        async queryFn() {
          const { data } = await apiClient.GET("/api/health");
          return data;
        },
      }),
  };
}
