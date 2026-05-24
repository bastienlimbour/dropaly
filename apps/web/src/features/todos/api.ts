import type { QueryClient } from "@tanstack/react-query";

import { trpc } from "@/lib/trpc-client";

interface MutationCallbacks {
  onSuccess?: () => void;
}

export const todoQueries = {
  list: () => trpc.todos.list.queryOptions(),
};

export const todoMutations = {
  create: (queryClient: QueryClient, callbacks?: MutationCallbacks) =>
    trpc.todos.create.mutationOptions({
      onSuccess: () => {
        void queryClient.invalidateQueries(todoQueries.list());
        callbacks?.onSuccess?.();
      },
    }),

  toggle: (queryClient: QueryClient) =>
    trpc.todos.toggle.mutationOptions({
      onSuccess: () => {
        void queryClient.invalidateQueries(todoQueries.list());
      },
    }),

  delete: (queryClient: QueryClient) =>
    trpc.todos.delete.mutationOptions({
      onSuccess: () => {
        void queryClient.invalidateQueries(todoQueries.list());
      },
    }),
};
