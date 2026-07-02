import { matchQuery } from "@tanstack/react-query";
import type { QueryClient, QueryKey } from "@tanstack/react-query";

/**
 * Mutation metadata used by the shared QueryClient to invalidate queries.
 *
 * `invalidates` defaults to `"all"`. Use query keys to limit invalidation to a
 * subset, or `awaits` when the mutation should not settle until specific query
 * invalidations have completed.
 */
export interface MutationInvalidationMeta {
  invalidates?: "all" | readonly QueryKey[];
  awaits?: readonly QueryKey[];
}

declare module "@tanstack/react-query" {
  interface Register {
    mutationMeta: MutationInvalidationMeta;
  }
}

interface MutationWithInvalidationMeta {
  meta?: Record<string, unknown> | undefined;
  options?: { meta?: Record<string, unknown> | undefined } | undefined;
}

/** Applies Dropaly's mutation invalidation convention to a completed mutation. */
export function invalidateQueriesAfterMutation(
  queryClient: QueryClient,
  mutation: MutationWithInvalidationMeta,
): Promise<void> | void {
  const meta = (mutation.meta ?? mutation.options?.meta) as
    | MutationInvalidationMeta
    | undefined;
  const invalidates = meta?.invalidates ?? "all";
  const awaits = meta?.awaits ?? [];

  if (invalidates === "all") {
    void queryClient.invalidateQueries();
  } else if (invalidates.length > 0) {
    void queryClient.invalidateQueries({
      predicate: (query) =>
        invalidates.some((queryKey) => matchQuery({ queryKey }, query)),
    });
  }

  if (awaits.length === 0) return;

  return Promise.all(
    awaits.map((queryKey) =>
      queryClient.invalidateQueries({ queryKey }, { cancelRefetch: false }),
    ),
  ).then(() => undefined);
}
