import { Stack } from "expo-router";

import { ThemeToggle } from "@/components/theme-toggle";
import { useThemeColors } from "@/lib/theme";

export default function AiLayout() {
  const colors = useThemeColors();

  return (
    <Stack
      screenOptions={{
        headerLargeTitle: true,
        headerRight: () => <ThemeToggle />,
        headerStyle: { backgroundColor: colors.background },
        headerTintColor: colors.foreground,
        headerTitleStyle: { color: colors.foreground, fontWeight: "600" },
      }}
    >
      <Stack.Screen name="index" options={{ title: "AI Chat" }} />
    </Stack>
  );
}
