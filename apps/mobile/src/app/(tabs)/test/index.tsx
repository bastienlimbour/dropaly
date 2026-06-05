import { Link } from "expo-router";

import { Button } from "@dropaly/ui-mobile/components/button";
import { Text } from "@dropaly/ui-mobile/components/text";

import { ViewContainer } from "@/components/container";

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
