import { expoClient } from "@better-auth/expo/client";
import { env } from "@dropaly/env/native";
import { createAuthClient } from "better-auth/react";
import Constants from "expo-constants";
import * as SecureStore from "expo-secure-store";

function getAppScheme() {
  const scheme = Constants.expoConfig?.scheme;

  if (typeof scheme === "string") {
    return scheme;
  }

  if (Array.isArray(scheme) && typeof scheme[0] === "string") {
    return scheme[0];
  }

  throw new Error("Expo scheme is required for native auth.");
}

const appScheme = getAppScheme();

export const authClient = createAuthClient({
  baseURL: env.EXPO_PUBLIC_SERVER_URL,
  plugins: [
    expoClient({
      scheme: appScheme,
      storagePrefix: appScheme,
      storage: SecureStore,
    }),
  ],
});
