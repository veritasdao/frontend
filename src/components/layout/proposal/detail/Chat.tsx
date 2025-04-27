"use client";

import { Send } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAccount } from "wagmi";
import moment from "moment";

interface Message {
  id: string;
  sender: string;
  content: string;
  timestamp: string;
}

export default function Chat({
  messages: initialMessages,
}: {
  messages: Message[];
}) {
  const { address, isConnected } = useAccount();
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [newMessage, setNewMessage] = useState("");

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const messageData: Message = {
      id: Date.now().toString(),
      sender: address as `0x${string}`, // Replace with actual user data
      content: newMessage,
      timestamp: new Date().toISOString(),
    };

    setMessages((prevMessages) => [...prevMessages, messageData]);
    setNewMessage("");
  };

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    // Find the ScrollArea viewport element
    const viewport = document.querySelector(
      "[data-radix-scroll-area-viewport]"
    );
    if (viewport) {
      // Force scroll to bottom
      viewport.scrollTop = viewport.scrollHeight;
    }
  };

  useEffect(() => {
    // Initial scroll
    scrollToBottom();

    // Set up a MutationObserver to watch for changes in the messages container
    const messagesContainer = document.querySelector(
      "[data-radix-scroll-area-viewport]"
    );
    if (messagesContainer) {
      const observer = new MutationObserver(scrollToBottom);
      observer.observe(messagesContainer, {
        childList: true,
        subtree: true,
      });

      return () => observer.disconnect();
    }
  }, [messages]);

  return (
    <div className="border border-[#1d4ed8] rounded-md">
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="flex-1 p-4 h-[400px] xl:h-[450px]">
          <div className="space-y-4 max-w-3xl mx-auto">
            {messages.map((msg) => (
              <div key={msg.id} className="flex flex-col">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-sm">
                    {msg.sender.slice(0, 4)}...{msg.sender.slice(-4)}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {moment(msg.timestamp).fromNow()}
                  </span>
                </div>
                <Card className="p-3 max-w-[80%] bg-accent">
                  <p className="break-words text-sm">{msg.content}</p>
                </Card>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
      </div>

      {isConnected && (
        <div className="p-4 border-t">
          <div className="flex gap-2 max-w-3xl mx-auto">
            <Input
              placeholder="Type a message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
              className="flex-1"
            />
            <Button
              onClick={handleSendMessage}
              disabled={!newMessage.trim()}
              size={"icon"}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
