import { matchQuery } from "@tanstack/react-query";
import type { QueryClient, QueryKey } from "@tanstack/react-query";

interface MutationInvalidationMeta {
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
