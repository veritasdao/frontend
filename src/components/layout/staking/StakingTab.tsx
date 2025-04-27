"use client";
import StakeClaim from "@/components/layout/staking/StakeClaim";
import StakeForm from "@/components/layout/staking/StakeForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import React from "react";

export function StakingTab() {
  return (
    <Tabs defaultValue="stake" className="mx-auto max-w-2xl">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="stake">Mulai Menabung</TabsTrigger>
        <TabsTrigger value="unstake">Ambil Tabungan</TabsTrigger>
      </TabsList>
      <TabsContent value="stake">
        <StakeForm />
      </TabsContent>
      <TabsContent value="unstake">
        <StakeClaim />
      </TabsContent>
    </Tabs>
  );
}
