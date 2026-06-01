import { useChat } from "@ai-sdk/react";
import { IconArrowUp, IconMessageChatbot } from "@tabler/icons-react-native";
import { useEffect, useRef, useState, type ElementRef } from "react";
import { View } from "react-native";
import {
  KeyboardChatScrollView,
  KeyboardStickyView,
} from "react-native-keyboard-controller";

import { Button } from "@dropaly/ui-native/components/button";
import { FieldError } from "@dropaly/ui-native/components/field-error";
import { Icon } from "@dropaly/ui-native/components/icon";
import { Input } from "@dropaly/ui-native/components/input";
import { Separator } from "@dropaly/ui-native/components/separator";
import { Spinner } from "@dropaly/ui-native/components/spinner";
import { Surface } from "@dropaly/ui-native/components/surface";
import { Text } from "@dropaly/ui-native/components/text";

import { ScrollViewContainer, ViewContainer } from "@/components/container";
import { createAiChatTransport } from "@/features/ai/api";
import { SignIn, SignUp } from "@/features/auth";
import { authClient } from "@/lib/auth-client";

type ChatScrollViewRef = ElementRef<typeof KeyboardChatScrollView>;

export default function AiRoute() {
  const [input, setInput] = useState("");
  const { data: session } = authClient.useSession();
  const { messages, error, sendMessage, status } = useChat({
    transport: createAiChatTransport(),
    onError: (err) => console.error(err, "AI Chat Error"),
  });
  const scrollViewRef = useRef<ChatScrollViewRef>(null);
  const isBusy = status === "submitted" || status === "streaming";

  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  const onSubmit = async () => {
    const value = input.trim();
    if (value && !isBusy && session?.user) {
      await sendMessage({ text: value });
      setInput("");
    }
  };

  if (!session?.user) {
    return (
      <ScrollViewContainer
        edges={["bottom"]}
        scrollViewProps={{ contentContainerClassName: "p-6 gap-4" }}
      >
        <Text className="text-foreground text-2xl font-semibold">
          Sign in to chat with AI
        </Text>
        <SignIn />
        <SignUp />
      </ScrollViewContainer>
    );
  }

  if (error) {
    return (
      <ViewContainer edges={["bottom"]}>
        <View className="flex-1 items-center justify-center px-4">
          <Surface variant="secondary" className="rounded-lg p-4">
            <FieldError isInvalid>
              <Text className="text-destructive mb-1 text-center font-medium">
                {error.message}
              </Text>
              <Text className="text-muted-foreground text-center text-xs">
                Please check your connection and try again.
              </Text>
            </FieldError>
          </Surface>
        </View>
      </ViewContainer>
    );
  }

  return (
    <ViewContainer edges={["bottom"]} className="shrink">
      {/* <View className="flex-1 px-4 pt-4"> */}
      <KeyboardChatScrollView
        ref={scrollViewRef}
        className="px-4"
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 12 }}
        keyboardLiftBehavior="whenAtEnd"
        keyboardShouldPersistTaps="handled"
        contentInsetAdjustmentBehavior="automatic"
        showsVerticalScrollIndicator={false}
      >
        {messages.length === 0 ? (
          <Surface
            variant="default"
            className="flex-1 items-center justify-center rounded-xl py-8"
          >
            <Icon as={IconMessageChatbot} className="text-muted-foreground size-8" />
            <Text className="text-muted-foreground mt-3 text-sm">
              Ask me anything to get started
            </Text>
          </Surface>
        ) : (
          <View className="gap-3">
            {messages.map((message) => (
              <Surface
                key={message.id}
                variant={message.role === "user" ? "tertiary" : "secondary"}
                className={`rounded-xl p-3 ${message.role === "user" ? "ml-8" : "mr-8"}`}
              >
                <Text className="text-muted-foreground mb-1 text-xs font-medium">
                  {message.role === "user" ? "You" : "AI"}
                </Text>
                <View className="gap-1">
                  {message.parts.map((part, index) =>
                    part.type === "text" ? (
                      <Text
                        key={`${message.id}-${index}`}
                        className="text-foreground text-sm leading-relaxed"
                      >
                        {part.text}
                      </Text>
                    ) : (
                      <Text
                        key={`${message.id}-${index}`}
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
              <Surface variant="secondary" className="mr-8 rounded-xl p-3">
                <Text className="text-muted-foreground mb-1 text-xs font-medium">
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
      </KeyboardChatScrollView>
      {/* </View> */}

      <KeyboardStickyView offset={{ closed: 0, opened: 8 }}>
        <View className="bg-background px-4 pt-3 pb-4">
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
              <Icon
                as={IconArrowUp}
                className={
                  input.trim() && !isBusy
                    ? "text-primary-foreground size-5"
                    : "text-muted-foreground size-5"
                }
              />
            </Button>
          </View>
        </View>
      </KeyboardStickyView>
    </ViewContainer>
  );
}
