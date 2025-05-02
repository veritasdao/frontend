import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Detail from "@/components/layout/proposal/detail/Detail";
import Chat from "@/components/layout/proposal/detail/Chat";
import ActivityCommunity from "./ActivityCommunity";

export default function TabCommunity({ index }: { index: number }) {
  return (
    <Tabs defaultValue="detail">
      <TabsList>
        <TabsTrigger value="activity">Activity</TabsTrigger>
        <TabsTrigger value="discussion">Discussion</TabsTrigger>
        <TabsTrigger value="detail">Detail</TabsTrigger>
      </TabsList>
      <TabsContent value="activity">
        <ActivityCommunity />
      </TabsContent>
      <TabsContent value="discussion">
        <Chat messages={messages} />
      </TabsContent>
      <TabsContent value="detail">
        <Detail index={index} />
      </TabsContent>
    </Tabs>
  );
}

const messages = [
  {
    id: "1",
    sender: "0x1234567890abcdef1234567890abcdef12345678",
    content: "Hello! How's it going?",
    timestamp: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
  },
  {
    id: "2",
    sender: "0x9876543210fedcba9876543210fedcba98765432",
    content: "Just checking out this new dApp. Looks interesting!",
    timestamp: new Date(Date.now() - 1800000).toISOString(), // 30 minutes ago
    isCurrentUser: true,
  },
  {
    id: "3",
    sender: "0x1234567890abcdef1234567890abcdef12345678",
    content:
      "Thanks! We just launched it yesterday. Let me know if you have any questions.",
    timestamp: new Date(Date.now() - 900000).toISOString(), // 15 minutes ago
  },
];
