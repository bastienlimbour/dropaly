import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { Suspense } from "react";

import { Button } from "@dropaly/ui-web/components/button";

import { env } from "@/env";
import { authClient } from "@/lib/auth-client";
import { api } from "@/lib/query-client";

export const Route = createFileRoute("/dashboard")({
  component: RouteComponent,
  beforeLoad: async () => {
    const session = await authClient.getSession();
    if (!session.data) {
      redirect({ to: "/login", throw: true });
    }
    const customerState = env.VITE_PAYMENT_ENABLED
      ? (await authClient.customer.state()).data
      : null;
    return { session, customerState };
  },
  loader: ({ context }) => {
    void context.queryClient.prefetchQuery(api.privateData.queryOptions.get());
  },
});

function RouteComponent() {
  const { session, customerState } = Route.useRouteContext();

  const hasProSubscription = (customerState?.activeSubscriptions ?? []).length > 0;

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Welcome {session.data?.user.name}</p>
      <Suspense fallback={<PrivateDataStatusSkeleton />}>
        <PrivateDataStatus />
      </Suspense>
      {env.VITE_PAYMENT_ENABLED && (
        <>
          <p>Plan: {hasProSubscription ? "Pro" : "Free"}</p>
          {hasProSubscription ? (
            <Button onClick={async () => await authClient.customer.portal()}>
              Manage Subscription
            </Button>
          ) : (
            <Button onClick={async () => await authClient.checkout({ slug: "pro" })}>
              Upgrade to Pro
            </Button>
          )}
        </>
      )}
    </div>
  );
}

function PrivateDataStatus() {
  const { data: privateData } = useSuspenseQuery(api.privateData.queryOptions.get());

  return <p>API: {privateData.message}</p>;
}

export function PrivateDataStatusSkeleton() {
  return <p className="h-6 w-32 animate-pulse rounded bg-muted" />;
}
