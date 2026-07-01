import { toast } from "sonner";

import { createQueryClient, createApiQueries } from "@dropaly/api-query";

import { apiClient } from "./api-client";

export const queryClient = createQueryClient({
  notifyQueryError: ({ message, retry }) => {
    toast.error(message, {
      action: { label: "Réessayer", onClick: retry },
    });
  },
  notifyMutationError: ({ message }) => {
    toast.error(message);
  },
});

export const api = createApiQueries(apiClient);
