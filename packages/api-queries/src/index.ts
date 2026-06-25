import type { ApiClient } from "@dropaly/api-client";

import { createHealthQueries } from "./queries/health";
import { createPrivateDataQueries } from "./queries/private-data";
import { createTodoQueries } from "./queries/todos";

export { invalidateQueriesAfterMutation } from "./lib/mutation-invalidation";

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
