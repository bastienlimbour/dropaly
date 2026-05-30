import { Link, Stack } from "expo-router";
import { View } from "react-native";

import { Button } from "@dropaly/ui-native/components/button";
import { Surface } from "@dropaly/ui-native/components/surface";
import { Text } from "@dropaly/ui-native/components/text";

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
            <Text className="text-foreground mb-1 text-lg font-medium">
              Page Not Found
            </Text>
            <Text className="text-muted-foreground mb-4 text-center text-sm">
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
