import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { View } from "react-native";
import { withUniwind } from "uniwind";

import { Container } from "@/components/container";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import { SignIn, SignUp } from "@/features/auth";
import { authClient } from "@/lib/auth-client";
import { queryClient, trpc } from "@/lib/trpc-client";

const StyledIonicons = withUniwind(Ionicons);

export default function Home() {
  const healthCheck = useQuery(trpc.healthCheck.queryOptions());
  const { data: session } = authClient.useSession();
  const privateData = useQuery({
    ...trpc.privateData.queryOptions(),
    enabled: Boolean(session?.user),
  });
  const isConnected = healthCheck?.data === "OK";
  const isLoading = healthCheck?.isLoading;

  return (
    <Container className="p-6">
      <View className="py-4 mb-6">
        <Text className="text-4xl font-bold text-foreground mb-2">
          BETTER T STACK
        </Text>
      </View>

      {session?.user ? (
        <Card className="mb-6 gap-0 p-4">
          <Text className="text-foreground text-base mb-2">
            Welcome, <Text className="font-medium">{session.user.name}</Text>
          </Text>
          <Text className="text-muted-foreground text-sm mb-4">
            {session.user.email}
          </Text>
          <Button
            variant="destructive"
            className="self-start"
            onPress={() => {
              authClient.signOut();
              void queryClient.invalidateQueries();
            }}
          >
            <Text>Sign Out</Text>
          </Button>
        </Card>
      ) : null}

      <Card className="gap-4 p-6">
        <View className="flex-row items-center justify-between mb-4">
          <CardTitle>System Status</CardTitle>
          <Badge
            variant={isConnected ? "default" : "destructive"}
            className={isConnected ? "bg-success" : undefined}
          >
            <Text>{isConnected ? "LIVE" : "OFFLINE"}</Text>
          </Badge>
        </View>

        <Card className="gap-0 p-4">
          <View className="flex-row items-center">
            <View
              className={`size-3 rounded-full mr-3 ${isConnected ? "bg-success" : "bg-muted"}`}
            />
            <View className="flex-1">
              <Text className="text-foreground font-medium mb-1">
                TRPC Backend
              </Text>
              <CardDescription>
                {isLoading
                  ? "Checking connection..."
                  : isConnected
                    ? "Connected to API"
                    : "API Disconnected"}
              </CardDescription>
            </View>
            {isLoading && (
              <StyledIonicons
                name="hourglass-outline"
                size={20}
                className="text-muted-foreground"
              />
            )}
            {!isLoading && isConnected && (
              <StyledIonicons
                name="checkmark-circle"
                size={20}
                className="text-success"
              />
            )}
            {!isLoading && !isConnected && (
              <StyledIonicons
                name="close-circle"
                size={20}
                className="text-destructive"
              />
            )}
          </View>
        </Card>
      </Card>

      <Card className="mt-6 gap-0 p-4">
        <CardTitle className="mb-3">Private Data</CardTitle>
        {privateData && (
          <CardDescription>{privateData.data?.message}</CardDescription>
        )}
      </Card>

      {!session?.user && (
        <>
          <SignIn />
          <SignUp />
        </>
      )}
    </Container>
  );
}
