import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { View } from "react-native";
import { withUniwind } from "uniwind";

import { Container } from "@/components/container";
import { Button } from "@/components/ui/button";
import { Surface } from "@/components/ui/surface";
import { Text } from "@/components/ui/text";

const StyledIonicons = withUniwind(Ionicons);

function Modal() {
  function handleClose() {
    router.back();
  }

  return (
    <Container>
      <View className="flex-1 justify-center items-center p-4">
        <Surface variant="secondary" className="p-5 w-full max-w-sm rounded-lg">
          <View className="items-center">
            <View className="size-12 bg-accent rounded-lg items-center justify-center mb-3">
              <StyledIonicons
                name="checkmark"
                size={24}
                className="text-accent-foreground"
              />
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
    </Container>
  );
}

export default Modal;
