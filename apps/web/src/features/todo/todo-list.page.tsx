import { IconLoader, IconTrash } from "@tabler/icons-react";
import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { Suspense, useState } from "react";
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

import { api } from "@/lib/query-client";

export function TodosPage() {
  const [newTodoText, setNewTodoText] = useState("");

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

          <Suspense fallback={<TodoListSkeleton />}>
            <TodoList
              onToggleTodo={handleToggleTodo}
              onDeleteTodo={handleDeleteTodo}
            />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  );
}

interface TodoListProps {
  onToggleTodo: (todoId: string, completed: boolean) => void;
  onDeleteTodo: (todoId: string) => void;
}

function TodoList({ onToggleTodo, onDeleteTodo }: TodoListProps) {
  const { data: todos } = useSuspenseQuery(api.todos.queryOptions.list());

  if (todos.length === 0) {
    return <p className="py-4 text-center">No todos yet. Add one above!</p>;
  }

  return (
    <ul className="space-y-2">
      {todos.map((todo) => (
        <li
          key={todo.id}
          className="flex items-center justify-between rounded-md border p-2"
        >
          <div className="flex items-center space-x-2">
            <Checkbox
              checked={todo.completed}
              onCheckedChange={() => onToggleTodo(todo.id, todo.completed)}
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
            onClick={() => onDeleteTodo(todo.id)}
            aria-label="Delete todo"
          >
            <IconTrash className="h-4 w-4" />
          </Button>
        </li>
      ))}
    </ul>
  );
}

const todoSkeletonRows = [1, 2, 3];

export function TodoListSkeleton() {
  return (
    <ul className="space-y-2" aria-label="Loading todos">
      {todoSkeletonRows.map((row) => (
        <li
          key={row}
          className="flex items-center justify-between rounded-md border p-2"
        >
          <div className="flex items-center space-x-2">
            <div className="h-4 w-4 animate-pulse rounded-sm bg-muted" />
            <div className="h-4 w-32 animate-pulse rounded bg-muted" />
          </div>
          <div className="h-8 w-8 animate-pulse rounded-md bg-muted" />
        </li>
      ))}
    </ul>
  );
}
