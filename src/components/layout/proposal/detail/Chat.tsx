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
import { createClient } from "@/config/supabase";
import { toast } from "sonner";
import useGetDetailProposals from "@/hooks/getDetailProposal";

interface Discussion {
  id: number;
  title: string;
  description: string;
  created_at: string;
  updated_at: string;
}

interface ChatMessage {
  id: string;
  discussion_id: number;
  sender: string;
  message: string;
  created_at: string;
}

export default function Chat({ proposalId }: { proposalId: number }) {
  const { proposal } = useGetDetailProposals(proposalId);
  const { address, isConnected } = useAccount();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isCreatingDiscussion, setIsCreatingDiscussion] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const supabase = createClient();

    // Initial fetch of messages
    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from("chat")
        .select("*")
        .eq("discussion_id", proposalId)
        .order("created_at", { ascending: true });

      if (error) {
        console.error("Error fetching messages:", error);
        toast.error("Failed to load messages");
      } else {
        setMessages(data || []);
      }
    };

    fetchMessages();

    // Set up real-time subscription
    const subscription = supabase
      .channel("chat_changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "chat",
          filter: `discussion_id=eq.${proposalId}`,
        },
        (payload) => {
          if (payload.eventType === "INSERT") {
            setMessages((prev) => [...prev, payload.new as ChatMessage]);
          } else if (payload.eventType === "UPDATE") {
            setMessages((prev) =>
              prev.map((message) =>
                message.id === payload.new.id
                  ? (payload.new as ChatMessage)
                  : message
              )
            );
          } else if (payload.eventType === "DELETE") {
            setMessages((prev) =>
              prev.filter((message) => message.id !== payload.old.id)
            );
          }
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [proposalId]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || isSending || !address) return;

    setIsSending(true);
    const supabase = createClient();

    try {
      const { error } = await supabase.from("chat").insert({
        discussion_id: proposalId,
        sender: address,
        message: newMessage,
      });

      if (error) throw error;

      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message");
    } finally {
      setIsSending(false);
    }
  };

  const handleCreateDiscussion = async () => {
    if (!address) return;

    setIsCreatingDiscussion(true);
    const supabase = createClient();

    try {
      // First create a discussion
      const { data: discussion, error: discussionError } = await supabase
        .from("discussions")
        .insert({
          id: proposalId,
          title: proposal.title,
          description: proposal.description,
        })
        .select()
        .single();

      if (discussionError) throw discussionError;

      // Then create the first message
      const { error: messageError } = await supabase.from("chat").insert({
        discussion_id: discussion.id,
        sender: address,
        message: "Discussion started",
      });

      if (messageError) throw messageError;

      // Refresh messages
      const { data: newMessages, error: fetchError } = await supabase
        .from("chat")
        .select("*")
        .eq("discussion_id", discussion.id)
        .order("created_at", { ascending: true });

      if (fetchError) throw fetchError;

      setMessages(newMessages || []);
    } catch (error) {
      console.error("Error creating discussion:", error);
      toast.error("Failed to create discussion");
    } finally {
      setIsCreatingDiscussion(false);
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
            {messages.length === 0 && (
              <div className="flex flex-col justify-center items-center h-full gap-4">
                <p className="text-muted-foreground">No messages yet</p>
              </div>
            )}
            {messages.map((message) => {
              const isCurrentUser = message.sender === address;
              return (
                <div
                  key={`${message.discussion_id}-${message.id}`}
                  className={cn(
                    "flex flex-col",
                    isCurrentUser ? "items-end" : "items-start"
                  )}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-sm text-muted-foreground">
                      {isCurrentUser
                        ? "You"
                        : `${message.sender.slice(
                            0,
                            4
                          )}...${message.sender.slice(-4)}`}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {moment(message.created_at).format("MMM D, h:mm A")}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Card
                      className={cn(
                        "p-3 max-w-sm",
                        isCurrentUser
                          ? "bg-primary text-primary-foreground"
                          : "bg-accent"
                      )}
                    >
                      <p className="text-sm">{message.message}</p>
                    </Card>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
      </div>
      {isConnected && (
        <>
          {messages.length === 0 ? (
            <div className="flex flex-col justify-center items-center h-full gap-4">
              {isConnected && (
                <Button
                  onClick={handleCreateDiscussion}
                  disabled={isCreatingDiscussion}
                  className="gap-2"
                >
                  {isCreatingDiscussion ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Creating Discussion...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      Start Discussion
                    </>
                  )}
                </Button>
              )}
            </div>
          ) : (
            <div>
              <div className="flex gap-2 max-w-3xl mx-auto">
                <Input
                  placeholder="Write a message..."
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
        </>
      )}
    </Card>
  );
}
