import {
  MutationCache,
  QueryCache,
  QueryClient as TanStackQueryClient,
} from "@tanstack/react-query";
import type { QueryClientConfig } from "@tanstack/react-query";

import { toUserMessage } from "@dropaly/api-client";

import { invalidateQueriesAfterMutation } from "./invalidation";

/** Notification emitted when a background query with existing data fails. */
export interface QueryErrorNotification {
  message: string;
  retry: () => void;
}

/** Notification emitted when a mutation fails. */
export interface MutationErrorNotification {
  message: string;
}

/** Options used to create Dropaly's TanStack Query client. */
export interface CreateQueryClientOptions {
  /** Optional defaults forwarded to TanStack Query. */
  defaultOptions?: QueryClientConfig["defaultOptions"];
  /** Called for failed background refetches only, so initial loading errors stay local to queries. */
  notifyQueryError: (notification: QueryErrorNotification) => void;
  /** Called for failed mutations after the error has been logged. */
  notifyMutationError: (notification: MutationErrorNotification) => void;
}

/**
 * Creates the shared TanStack Query client used by Dropaly apps.
 *
 * Query errors are logged and only shown through `notifyQueryError` when stale
 * data already exists. Mutation errors are logged and passed to
 * `notifyMutationError`. Successful mutations use mutation metadata to invalidate
 * related queries automatically.
 */
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
