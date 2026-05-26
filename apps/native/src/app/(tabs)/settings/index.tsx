import { View } from "react-native";

import { ScreenScrollView } from "@/components/container";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import { useAppTheme } from "@/contexts/app-theme-context";
import { authClient } from "@/lib/auth-client";
import { queryClient } from "@/lib/trpc-client";

export default function SettingsRoute() {
  const { currentTheme } = useAppTheme();
  const { data: session } = authClient.useSession();

  return (
    <ScreenScrollView contentContainerClassName="p-6 gap-4">
      <Card className="p-4 gap-3">
        <View className="flex-row items-center justify-between gap-3">
          <View className="flex-1">
            <CardTitle>Appearance</CardTitle>
            <CardDescription>Current theme: {currentTheme}</CardDescription>
          </View>
          <ThemeToggle />
        </View>
      </Card>

      {session?.user ? (
        <Card className="p-4 gap-3">
          <View>
            <CardTitle>Account</CardTitle>
            <CardDescription>{session.user.email}</CardDescription>
          </View>
          <Button
            variant="destructive"
            onPress={() => {
              authClient.signOut();
              void queryClient.invalidateQueries();
            }}
          >
            <Text>Sign Out</Text>
          </Button>
        </Card>
      ) : null}
    </ScreenScrollView>
  );
}
