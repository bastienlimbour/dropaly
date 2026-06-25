import { mutationOptions, queryOptions } from "@tanstack/react-query";

import type { ApiClient } from "@dropaly/api-client";
import type { CreateTodoInput, UpdateTodoInput } from "@dropaly/api-client/schema";

export function createTodoQueries(apiClient: ApiClient) {
  const keys = {
    all: () => ["todos"] as const,
    lists: () => [...keys.all(), "list"] as const,
    list: () => [...keys.lists()] as const,
  };

  const queries = {
    all: keys.all,
    lists: keys.lists,
    list: () =>
      queryOptions({
        queryKey: keys.list(),
        async queryFn() {
          const { data, error } = await apiClient.GET("/api/todos");
          if (error) throw error;
          return data;
        },
      }),
  };

  const mutations = {
    create: () =>
      mutationOptions({
        meta: { invalidates: [queries.lists()] },
        async mutationFn(input: { data: CreateTodoInput }) {
          const { data, error } = await apiClient.POST("/api/todos", {
            body: input.data,
          });
          if (error) throw error;
          return data;
        },
      }),

    update: () =>
      mutationOptions({
        meta: { invalidates: [queries.lists()] },
        async mutationFn(input: { id: string; data: UpdateTodoInput }) {
          const { data, error } = await apiClient.PATCH("/api/todos/{id}", {
            params: { path: { id: input.id } },
            body: input.data,
          });
          if (error) throw error;
          return data;
        },
      }),

    delete: () =>
      mutationOptions({
        meta: { invalidates: [queries.lists()] },
        async mutationFn(input: { id: string }) {
          const { data, error } = await apiClient.DELETE("/api/todos/{id}", {
            params: { path: { id: input.id } },
          });
          if (error) throw error;
          return data;
        },
      }),
  };

  return { queries, mutations };
}
