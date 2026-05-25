import { useAppTheme } from "@/contexts/app-theme-context";

const LIGHT_THEME_COLORS = {
  background: "#ffffff",
  foreground: "#28251f",
  card: "#ffffff",
  primary: "#268c52",
  primaryForeground: "#effdf4",
  muted: "#f2f1ee",
  mutedForeground: "#888176",
  accent: "#f2f1ee",
  accentForeground: "#39352d",
  destructive: "#e7000b",
  border: "#e4e2dc",
  success: "#16a34a",
} as const;

const DARK_THEME_COLORS = {
  background: "#28251f",
  foreground: "#faf9f6",
  card: "#39352d",
  primary: "#247a49",
  primaryForeground: "#effdf4",
  muted: "#474036",
  mutedForeground: "#b6afa4",
  accent: "#474036",
  accentForeground: "#faf9f6",
  destructive: "#ff6467",
  border: "#ffffff1a",
  success: "#22c55e",
} as const;

export function useThemeColors() {
  const { isDark } = useAppTheme();
  return isDark ? DARK_THEME_COLORS : LIGHT_THEME_COLORS;
}
