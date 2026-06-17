import { Link, Stack } from "expo-router";
import { View } from "react-native";

import { Button } from "@dropaly/ui-mobile/components/button";
import { Surface } from "@dropaly/ui-mobile/components/surface";
import { Text } from "@dropaly/ui-mobile/components/text";

import { ViewContainer } from "@/components/container";

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: "Not Found" }} />
      <ViewContainer>
        <View className="flex-1 items-center justify-center p-4">
          <Surface
            variant="secondary"
            className="max-w-sm items-center rounded-lg p-6"
          >
            <Text className="mb-3 text-4xl">🤔</Text>
            <Text className="mb-1 text-lg font-medium text-foreground">
              Page Not Found
            </Text>
            <Text className="mb-4 text-center text-sm text-muted-foreground">
              The page you're looking for doesn't exist.
            </Text>
            <Link href="/" asChild>
              <Button size="sm">
                <Text>Go Home</Text>
              </Button>
            </Link>
          </Surface>
        </View>
      </ViewContainer>
    </>
  );
}
