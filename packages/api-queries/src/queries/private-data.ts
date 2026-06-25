import { queryOptions as createQueryOptions } from "@tanstack/react-query";

import type { ApiClient } from "@dropaly/api-client";

export function createPrivateDataQueries(apiClient: ApiClient) {
  const keys = {
    all: () => ["private-data"] as const,
  };

  const queries = {
    get: () =>
      createQueryOptions({
        queryKey: keys.all(),
        async queryFn() {
          const { data, error } = await apiClient.GET("/api/private-data");
          if (error) throw error;
          return data;
        },
      }),
  };

  return { queryKeys: keys, queryOptions: queries };
}
