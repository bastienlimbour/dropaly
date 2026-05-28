import { Stack } from "expo-router";

import { ThemeToggle } from "@/components/theme-toggle";
import { useThemedHeaderOptions } from "@/lib/theme";
import { useThemeColors } from "@dropaly/ui-native/lib/theme";

export default function HomeLayout() {
  const headerOptions = useThemedHeaderOptions();

  return (
    <Stack
      screenOptions={{
        headerLargeTitle: true,
        headerRight: () => <ThemeToggle />,
        ...headerOptions,
      }}
    >
      <Stack.Screen name="index" options={{ title: "Dropaly" }} />
    </Stack>
  );
}
