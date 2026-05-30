import type { QueryClient } from "@tanstack/react-query";
import {
  HeadContent,
  Outlet,
  createRootRouteWithContext,
} from "@tanstack/react-router";
import { lazy, Suspense } from "react";

import { Toaster } from "@dropaly/ui-web/components/sonner";

import Header from "@/components/header";
import { ThemeProvider } from "@/components/theme-provider";
import type { trpc } from "@/lib/trpc-client";

import "../index.css";

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
  trpc: typeof trpc;
  queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<RouterAppContext>()({
  component: RootComponent,
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
