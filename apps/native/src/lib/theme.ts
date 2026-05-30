import { DarkTheme, DefaultTheme } from "expo-router";

import {
  useThemeColors,
  type ThemeColors,
  type ResolvedTheme,
} from "@dropaly/ui-native/lib/theme";

export function useNavigationTheme({
  resolvedTheme,
  colors,
}: {
  resolvedTheme: ResolvedTheme;
  colors: ThemeColors;
}) {
  const baseTheme = resolvedTheme === "dark" ? DarkTheme : DefaultTheme;

  return {
    ...baseTheme,
    colors: {
      ...baseTheme.colors,
      background: colors.background,
      border: colors.border,
      card: colors.background,
      notification: colors.destructive,
      primary: colors.primary,
      text: colors.foreground,
    },
  };
}

export function useThemedHeaderOptions() {
  const colors = useThemeColors();

  return {
    headerLargeStyle: { backgroundColor: "transparent" },
    headerLargeTitleStyle: { color: colors.foreground },
    headerStyle: { backgroundColor: colors.background },
    headerTitleStyle: { color: colors.foreground },
    headerTintColor: colors.foreground,
  };
}
