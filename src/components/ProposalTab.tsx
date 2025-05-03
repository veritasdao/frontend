import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Detail from "./layout/proposal/detail/Detail";
import HistoryVote from "./layout/proposal/detail/HistoryVote";
import HistoryFundraising from "./layout/proposal/detail/HistoryFundraising";
import Chat from "./layout/proposal/detail/Chat";

export default function ProposalTab({ index }: { index: number }) {
  return (
    <Tabs defaultValue="detail" className="">
      <TabsList>
        <TabsTrigger value="detail">Detail</TabsTrigger>
        <TabsTrigger value="discussion">Discussion</TabsTrigger>
        <TabsTrigger value="fundraising">Fundraising</TabsTrigger>
        <TabsTrigger value="vote">Vote</TabsTrigger>
      </TabsList>
      <TabsContent value="detail">
        <Detail index={index} />
      </TabsContent>
      <TabsContent value="fundraising">
        <HistoryFundraising index={index} />
      </TabsContent>
      <TabsContent value="vote">
        <HistoryVote index={index} />
      </TabsContent>
      <TabsContent value="discussion">
        <Chat messages={messages} />
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
