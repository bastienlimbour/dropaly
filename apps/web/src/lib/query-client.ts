import { MutationCache, QueryCache, QueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { toUserMessage } from "@dropaly/api-client";

export const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error, query) => {
      console.error("Query failed", { error, queryKey: query.queryKey });

      if (query.state.data === undefined) return;

      toast.error(toUserMessage(error), {
        action: { label: "Réessayer", onClick: () => query.invalidate() },
      });
    },
  }),
  mutationCache: new MutationCache({
    onError: (error) => {
      console.error("Mutation failed", { error });
      toast.error(toUserMessage(error));
    },
  }),
});
