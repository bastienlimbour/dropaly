import { QueryClient } from "@tanstack/react-query";
import { createTRPCClient, httpBatchLink } from "@trpc/client";
import { createTRPCOptionsProxy } from "@trpc/tanstack-react-query";
import { fetch as expoFetch } from "expo/fetch";

import type { AppRouter } from "@dropaly/api";
import { env } from "@dropaly/env/native";

import { authClient } from "@/lib/auth-client";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 30_000, retry: 1, refetchOnWindowFocus: false },
    mutations: { retry: 1 },
  },
});

const trpcClient = createTRPCClient<AppRouter>({
  links: [
    httpBatchLink({
      url: `${env.EXPO_PUBLIC_SERVER_URL}/trpc`,
      fetch(url, options) {
        return expoFetch(url, {
          ...options,
          signal: options?.signal ?? null,
          // Better Auth Expo forwards the session cookie manually on native.
          credentials: "omit",
        }) as ReturnType<typeof globalThis.fetch>;
      },
      headers() {
        const headers = new Map<string, string>();
        const cookies = authClient.getCookie();
        if (cookies) {
          headers.set("Cookie", cookies);
        }
        return Object.fromEntries(headers);
      },
    }),
  ],
});

export const trpc = createTRPCOptionsProxy<AppRouter>({
  client: trpcClient,
  queryClient,
});
