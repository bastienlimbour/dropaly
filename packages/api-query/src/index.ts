import type { ApiClient } from "@dropaly/api-client";

import { createHealthQueries } from "./health";
import { createPrivateDataQueries } from "./private-data";
import { createTodoQueries } from "./todos";

export { invalidateQueriesAfterMutation } from "./mutation-invalidation";

// We can inject the QueryClient here if we need it in the queries
// example : `createApiQueries(apiClient: ApiClient, queryClient: QueryClient)`
// and     : `health: createHealthQueries(apiClient, queryClient)`

export function createApiQueries(apiClient: ApiClient) {
  return {
    health: createHealthQueries(apiClient),
    privateData: createPrivateDataQueries(apiClient),
    todos: createTodoQueries(apiClient),
  };
}
