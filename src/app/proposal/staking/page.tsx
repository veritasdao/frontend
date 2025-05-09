import { StakingTab } from "@/components/layout/staking/StakingTab";
import React from "react";

export default function page() {
  return (
    <main>
      <section className="text-center py-10">
        <h1 className="text-5xl font-bold mb-2">
          Staking IDRX, Get Attractive Rewards!
        </h1>
        <h2 className="text-muted-foreground max-w-2xl mx-auto">
          Stake your IDRX assets and earn automatic rewards every day. Start
          staking now, let your coins work for you!
        </h2>
      </section>
      <StakingTab />
    </main>
  );
}
