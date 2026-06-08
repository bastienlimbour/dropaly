import { View } from "react-native";

import { Button } from "@dropaly/ui-mobile/components/button";
import {
  Card,
  CardDescription,
  CardTitle,
} from "@dropaly/ui-mobile/components/card";
import { Text } from "@dropaly/ui-mobile/components/text";
import { useUiTheme } from "@dropaly/ui-mobile/theme";
import type { ThemePreference } from "@dropaly/ui-mobile/theme";

import { ScrollViewContainer } from "@/components/container";
import { authClient } from "@/lib/auth-client";
import { queryClient } from "@/lib/query-client";

const THEME_OPTIONS: { label: string; value: ThemePreference }[] = [
  { label: "Light", value: "light" },
  { label: "Dark", value: "dark" },
  { label: "System", value: "system" },
];

export default function SettingsRoute() {
  const { resolvedTheme, themePreference, setTheme } = useUiTheme();
  const { data: session } = authClient.useSession();

  return (
    <ScrollViewContainer
      scrollViewProps={{ contentContainerClassName: "p-6 gap-4" }}
    >
      <Card className="gap-3 p-4">
        <View className="flex-row items-center justify-between gap-3">
          <View className="flex-1">
            <CardTitle>Appearance</CardTitle>
            <CardDescription>
              Current preference: {themePreference}
              {themePreference === "system" ? ` (resolved: ${resolvedTheme})` : ""}
            </CardDescription>
          </View>
        </View>
        <View className="flex-row gap-2">
          {THEME_OPTIONS.map((option) => (
            <Button
              key={option.value}
              variant={themePreference === option.value ? "default" : "outline"}
              className="flex-1"
              onPress={() => setTheme(option.value)}
            >
              <Text>{option.label}</Text>
            </Button>
          ))}
        </View>
      </Card>

      {session?.user ? (
        <Card className="gap-3 p-4">
          <View>
            <CardTitle>Account</CardTitle>
            <CardDescription>{session.user.email}</CardDescription>
          </View>
          <Button
            variant="destructive"
            onPress={() => {
              void authClient.signOut();
              void queryClient.invalidateQueries();
            }}
          >
            <Text>Sign Out</Text>
          </Button>
        </Card>
      ) : null}
    </ScrollViewContainer>
  );
}
