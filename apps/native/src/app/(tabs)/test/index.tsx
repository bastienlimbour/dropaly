import { ViewContainer } from "@/components/container";
import { Button } from "@dropaly/ui-native/components/button";

import { Text } from "@dropaly/ui-native/components/text";
import { Link } from "expo-router";

export default function TestRoute() {
  return (
    <ViewContainer edges={["top"]}>
      <Text>Test</Text>
      <Link href="/test/page-2" asChild>
        <Button>
          <Text>Test 2</Text>
        </Button>
      </Link>
    </ViewContainer>
  );
}
