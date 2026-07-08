import { queryOptions } from "@tanstack/react-query";

import type { ApiClient } from "@dropaly/api-client";

export const privateDataQueryKeys = {
  all: () => ["private-data"] as const,
};

export function createPrivateDataQueries(apiClient: ApiClient) {
  const privateDataQueryOptions = {
    get: () =>
      queryOptions({
        queryKey: privateDataQueryKeys.all(),
        async queryFn() {
          const { data, error } = await apiClient.GET("/api/private-data");
          if (error) throw error;
          return data;
        },
      }),
  };

  return { queryKeys: privateDataQueryKeys, queryOptions: privateDataQueryOptions };
}
