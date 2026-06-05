import { mutationOptions, queryOptions } from "@tanstack/react-query";

import type { ApiClient } from "@dropaly/api-client";
import { throwApiError } from "@dropaly/api-client";
import type { CreateTodoInput, UpdateTodoInput } from "@dropaly/api-client/schema";

import { queryKeys } from "./query-keys";

export const todoQueries = {
  list: (api: ApiClient) =>
    queryOptions({
      queryKey: queryKeys.todos.all(),
      async queryFn() {
        const { data, error, response } = await api.GET("/api/todos");
        if (error) throwApiError(error, response);
        return data;
      },
    }),
};

export const todoMutations = {
  create: (api: ApiClient) =>
    mutationOptions({
      async mutationFn(input: { data: CreateTodoInput }) {
        const { data, error, response } = await api.POST("/api/todos", {
          body: input.data,
        });
        if (error) throwApiError(error, response);
        return data;
      },
    }),

  update: (api: ApiClient) =>
    mutationOptions({
      async mutationFn(input: { id: string; data: UpdateTodoInput }) {
        const { data, error, response } = await api.PATCH("/api/todos/{id}", {
          params: { path: { id: input.id } },
          body: input.data,
        });
        if (error) throwApiError(error, response);
        return data;
      },
    }),

  delete: (api: ApiClient) =>
    mutationOptions({
      async mutationFn(input: { id: string }) {
        const { data, error, response } = await api.DELETE("/api/todos/{id}", {
          params: { path: { id: input.id } },
        });
        if (error) throwApiError(error, response);
        return data;
      },
    }),
};
