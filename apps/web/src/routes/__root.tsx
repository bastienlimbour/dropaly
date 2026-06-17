import type { QueryClient } from "@tanstack/react-query";
import type { ErrorComponentProps } from "@tanstack/react-router";
import {
  HeadContent,
  Outlet,
  createRootRouteWithContext,
  useRouter,
} from "@tanstack/react-router";
import { lazy, Suspense } from "react";

import { toUserMessage } from "@dropaly/api-client";
import { Button } from "@dropaly/ui-web/components/button";
import { Toaster } from "@dropaly/ui-web/components/sonner";

import Header from "@/components/header";
import { ThemeProvider } from "@/components/theme-provider";

import "@/styles/index.css";

const ReactQueryDevtools = import.meta.env.DEV
  ? lazy(() =>
      import("@tanstack/react-query-devtools").then(
        ({ ReactQueryDevtools: Devtools }) => ({ default: Devtools }),
      ),
    )
  : null;

const TanStackRouterDevtools = import.meta.env.DEV
  ? lazy(() =>
      import("@tanstack/react-router-devtools").then(
        ({ TanStackRouterDevtools: Devtools }) => ({ default: Devtools }),
      ),
    )
  : null;

export interface RouterAppContext {
  queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<RouterAppContext>()({
  component: RootComponent,
  errorComponent: RootErrorComponent,
  notFoundComponent: RootNotFoundComponent,
  head: () => ({
    meta: [
      { title: "Dropaly" },
      {
        name: "description",
        content:
          "Dropaly is an app for capturing and structuring thoughts into tasks, lists, and notes.",
      },
    ],
    links: [{ rel: "icon", href: "/favicon.ico" }],
  }),
});

function RootComponent() {
  return (
    <>
      <HeadContent />
      <ThemeProvider
        attribute="class"
        defaultTheme="dark"
        disableTransitionOnChange
        storageKey="vite-ui-theme"
      >
        <div className="grid h-svh grid-rows-[auto_1fr]">
          <Header />
          <Outlet />
        </div>
        <Toaster richColors />
      </ThemeProvider>
      {TanStackRouterDevtools ? (
        <Suspense fallback={null}>
          <TanStackRouterDevtools position="bottom-left" />
        </Suspense>
      ) : null}
      {ReactQueryDevtools ? (
        <Suspense fallback={null}>
          <ReactQueryDevtools position="bottom" buttonPosition="bottom-right" />
        </Suspense>
      ) : null}
    </>
  );
}

function RootErrorComponent({ error, reset }: ErrorComponentProps) {
  const router = useRouter();

  return (
    <div className="flex min-h-svh items-center justify-center p-6">
      <div className="w-full max-w-md rounded-lg border bg-card p-6 text-center shadow-sm">
        <h1 className="text-xl font-semibold">Une erreur est survenue</h1>
        <p className="mt-2 text-sm text-muted-foreground">{toUserMessage(error)}</p>
        <Button
          className="mt-6"
          onClick={() => {
            reset();
            void router.invalidate();
          }}
        >
          Réessayer
        </Button>
      </div>
    </div>
  );
}

function RootNotFoundComponent() {
  return (
    <div className="flex min-h-svh items-center justify-center p-6">
      <div className="w-full max-w-md rounded-lg border bg-card p-6 text-center shadow-sm">
        <h1 className="text-xl font-semibold">Page introuvable</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          La page demandée n'existe pas ou n'est plus disponible.
        </p>
      </div>
    </div>
  );
}
