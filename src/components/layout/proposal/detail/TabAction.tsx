import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Donate from "../donate";
import Vote from "./Vote";

export default function TabAction({ index }: { index: number }) {
  return (
    <div>
      <Tabs defaultValue="donate">
        <TabsList>
          <TabsTrigger value="donate" className="">
            Donate
          </TabsTrigger>
          <TabsTrigger value="vote" className="">
            Vote
          </TabsTrigger>
        </TabsList>
        <TabsContent value="donate">
          <Donate index={index} />
        </TabsContent>
        <TabsContent value="vote">
          <Vote index={index} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
