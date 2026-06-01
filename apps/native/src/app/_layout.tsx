import { PortalHost } from "@rn-primitives/portal";
import { QueryClientProvider } from "@tanstack/react-query";
import { Stack, ThemeProvider } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Toaster } from "sonner-native";

import { useThemeColors, useUiTheme } from "@dropaly/ui-native/lib/theme";

import { useNavigationTheme } from "@/lib/theme";
import { queryClient } from "@/lib/trpc-client";
import { installPolyfills } from "@/polyfills";

import "@/index.css";

installPolyfills();

export const unstable_settings = { initialRouteName: "(tabs)" };

function App() {
  const { resolvedTheme } = useUiTheme();
  const colors = useThemeColors();
  const navigationTheme = useNavigationTheme({ resolvedTheme, colors });

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: colors.background }}>
      <KeyboardProvider>
        <ThemeProvider value={navigationTheme}>
          <StatusBar style={resolvedTheme === "dark" ? "light" : "dark"} />
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(tabs)" />
            <Stack.Screen
              name="modal"
              options={{
                title: "Modal",
                presentation: "formSheet",
                headerShown: true,
              }}
            />
          </Stack>
          <PortalHost />
          <Toaster richColors theme={resolvedTheme === "dark" ? "dark" : "light"} />
        </ThemeProvider>
      </KeyboardProvider>
    </GestureHandlerRootView>
  );
}

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider>
        <App />
      </SafeAreaProvider>
    </QueryClientProvider>
  );
}
