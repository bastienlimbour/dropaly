import { View } from "react-native";

import { Container } from "@/components/container";
import { Card, CardTitle } from "@/components/ui/card";

export default function Home() {
  return (
    <Container className="p-6">
      <View className="flex-1 justify-center items-center">
        <Card className="items-center p-8">
          <CardTitle className="text-3xl mb-2">Tab One</CardTitle>
        </Card>
      </View>
    </Container>
  );
}
