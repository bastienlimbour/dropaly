import type { Actor } from "../../context";
import {
  createTodoForUser,
  deleteTodoForUser,
  listTodosByUserId,
  type TodoRow,
  updateTodoCompletionForUser,
} from "./repository";
import type {
  CreateTodoInput,
  DeleteTodoInput,
  TodoDto,
  ToggleTodoInput,
} from "./schemas";

function toTodoDto(row: TodoRow): TodoDto {
  return { id: row.id, text: row.text, completed: row.completed };
}

export async function listTodos(actor: Actor): Promise<TodoDto[]> {
  const rows = await listTodosByUserId(actor.userId);

  return rows.map(toTodoDto);
}

export async function createTodo(
  actor: Actor,
  input: CreateTodoInput,
): Promise<TodoDto> {
  const row = await createTodoForUser({ userId: actor.userId, text: input.text });

  return toTodoDto(row);
}

export async function toggleTodo(
  actor: Actor,
  input: ToggleTodoInput,
): Promise<TodoDto | null> {
  const row = await updateTodoCompletionForUser({
    userId: actor.userId,
    id: input.id,
    completed: input.completed,
  });

  return row ? toTodoDto(row) : null;
}

export async function deleteTodo(
  actor: Actor,
  input: DeleteTodoInput,
): Promise<{ deleted: boolean }> {
  const deleted = await deleteTodoForUser({ userId: actor.userId, id: input.id });

  return { deleted };
}
