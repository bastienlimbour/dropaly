import { useChat } from "@ai-sdk/react";
import { Ionicons } from "@expo/vector-icons";
import { useRef, useEffect, useState } from "react";
import {
  View,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { withUniwind } from "uniwind";

import { Container } from "@/components/container";
import { Button } from "@/components/ui/button";
import { FieldError } from "@/components/ui/field-error";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Spinner } from "@/components/ui/spinner";
import { Surface } from "@/components/ui/surface";
import { Text } from "@/components/ui/text";
import { SignIn, SignUp } from "@/features/auth";
import { authClient } from "@/lib/auth-client";
import { createAiChatTransport } from "./api";

const StyledIonicons = withUniwind(Ionicons);

export function AiScreen() {
  const [input, setInput] = useState("");
  const { data: session } = authClient.useSession();
  const { messages, error, sendMessage, status } = useChat({
    transport: createAiChatTransport(),
    onError: (error) => console.error(error, "AI Chat Error"),
  });
  const scrollViewRef = useRef<ScrollView>(null);
  const isBusy = status === "submitted" || status === "streaming";

  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  const onSubmit = () => {
    const value = input.trim();
    if (value && !isBusy && session?.user) {
      sendMessage({ text: value });
      setInput("");
    }
  };

  if (!session?.user) {
    return (
      <Container className="p-6">
        <Text className="text-2xl font-semibold text-foreground mb-4">
          Sign in to chat with AI
        </Text>
        <SignIn />
        <SignUp />
      </Container>
    );
  }

  if (error) {
    return (
      <Container isScrollable={false}>
        <View className="flex-1 justify-center items-center px-4">
          <Surface variant="secondary" className="p-4 rounded-lg">
            <FieldError isInvalid>
              <Text className="text-destructive text-center font-medium mb-1">
                {error.message}
              </Text>
              <Text className="text-muted-foreground text-center text-xs">
                Please check your connection and try again.
              </Text>
            </FieldError>
          </Surface>
        </View>
      </Container>
    );
  }

  return (
    <Container isScrollable={false}>
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View className="flex-1 px-4 py-4">
          <View className="py-4 mb-4">
            <Text className="text-2xl font-semibold text-foreground tracking-tight">
              AI Chat
            </Text>
            <Text className="text-muted-foreground text-sm mt-1">
              Chat with our AI assistant
            </Text>
          </View>

          <ScrollView
            ref={scrollViewRef}
            className="flex-1 mb-4"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ flexGrow: 1, paddingBottom: 8 }}
            keyboardShouldPersistTaps="handled"
          >
            {messages.length === 0 ? (
              <Surface
                variant="secondary"
                className="flex-1 justify-center items-center py-8 rounded-xl"
              >
                <StyledIonicons
                  name="chatbubble-ellipses-outline"
                  size={32}
                  className="text-muted-foreground"
                />
                <Text className="text-muted-foreground text-sm mt-3">
                  Ask me anything to get started
                </Text>
              </Surface>
            ) : (
              <View className="gap-3">
                {messages.map((message) => (
                  <Surface
                    key={message.id}
                    variant={message.role === "user" ? "tertiary" : "secondary"}
                    className={`p-3 rounded-xl ${
                      message.role === "user" ? "ml-8" : "mr-8"
                    }`}
                  >
                    <Text className="text-xs font-medium mb-1 text-muted-foreground">
                      {message.role === "user" ? "You" : "AI"}
                    </Text>
                    <View className="gap-1">
                      {message.parts.map((part, i) =>
                        part.type === "text" ? (
                          <Text
                            key={`${message.id}-${i}`}
                            className="text-foreground text-sm leading-relaxed"
                          >
                            {part.text}
                          </Text>
                        ) : (
                          <Text
                            key={`${message.id}-${i}`}
                            className="text-foreground text-sm leading-relaxed"
                          >
                            {JSON.stringify(part)}
                          </Text>
                        ),
                      )}
                    </View>
                  </Surface>
                ))}
                {isBusy && (
                  <Surface variant="secondary" className="p-3 mr-8 rounded-xl">
                    <Text className="text-xs font-medium mb-1 text-muted-foreground">
                      AI
                    </Text>
                    <View className="flex-row items-center gap-2">
                      <Spinner size="sm" />
                      <Text className="text-muted-foreground text-sm">Thinking...</Text>
                    </View>
                  </Surface>
                )}
              </View>
            )}
          </ScrollView>

          <Separator className="mb-3" />

          <View className="flex-row items-center gap-2">
            <View className="flex-1">
              <Input
                value={input}
                onChangeText={setInput}
                placeholder="Type a message..."
                onSubmitEditing={onSubmit}
                returnKeyType="send"
                editable={!isBusy}
              />
            </View>
            <Button
              size="icon"
              className="size-9"
              variant={input.trim() && !isBusy ? "default" : "secondary"}
              onPress={onSubmit}
              disabled={!input.trim() || isBusy}
            >
              <StyledIonicons
                name="arrow-up"
                size={18}
                className={
                  input.trim() && !isBusy
                    ? "text-primary-foreground"
                    : "text-muted-foreground"
                }
              />
            </Button>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Container>
  );
}
