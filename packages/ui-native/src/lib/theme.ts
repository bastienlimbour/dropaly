import { Uniwind, useCSSVariable, useUniwind } from "uniwind";

export type ResolvedTheme = "light" | "dark";
export type ThemePreference = ResolvedTheme | "system";

function setTheme(newTheme: ThemePreference) {
  Uniwind.setTheme(newTheme);
}

export function useUiTheme() {
  const { hasAdaptiveThemes, theme } = useUniwind();
  const resolvedTheme: ResolvedTheme = theme === "dark" ? "dark" : "light";
  const themePreference: ThemePreference = hasAdaptiveThemes
    ? "system"
    : resolvedTheme;

  return {
    resolvedTheme,
    themePreference,
    isDark: resolvedTheme === "dark",
    hasAdaptiveThemes,
    setTheme,
  };
}

function stringValue(value: string | number | undefined) {
  return value == null ? "" : String(value);
}

export type ThemeColors = ReturnType<typeof useThemeColors>;

export function useThemeColors() {
  const [
    background,
    foreground,
    card,
    border,
    destructive,
    primary,
    mutedForeground,
  ] = useCSSVariable([
    "--color-background",
    "--color-foreground",
    "--color-card",
    "--color-border",
    "--color-destructive",
    "--color-primary",
    "--color-muted-foreground",
  ]);

  return {
    background: stringValue(background),
    foreground: stringValue(foreground),
    card: stringValue(card),
    border: stringValue(border),
    destructive: stringValue(destructive),
    primary: stringValue(primary),
    mutedForeground: stringValue(mutedForeground),
  };
}
