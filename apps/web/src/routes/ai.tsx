import { createFileRoute, redirect } from "@tanstack/react-router";

import { AiPage } from "@/features/ai";
import { authClient } from "@/lib/auth-client";

export const Route = createFileRoute("/ai")({
  beforeLoad: async () => {
    const session = await authClient.getSession();
    if (!session.data) {
      redirect({
        to: "/login",
        throw: true,
      });
    }
  },
  component: AiPage,
});
