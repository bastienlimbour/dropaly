import {
  MutationCache,
  QueryCache,
  QueryClient as TanStackQueryClient,
} from "@tanstack/react-query";
import type { QueryClientConfig } from "@tanstack/react-query";

import { toUserMessage } from "@dropaly/api-client";

import { invalidateQueriesAfterMutation } from "./invalidation";

interface QueryErrorNotification {
  message: string;
  retry: () => void;
}

interface MutationErrorNotification {
  message: string;
}

interface CreateQueryClientOptions {
  defaultOptions?: QueryClientConfig["defaultOptions"];
  notifyQueryError: (notification: QueryErrorNotification) => void;
  notifyMutationError: (notification: MutationErrorNotification) => void;
}

export function createQueryClient(
  options: CreateQueryClientOptions,
): TanStackQueryClient {
  const queryClient = new TanStackQueryClient({
    ...(options.defaultOptions ? { defaultOptions: options.defaultOptions } : {}),
    queryCache: new QueryCache({
      onError: (error, query) => {
        console.error("Query failed", { error, queryKey: query.queryKey });

        if (query.state.data === undefined) return;

        options.notifyQueryError({
          message: toUserMessage(error),
          retry: () => query.invalidate(),
        });
      },
    }),
    mutationCache: new MutationCache({
      onSuccess: (_data, _variables, _context, mutation): Promise<void> | void =>
        invalidateQueriesAfterMutation(queryClient, mutation),
      onError: (error) => {
        console.error("Mutation failed", { error });
        options.notifyMutationError({ message: toUserMessage(error) });
      },
    }),
  });

  return queryClient;
}
