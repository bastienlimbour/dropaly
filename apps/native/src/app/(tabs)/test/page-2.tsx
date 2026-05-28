import { ViewContainer } from "@/components/container";

import { Text } from "@dropaly/ui-native/components/text";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Test2Route() {
  return (
    <ViewContainer edges={["top"]}>
      <Text>Test 2</Text>
    </ViewContainer>
  );
}
