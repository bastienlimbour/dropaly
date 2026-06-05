import { IconCheck } from "@tabler/icons-react-native";
import { router } from "expo-router";
import { View } from "react-native";

import { Button } from "@dropaly/ui-mobile/components/button";
import { Icon } from "@dropaly/ui-mobile/components/icon";
import { Surface } from "@dropaly/ui-mobile/components/surface";
import { Text } from "@dropaly/ui-mobile/components/text";

import { ViewContainer } from "@/components/container";

function handleClose() {
  router.back();
}

function Modal() {
  return (
    <ViewContainer>
      <View className="text-avocado-100 flex-1 items-center justify-center p-4">
        <Surface variant="secondary" className="w-full max-w-sm rounded-lg p-5">
          <View className="items-center">
            <View className="bg-accent mb-3 size-12 items-center justify-center rounded-lg">
              <Icon as={IconCheck} className="text-accent-foreground size-6" />
            </View>
            <Text className="text-foreground mb-1 text-lg font-medium">
              Modal Screen
            </Text>
            <Text className="text-muted-foreground mb-4 text-center text-sm">
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
