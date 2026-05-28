import { IconCheck } from "@tabler/icons-react-native";
import { router } from "expo-router";
import { View } from "react-native";

import { ViewContainer } from "@/components/container";
import { Button } from "@dropaly/ui-native/components/button";
import { Icon } from "@dropaly/ui-native/components/icon";
import { Surface } from "@dropaly/ui-native/components/surface";
import { Text } from "@dropaly/ui-native/components/text";

function Modal() {
  function handleClose() {
    router.back();
  }

  return (
    <ViewContainer>
      <View className="flex-1 justify-center items-center p-4">
        <Surface variant="secondary" className="p-5 w-full max-w-sm rounded-lg">
          <View className="items-center">
            <View className="size-12 bg-accent rounded-lg items-center justify-center mb-3">
              <Icon as={IconCheck} className="text-accent-foreground size-6" />
            </View>
            <Text className="text-foreground font-medium text-lg mb-1">
              Modal Screen
            </Text>
            <Text className="text-muted-foreground text-sm text-center mb-4">
              This is an example modal screen for dialogs and confirmations.
            </Text>
          </View>
          <Button onPress={handleClose} className="w-full" size="sm">
            <Text>Close</Text>
          </Button>
        </Surface>
      </View>
    </ViewContainer>
  );
}

export default Modal;
