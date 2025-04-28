"use client";

import { Send, Loader2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAccount } from "wagmi";
import moment from "moment";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  sender: string;
  content: string;
  timestamp: string;
  status?: "sending" | "sent" | "error";
}

export default function Chat({
  messages: initialMessages,
}: {
  messages: Message[];
}) {
  const { address, isConnected } = useAccount();
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [newMessage, setNewMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || isSending) return;

    setIsSending(true);
    const messageData: Message = {
      id: Date.now().toString(),
      sender: address as `0x${string}`,
      content: newMessage,
      timestamp: new Date().toISOString(),
      status: "sending",
    };

    setMessages((prevMessages) => [...prevMessages, messageData]);
    setNewMessage("");

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg.id === messageData.id ? { ...msg, status: "sent" } : msg
        )
      );
    } catch (error) {
      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg.id === messageData.id ? { ...msg, status: "error" } : msg
        )
      );
    } finally {
      setIsSending(false);
    }
  };

  const scrollToBottom = () => {
    const viewport = document.querySelector(
      "[data-radix-scroll-area-viewport]"
    );
    if (viewport) {
      viewport.scrollTop = viewport.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <Card className="rounded-lg shadow-sm">
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="flex-1 p-4 h-[400px] xl:h-[450px]">
          <div className="space-y-4 max-w-3xl mx-auto">
            {messages.map((msg) => {
              const isCurrentUser = msg.sender === address;
              return (
                <div
                  key={msg.id}
                  className={cn(
                    "flex flex-col",
                    isCurrentUser ? "items-end" : "items-start"
                  )}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-sm text-muted-foreground">
                      {isCurrentUser
                        ? "You"
                        : `${msg.sender.slice(0, 4)}...${msg.sender.slice(-4)}`}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {moment(msg.timestamp).format("MMM D, h:mm A")}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Card
                      className={cn(
                        "p-3 max-w-sm",
                        isCurrentUser
                          ? "bg-primary text-primary-foreground"
                          : "bg-accent",
                        msg.status === "error" && "border-destructive"
                      )}
                    >
                      <p className="text-sm">{msg.content}</p>
                    </Card>
                    {msg.status === "sending" && (
                      <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                    )}
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
      </div>
      <hr />
      {isConnected && (
        <div className="">
          <div className="flex gap-2 max-w-3xl mx-auto">
            <Input
              placeholder="Tulis pesan..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) =>
                e.key === "Enter" && !e.shiftKey && handleSendMessage()
              }
              className="flex-1"
              disabled={isSending}
            />
            <Button
              onClick={handleSendMessage}
              disabled={!newMessage.trim() || isSending}
              size="icon"
              className="shrink-0"
            >
              {isSending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
}
