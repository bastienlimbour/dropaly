import type { QueryClient } from "@tanstack/react-query";

import {
  todoMutations as sharedTodoMutations,
  todoQueries as sharedTodoQueries,
} from "@dropaly/api-query";

import { api } from "@/lib/api-client";

interface MutationCallbacks {
  onSuccess?: () => void;
}

export const todoQueries = { list: () => sharedTodoQueries.list(api) };

export const todoMutations = {
  create: (queryClient: QueryClient, callbacks?: MutationCallbacks) => ({
    ...sharedTodoMutations.create(api),
    onSuccess: () => {
      void queryClient.invalidateQueries(todoQueries.list());
      callbacks?.onSuccess?.();
    },
  }),

  update: (queryClient: QueryClient) => ({
    ...sharedTodoMutations.update(api),
    onSuccess: () => {
      void queryClient.invalidateQueries(todoQueries.list());
    },
  }),

  delete: (queryClient: QueryClient) => ({
    ...sharedTodoMutations.delete(api),
    onSuccess: () => {
      void queryClient.invalidateQueries(todoQueries.list());
    },
  }),
};
