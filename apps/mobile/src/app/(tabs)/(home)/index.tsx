import {
  IconCircleCheck,
  IconCircleX,
  IconHourglass,
} from "@tabler/icons-react-native";
import { useQuery } from "@tanstack/react-query";
import { View } from "react-native";

import { healthQueries, privateDataQueries } from "@dropaly/api-query";
import { Badge } from "@dropaly/ui-mobile/components/badge";
import { Button } from "@dropaly/ui-mobile/components/button";
import {
  Card,
  CardDescription,
  CardTitle,
} from "@dropaly/ui-mobile/components/card";
import { Icon } from "@dropaly/ui-mobile/components/icon";
import { Text } from "@dropaly/ui-mobile/components/text";
import { cn } from "@dropaly/ui-mobile/utils";

import { ScrollViewContainer } from "@/components/container";
import { SignIn, SignUp } from "@/features/auth";
import { api } from "@/lib/api-client";
import { authClient } from "@/lib/auth-client";
import { queryClient } from "@/lib/query-client";

export default function Home() {
  const healthCheck = useQuery(healthQueries.check(api));
  const { data: session } = authClient.useSession();
  const privateData = useQuery({
    ...privateDataQueries.get(api),
    enabled: Boolean(session?.user),
  });
  const isConnected = healthCheck.data?.status === "OK";
  const isLoading = healthCheck.isLoading;

  return (
    <ScrollViewContainer scrollViewProps={{ contentContainerClassName: "p-6" }}>
      {session?.user ? (
        <Card className="mb-6 gap-0 p-4">
          <Text className="mb-2 text-base text-foreground">
            Welcome, <Text className="font-medium">{session.user.name}</Text>
          </Text>
          <Text className="mb-4 text-sm text-muted-foreground">
            {session.user.email}
          </Text>
          <Button
            variant="destructive"
            className="self-start"
            onPress={async () => {
              await authClient.signOut();
              void queryClient.invalidateQueries();
            }}
          >
            <Text>Sign Out</Text>
          </Button>
        </Card>
      ) : null}

      <Card className="gap-4 p-6">
        <View className="mb-4 flex-row items-center justify-between">
          <CardTitle>System Status</CardTitle>
          <Badge
            variant={isConnected ? "default" : "destructive"}
            className={cn(isConnected ? "bg-success" : null)}
          >
            <Text>{isConnected ? "LIVE" : "OFFLINE"}</Text>
          </Badge>
        </View>

        <Card className="gap-0 p-4">
          <View className="flex-row items-center">
            <View
              className={`mr-3 size-3 rounded-full ${isConnected ? "bg-success" : "bg-muted"}`}
            />
            <View className="flex-1">
              <Text className="mb-1 font-medium text-foreground">API Backend</Text>
              <CardDescription>
                {isLoading
                  ? "Checking connection..."
                  : isConnected
                    ? "Connected to API"
                    : "API Disconnected"}
              </CardDescription>
            </View>
            {isLoading && (
              <Icon as={IconHourglass} className="size-5 text-muted-foreground" />
            )}
            {!isLoading && isConnected && (
              <Icon as={IconCircleCheck} className="size-5 text-success" />
            )}
            {!isLoading && !isConnected && (
              <Icon as={IconCircleX} className="size-5 text-destructive" />
            )}
          </View>
        </Card>
      </Card>

      <Card className="mt-6 gap-0 p-4">
        <CardTitle className="mb-3">Private Data</CardTitle>
        <CardDescription>{privateData.data?.message}</CardDescription>
      </Card>

      {!session?.user && (
        <View className="mt-6 gap-4">
          <SignIn />
          <SignUp />
        </View>
      )}
    </ScrollViewContainer>
  );
}
