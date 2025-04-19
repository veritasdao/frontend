import BackButton from "@/components/BackButton";
import Action from "@/components/layout/proposal/detail/Action";
import { ChartVoter } from "@/components/layout/proposal/detail/ChartVoter";
import Information from "@/components/layout/proposal/detail/Information";
import ProposalTab from "@/components/ProposalTab";
import React from "react";

type Params = { id: string };

export default async function page({ params }: { params: Params }) {
  const id = Number(params.id);
  return (
    <main className="grid xl:grid-cols-3 gap-5">
      <div className="col-span-2 space-y-5 ">
        <BackButton />
        <Information index={id} />
        <ChartVoter index={id} />
        <ProposalTab index={id} />
      </div>
      <Action index={id} />
    </main>
  );
}
