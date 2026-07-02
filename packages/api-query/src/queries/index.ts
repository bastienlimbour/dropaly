import type { ApiClient } from "@dropaly/api-client";

import { createHealthQueries } from "./health";
import { createPrivateDataQueries } from "./private-data";
import { createTodoQueries } from "./todos";

/** Query and mutation factories grouped by API domain. */
export interface ApiQueries {
  health: ReturnType<typeof createHealthQueries>;
  privateData: ReturnType<typeof createPrivateDataQueries>;
  todos: ReturnType<typeof createTodoQueries>;
}

/**
 * Creates TanStack Query option factories backed by a typed API client.
 *
 * The returned factories keep query keys colocated with their query options so
 * screens can import one object for reads, writes, and invalidation metadata.
 */
export function createApiQueries(apiClient: ApiClient): ApiQueries {
  return {
    health: createHealthQueries(apiClient),
    privateData: createPrivateDataQueries(apiClient),
    todos: createTodoQueries(apiClient),
  };
}

// We can inject the QueryClient here if we need it in the queries
// example : `createApiQueries(apiClient: ApiClient, queryClient: QueryClient)`
// and     : `health: createHealthQueries(apiClient, queryClient)`
