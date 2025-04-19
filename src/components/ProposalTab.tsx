import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Detail from "./layout/proposal/detail/Detail";
import HistoryVote from "./layout/proposal/detail/HistoryVote";

export default function ProposalTab({ index }: { index: number }) {
  return (
    <Tabs defaultValue="detail" className="">
      <TabsList className="w-1/2">
        <TabsTrigger value="detail">Detail</TabsTrigger>
        <TabsTrigger value="donasi">Donasi</TabsTrigger>
        <TabsTrigger value="vote">Vote</TabsTrigger>
      </TabsList>
      <TabsContent value="detail">
        <Detail index={index} />
      </TabsContent>
      <TabsContent value="donasi">Change your password here.</TabsContent>
      <TabsContent value="vote">
        <HistoryVote index={index} />
      </TabsContent>
    </Tabs>
  );
}
