import { queryOptions } from "@tanstack/react-query";

import type { ApiClient } from "@dropaly/api-client";
import { throwApiError } from "@dropaly/api-client";

import { queryKeys } from "./query-keys";

export const healthQueries = {
  check: (api: ApiClient) =>
    queryOptions({
      queryKey: queryKeys.health(),
      async queryFn() {
        const { data, error, response } = await api.GET("/api/health");
        if (error) throwApiError(error, response);
        return data ?? "OK";
      },
    }),
};
