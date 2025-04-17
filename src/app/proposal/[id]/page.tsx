import Action from "@/components/layout/proposal/detail/Action";
import { ChartVoter } from "@/components/layout/proposal/detail/ChartVoter";
import Detail from "@/components/layout/proposal/detail/Detail";
import Information from "@/components/layout/proposal/detail/Information";
import React from "react";

type Params = { id: number };

export default async function page({ params }: { params: Params }) {
  const { id } = await params;
  return (
    <main className="grid xl:grid-cols-3 gap-5">
      <div className="col-span-2 space-y-5 border-">
        <Information />
        <ChartVoter />
        <Detail />
      </div>
      <Action index={id} />
    </main>
  );
}
