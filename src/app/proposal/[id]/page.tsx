import BackButton from "@/components/BackButton";
import Action from "@/components/layout/proposal/detail/Action";
import { ChartVoter } from "@/components/layout/proposal/detail/ChartVoter";
import Chat from "@/components/layout/proposal/detail/Chat";
import Information from "@/components/layout/proposal/detail/Information";
import ProposalTab from "@/components/ProposalTab";
import React from "react";

export default async function page({
  params,
}: {
  params: Promise<{ id: number }>;
}) {
  const { id } = await params;
  return (
    <main className="grid xl:grid-cols-3 gap-5">
      <div className="col-span-2 space-y-5 ">
        <BackButton />
        <Information index={id} />
        <ChartVoter index={id} />
        <ProposalTab index={id} />
      </div>
      <div className="space-y-5">
        <Action index={id} />
        <Chat messages={messages} />
      </div>
    </main>
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
