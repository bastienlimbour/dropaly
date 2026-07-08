import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Suspense } from "react";

import { api } from "@/lib/query-client";

export const Route = createFileRoute("/")({
  loader: ({ context }) => {
    void context.queryClient.prefetchQuery(api.health.queryOptions.check());
  },
  component: HomeComponent,
});

function HomeComponent() {
  return (
    <div className="container mx-auto max-w-3xl px-4 py-2">
      <pre className="overflow-x-auto font-mono text-sm">Dropaly homepage</pre>
      <div className="grid gap-6">
        <Suspense fallback={<ApiStatusSkeleton />}>
          <ApiStatus />
        </Suspense>
      </div>
    </div>
  );
}

function ApiStatus() {
  const { data: healthCheck } = useSuspenseQuery(api.health.queryOptions.check());

  return (
    <section className="rounded-lg border p-4">
      <h2 className="mb-2 font-medium">API Status</h2>
      <div className="flex items-center gap-2">
        <div
          className={`h-2 w-2 rounded-full ${healthCheck ? "bg-success" : "bg-destructive"}`}
        />
        <span className="text-sm text-muted-foreground">
          {healthCheck ? "Connected" : "Disconnected"}
        </span>
      </div>
    </section>
  );
}

export function ApiStatusSkeleton() {
  return (
    <section className="rounded-lg border p-4" aria-label="Checking API status">
      <h2 className="mb-2 font-medium">API Status</h2>
      <div className="flex items-center gap-2">
        <div className="h-2 w-2 animate-pulse rounded-full bg-muted" />
        <div className="h-4 w-20 animate-pulse rounded bg-muted" />
      </div>
    </section>
  );
}
