import { queryOptions } from "@tanstack/react-query";

import type { ApiClient } from "@dropaly/api-client";
import { throwApiError } from "@dropaly/api-client";

import { queryKeys } from "./query-keys";

export const privateDataQueries = {
  get: (api: ApiClient) =>
    queryOptions({
      queryKey: queryKeys.privateData(),
      async queryFn() {
        const { data, error, response } = await api.GET("/api/private-data");
        if (error) throwApiError(error, response);
        return data;
      },
    }),
};
