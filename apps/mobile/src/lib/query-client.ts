import { MutationCache, QueryCache, QueryClient } from "@tanstack/react-query";

import { toUserMessage } from "@dropaly/api-client";

import { showToast } from "./toast";

export const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error, query) => {
      console.error("Query failed", { error, queryKey: query.queryKey });

      if (query.state.data === undefined) return;

      showToast({ variant: "danger", label: toUserMessage(error) });
    },
  }),
  mutationCache: new MutationCache({
    onError: (error) => {
      console.error("Mutation failed", { error });
      showToast({ variant: "danger", label: toUserMessage(error) });
    },
  }),
  defaultOptions: {
    queries: { staleTime: 30_000, retry: 1, refetchOnWindowFocus: false },
  },
});
