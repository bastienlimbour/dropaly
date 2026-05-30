import { useChat } from "@ai-sdk/react";
import { IconSend } from "@tabler/icons-react";
import { useRef, useEffect, useState, type SubmitEvent } from "react";
import { Streamdown } from "streamdown";

import { Button } from "@dropaly/ui-web/components/button";
import { Input } from "@dropaly/ui-web/components/input";

import { createAiChatTransport } from "./api";

export function AiPage() {
  const [input, setInput] = useState("");
  const { messages, sendMessage, status } = useChat({
    transport: createAiChatTransport(),
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = async (e: SubmitEvent) => {
    e.preventDefault();
    const text = input.trim();
    if (!text) return;
    await sendMessage({ text });
    setInput("");
  };

  return (
    <div className="mx-auto grid w-full grid-rows-[1fr_auto] overflow-hidden p-4">
      <div className="space-y-4 overflow-y-auto pb-4">
        {messages.length === 0 ? (
          <div className="mt-8 text-center text-muted-foreground">
            Ask me anything to get started!
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`rounded-lg p-3 ${
                message.role === "user"
                  ? "ml-8 bg-primary/10"
                  : "mr-8 bg-secondary/20"
              }`}
            >
              <p className="mb-1 text-sm font-semibold">
                {message.role === "user" ? "You" : "AI Assistant"}
              </p>
              {message.parts?.map((part, index) => {
                if (part.type === "text") {
                  return (
                    <Streamdown
                      key={index}
                      isAnimating={
                        status === "streaming" && message.role === "assistant"
                      }
                    >
                      {part.text}
                    </Streamdown>
                  );
                }
                return null;
              })}
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <form
        onSubmit={handleSubmit}
        className="flex w-full items-center space-x-2 border-t pt-2"
      >
        <Input
          name="prompt"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          className="flex-1"
          autoComplete="off"
          // autoFocus
        />
        <Button type="submit" size="icon">
          <IconSend size={18} />
        </Button>
      </form>
    </div>
  );
}
