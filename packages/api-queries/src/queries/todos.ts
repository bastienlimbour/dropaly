import { mutationOptions, queryOptions } from "@tanstack/react-query";

import type { ApiClient } from "@dropaly/api-client";
import type {
  CreateTodoInput,
  Todo,
  UpdateTodoInput,
} from "@dropaly/api-client/schema";

export function createTodoQueries(apiClient: ApiClient) {
  const keys = {
    all: () => ["todos"] as const,
    lists: () => [...keys.all(), "list"] as const,
    list: () => [...keys.lists()] as const,
  };

  const queries = {
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
        meta: { invalidates: [keys.lists()] },
        async mutationFn(args: { todoData: CreateTodoInput }) {
          const { data, error } = await apiClient.POST("/api/todos", {
            body: args.todoData,
          });
          if (error) throw error;
          return data;
        },
      }),

    update: () =>
      mutationOptions({
        meta: { invalidates: [keys.lists()] },
        async mutationFn(args: { todoId: Todo["id"]; todoData: UpdateTodoInput }) {
          const { data, error } = await apiClient.PATCH("/api/todos/{id}", {
            params: { path: { id: args.todoId } },
            body: args.todoData,
          });
          if (error) throw error;
          return data;
        },
      }),

    delete: () =>
      mutationOptions({
        meta: { invalidates: [keys.lists()] },
        async mutationFn(args: { todoId: Todo["id"] }) {
          const { data, error } = await apiClient.DELETE("/api/todos/{id}", {
            params: { path: { id: args.todoId } },
          });
          if (error) throw error;
          return data;
        },
      }),
  };

  return { queryKeys: keys, queryOptions: queries, mutationOptions: mutations };
}
