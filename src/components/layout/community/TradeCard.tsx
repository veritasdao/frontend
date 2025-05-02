"use client";
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Wallet } from "lucide-react";
import useGetTokenInfo from "@/hooks/getTokenInfo";
import useGetDetailProposals from "@/hooks/getDetailProposal";
import useGetBalance from "@/hooks/getBalance";
import { formatUnits } from "viem";

export default function TradeCard({ index }: { index: number }) {
  const { proposal } = useGetDetailProposals(index);
  const { tokenInfo } = useGetTokenInfo({ index });
  const { balanceIDRX } = useGetBalance();

  return (
    <div className="rounded-md border p-5 space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Trade Token Community</h1>
      </div>
      <Tabs defaultValue="buy">
        <TabsList>
          <TabsTrigger value="buy">Buy</TabsTrigger>
          <TabsTrigger value="sell">Sell</TabsTrigger>
        </TabsList>
        <TabsContent value="buy" className="space-y-2">
          <p className="text-sm text-muted-foreground flex items-center justify-end gap-1">
            <Wallet className="w-4 h-4" strokeWidth={1.5} />{" "}
            <span className="font-medium">
              {balanceIDRX
                ? parseFloat(
                    formatUnits(balanceIDRX as bigint, 2)
                  ).toLocaleString()
                : "0"}{" "}
              IDRX
            </span>
          </p>
          <div className="flex items-center justify-between relative">
            <Input placeholder="Amount" />
            <div className="flex items-center gap-1 absolute right-0 p-2 rounded-r-md bg-secondary">
              <Avatar className="w-5 h-5">
                <AvatarImage src="/images/idrx.svg" />
                <AvatarFallback>IDRX</AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium">IDRX</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Recieve </p>
            <div className="flex items-center gap-5">
              <p className="text-sm font-medium">100</p>
              <div className="flex items-center gap-1">
                <Avatar className="w-6 h-6">
                  <AvatarImage src={proposal?.image} />
                  <AvatarFallback>{tokenInfo?.symbol}</AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium">{tokenInfo?.symbol}</span>
              </div>
            </div>
          </div>
          <Button className="w-full">Confirm Buy</Button>
        </TabsContent>

        <TabsContent value="sell" className="space-y-2">
          <p className="text-sm text-muted-foreground flex items-center justify-end gap-1">
            <Wallet className="w-4 h-4" strokeWidth={1.5} />{" "}
            <span className="font-medium">
              {balanceIDRX
                ? parseFloat(
                    formatUnits(balanceIDRX as bigint, 2)
                  ).toLocaleString()
                : "0"}{" "}
              IDRX
            </span>
          </p>
          <div className="flex items-center justify-between relative">
            <Input placeholder="Amount" />
            <div className="flex items-center gap-1 absolute right-0 p-2 rounded-r-md bg-secondary">
              <Avatar className="w-5 h-5">
                <AvatarImage src={proposal?.image} />
                <AvatarFallback>{tokenInfo?.symbol}</AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium">{tokenInfo?.symbol}</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Recieve </p>
            <div className="flex items-center gap-5">
              <p className="text-sm font-medium">100</p>
              <div className="flex items-center gap-1">
                <Avatar className="w-6 h-6">
                  <AvatarImage src="/images/idrx.svg" />
                  <AvatarFallback>IDRX</AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium">IDRX</span>
              </div>
            </div>
          </div>
          <Button className="w-full">Confirm Sell</Button>
        </TabsContent>
      </Tabs>
    </div>
  );
}
