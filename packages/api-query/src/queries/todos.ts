import { mutationOptions, queryOptions } from "@tanstack/react-query";

import type { ApiClient } from "@dropaly/api-client";
import type {
  CreateTodoInput,
  Todo,
  UpdateTodoInput,
} from "@dropaly/api-client/types";

export const todoQueryKeys = {
  all: () => ["todos"] as const,
  lists: () => [...todoQueryKeys.all(), "list"] as const,
  list: () => [...todoQueryKeys.lists()] as const,
};

export function createTodoQueries(apiClient: ApiClient) {
  const todoQueryOptions = {
    list: () =>
      queryOptions({
        queryKey: todoQueryKeys.list(),
        async queryFn() {
          const { data, error } = await apiClient.GET("/api/todos");
          if (error) throw error;
          return data;
        },
      }),
  };

  const todoMutationOptions = {
    create: () =>
      mutationOptions({
        meta: { invalidates: [todoQueryKeys.lists()] },
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
        meta: { invalidates: [todoQueryKeys.lists()] },
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
        meta: { invalidates: [todoQueryKeys.lists()] },
        async mutationFn(args: { todoId: Todo["id"] }) {
          const { data, error } = await apiClient.DELETE("/api/todos/{id}", {
            params: { path: { id: args.todoId } },
          });
          if (error) throw error;
          return data;
        },
      }),
  };

  return {
    queryKeys: todoQueryKeys,
    queryOptions: todoQueryOptions,
    mutationOptions: todoMutationOptions,
  };
}
