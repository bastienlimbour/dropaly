import { Uniwind, useCSSVariable, useUniwind } from "uniwind";

/** Theme currently resolved by Uniwind after applying system preferences. */
export type ResolvedTheme = "light" | "dark";

/** Theme preference persisted through Uniwind. */
export type ThemePreference = ResolvedTheme | "system";

/** Theme state and actions exposed to mobile UI components. */
export interface UiTheme {
  resolvedTheme: ResolvedTheme;
  themePreference: ThemePreference;
  isDark: boolean;
  hasAdaptiveThemes: boolean;
  setTheme: (newTheme: ThemePreference) => void;
}

function setTheme(newTheme: ThemePreference): void {
  Uniwind.setTheme(newTheme);
}

/**
 * Reads and updates the mobile UI theme.
 *
 * `themePreference` is `"system"` when adaptive themes are active. `resolvedTheme`
 * always reflects the concrete theme currently applied to the UI.
 */
export function useUiTheme(): UiTheme {
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

function stringValue(value: string | number | undefined): string {
  return value == null ? "" : String(value);
}

/** CSS variable colors resolved for native integrations. */
export interface ThemeColors {
  background: string;
  foreground: string;
  card: string;
  border: string;
  destructive: string;
  primary: string;
  mutedForeground: string;
}

/**
 * Returns selected theme colors from Uniwind CSS variables.
 *
 * Missing variables are normalized to empty strings, which lets native callers
 * pass values directly to APIs that do not accept `undefined`.
 */
export function useThemeColors(): ThemeColors {
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
