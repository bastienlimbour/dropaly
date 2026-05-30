import { Stack } from "expo-router";

import { ThemeToggle } from "@/components/theme-toggle";
import { useThemedHeaderOptions } from "@/lib/theme";

export default function AiLayout() {
  const headerOptions = useThemedHeaderOptions();

  return (
    <Stack
      screenOptions={{
        // headerLargeTitle: true,
        headerRight: () => <ThemeToggle />,
        ...headerOptions,
      }}
    >
      <Stack.Screen name="index" options={{ title: "AI Chat" }} />
    </Stack>
  );
}
