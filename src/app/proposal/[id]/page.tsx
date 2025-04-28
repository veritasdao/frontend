import BackButton from "@/components/BackButton";
import Action from "@/components/layout/proposal/detail/Action";
import { ChartVoter } from "@/components/layout/proposal/detail/ChartVoter";
import Chat from "@/components/layout/proposal/detail/Chat";
import Information from "@/components/layout/proposal/detail/Information";
import TokenInfo from "@/components/layout/proposal/detail/TokenInfo";
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
        <TokenInfo index={id} />
      </div>
    </main>
  );
}
