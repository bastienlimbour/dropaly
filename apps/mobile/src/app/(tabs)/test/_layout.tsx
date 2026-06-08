import { Stack } from "expo-router";

import { useThemeColors } from "@dropaly/ui-mobile/theme";

export default function TestLayout() {
  const colors = useThemeColors();

  return (
    <Stack screenOptions={{ headerStyle: { backgroundColor: colors.background } }}>
      <Stack.Screen name="index" options={{ title: "Test" }} />
    </Stack>
  );
}
