"use client";
import StakeForm from "@/components/layout/staking/StakeForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import React from "react";
import UnstakeForm from "@/components/layout/staking/UnstakeForm";
import StakeClaim from "./StakeClaim";

export function StakingTab() {
  return (
    <Tabs defaultValue="stake" className="mx-auto max-w-2xl">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="stake">Stake</TabsTrigger>
        <TabsTrigger value="unstake">Unstake</TabsTrigger>
        <TabsTrigger value="claim">Claim Stake Rewards</TabsTrigger>
      </TabsList>
      <TabsContent value="stake">
        <StakeForm />
      </TabsContent>
      <TabsContent value="unstake">
        <UnstakeForm />
      </TabsContent>
      <TabsContent value="claim">
        <StakeClaim />
      </TabsContent>
    </Tabs>
  );
}
