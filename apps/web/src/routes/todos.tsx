import { createFileRoute, redirect } from "@tanstack/react-router";

import { TodosPage, todoQueries } from "@/features/todos";
import { authClient } from "@/lib/auth-client";

export const Route = createFileRoute("/todos")({
  beforeLoad: async () => {
    const session = await authClient.getSession();
    if (!session.data) {
      redirect({ to: "/login", throw: true });
    }
  },
  loader: async ({ context }) => {
    await context.queryClient.ensureQueryData(todoQueries.list());
  },
  component: TodosPage,
});
