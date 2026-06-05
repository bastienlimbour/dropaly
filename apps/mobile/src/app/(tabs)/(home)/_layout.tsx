import { Stack } from "expo-router";

import { ThemeToggle } from "@/components/theme-toggle";
import { useThemedHeaderOptions } from "@/lib/theme";

function renderHeaderRight() {
  return <ThemeToggle />;
}

export default function HomeLayout() {
  const headerOptions = useThemedHeaderOptions();

  return (
    <Stack
      screenOptions={{
        headerLargeTitle: true,
        headerRight: renderHeaderRight,
        ...headerOptions,
      }}
    >
      <Stack.Screen name="index" options={{ title: "Dropaly" }} />
    </Stack>
  );
}
