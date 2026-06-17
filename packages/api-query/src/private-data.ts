import { queryOptions } from "@tanstack/react-query";

import type { ApiClient } from "@dropaly/api-client";

import { queryKeys } from "./query-keys";

export const privateDataQueries = {
  get: (api: ApiClient) =>
    queryOptions({
      queryKey: queryKeys.privateData(),
      async queryFn() {
        const { data, error } = await api.GET("/api/private-data");
        if (error) throw error;
        return data;
      },
    }),
};
