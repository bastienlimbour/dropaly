import { Uniwind, useUniwind } from "uniwind";

type ThemeName = "light" | "dark";

export function useAppTheme() {
  const { theme } = useUniwind();
  const isLight = theme === "light";
  const isDark = theme === "dark";

  const setTheme = (newTheme: ThemeName) => {
    Uniwind.setTheme(newTheme);
  };

  const toggleTheme = () => {
    Uniwind.setTheme(theme === "light" ? "dark" : "light");
  };

  return {
    theme,
    currentTheme: theme,
    isLight,
    isDark,
    setTheme,
    toggleTheme,
  };
}
