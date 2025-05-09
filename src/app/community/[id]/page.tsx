import AmountCommunity from "@/components/layout/community/AmountCommunity";
import Information from "@/components/layout/community/Information";
import TabCommunity from "@/components/layout/community/TabCommunity";
import TokenCommunity from "@/components/layout/community/TokenCommunity";
import TradeCard from "@/components/layout/community/TradeCard";
import React from "react";

export default async function page({
  params,
}: {
  params: Promise<{ id: number }>;
}) {
  const { id } = await params;
  return (
    <main className="grid grid-cols-1 xl:grid-cols-3 gap-5">
      <div className="col-span-2 space-y-10">
        <AmountCommunity index={id} />
        <Information index={id} />
        <TabCommunity index={id} />
      </div>
      <div className="space-y-10">
        <TradeCard index={id} />
        <TokenCommunity index={id} />
      </div>
    </main>
  );
}
