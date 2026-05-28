import { Stack } from "expo-router";
import { useThemedHeaderOptions } from "@/lib/theme";

import { ThemeToggle } from "@/components/theme-toggle";

export default function SettingsLayout() {
  const headerOptions = useThemedHeaderOptions();

  return (
    <Stack
      screenOptions={{
        headerLargeTitle: true,
        headerRight: () => <ThemeToggle />,
        ...headerOptions,
      }}
    >
      <Stack.Screen name="index" options={{ title: "Settings" }} />
    </Stack>
  );
}