import { createQueryClient, createApiQueries } from "@dropaly/api-query";

import { apiClient } from "./api-client";
import { showToast } from "./toast";

export const queryClient = createQueryClient({
  defaultOptions: {
    queries: { staleTime: 30_000, retry: 1, refetchOnWindowFocus: false },
  },
  notifyQueryError: ({ message }) => {
    showToast({ variant: "danger", label: message });
  },
  notifyMutationError: ({ message }) => {
    showToast({ variant: "danger", label: message });
  },
});

export const api = createApiQueries(apiClient);
