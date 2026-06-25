import { IconLoader, IconTrash } from "@tabler/icons-react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import type { SubmitEvent } from "react";

import { Button } from "@dropaly/ui-web/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@dropaly/ui-web/components/card";
import { Checkbox } from "@dropaly/ui-web/components/checkbox";
import { Input } from "@dropaly/ui-web/components/input";

import { api } from "@/lib/api-queries";

export function TodosPage() {
  const [newTodoText, setNewTodoText] = useState("");

  const todos = useQuery(api.todos.queryOptions.list());
  const createTodo = useMutation(api.todos.mutationOptions.create());
  const updateTodo = useMutation(api.todos.mutationOptions.update());
  const deleteTodo = useMutation(api.todos.mutationOptions.delete());

  function handleAddTodo(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    if (newTodoText.trim()) {
      createTodo.mutate(
        { todoData: { text: newTodoText } },
        {
          onSuccess: () => {
            setNewTodoText("");
          },
        },
      );
    }
  }

  function handleToggleTodo(todoId: string, completed: boolean) {
    updateTodo.mutate({ todoId, todoData: { completed: !completed } });
  }

  function handleDeleteTodo(todoId: string) {
    deleteTodo.mutate({ todoId });
  }

  return (
    <div className="mx-auto w-full max-w-md py-10">
      <Card>
        <CardHeader>
          <CardTitle>Todo List</CardTitle>
          <CardDescription>Manage your tasks efficiently</CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={handleAddTodo}
            className="mb-6 flex items-center space-x-2"
          >
            <Input
              value={newTodoText}
              onChange={(e) => setNewTodoText(e.target.value)}
              placeholder="Add a new task..."
              disabled={createTodo.isPending}
            />
            <Button
              type="submit"
              disabled={createTodo.isPending || !newTodoText.trim()}
            >
              {createTodo.isPending ? (
                <IconLoader className="h-4 w-4 animate-spin" />
              ) : (
                "Add"
              )}
            </Button>
          </form>

          {todos.isLoading ? (
            <div className="flex justify-center py-4">
              <IconLoader className="h-6 w-6 animate-spin" />
            </div>
          ) : todos.data?.length === 0 ? (
            <p className="py-4 text-center">No todos yet. Add one above!</p>
          ) : (
            <ul className="space-y-2">
              {todos.data?.map((todo) => (
                <li
                  key={todo.id}
                  className="flex items-center justify-between rounded-md border p-2"
                >
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      checked={todo.completed}
                      onCheckedChange={() =>
                        handleToggleTodo(todo.id, todo.completed)
                      }
                      id={`todo-${todo.id}`}
                    />
                    <label
                      htmlFor={`todo-${todo.id}`}
                      className={todo.completed ? "line-through" : ""}
                    >
                      {todo.text}
                    </label>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteTodo(todo.id)}
                    aria-label="Delete todo"
                  >
                    <IconTrash className="h-4 w-4" />
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
