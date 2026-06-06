import { useQuery } from "@tanstack/react-query";
import { createFileRoute, redirect } from "@tanstack/react-router";

import { privateDataQueries } from "@dropaly/api-query";
import { Button } from "@dropaly/ui-web/components/button";

import { env } from "@/env";
import { api } from "@/lib/api-client";
import { authClient } from "@/lib/auth-client";

export const Route = createFileRoute("/dashboard")({
  component: RouteComponent,
  beforeLoad: async () => {
    const session = await authClient.getSession();
    if (!session.data) {
      redirect({ to: "/login", throw: true });
    }
    const customerState = env.VITE_PAYMENTS_ENABLED
      ? (await authClient.customer.state()).data
      : null;
    return { session, customerState };
  },
});

function RouteComponent() {
  const { session, customerState } = Route.useRouteContext();

  const privateData = useQuery(privateDataQueries.get(api));

  const hasProSubscription = (customerState?.activeSubscriptions ?? []).length > 0;

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Welcome {session.data?.user.name}</p>
      <p>API: {privateData.data?.message}</p>
      {env.VITE_PAYMENTS_ENABLED && (
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
