"use client";
import useGetTokenInfo from "@/hooks/getTokenInfo";
import React from "react";
import { formatUnits } from "viem";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
// import useGetDetailProposals from "@/hooks/getDetailProposal";

export default function TokenCommunity({ index }: { index: number }) {
  //   const { proposal } = useGetDetailProposals(index);
  const { tokenInfo } = useGetTokenInfo({ index });
  return (
    <Card>
      <CardHeader>
        <CardTitle>Token Community Information</CardTitle>
        <CardDescription>
          The community will have complete control over the tokens created by
          this proposal.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="space-y-5">
          <section>
            <div>
              <h3 className="text-lg font-semibold">$ {tokenInfo?.symbol}</h3>
              <p className="text-muted-foreground text-sm">
                Contract Address: {tokenInfo?.tokenAddress.slice(0, 6)}...
                {tokenInfo?.tokenAddress.slice(-4)}
              </p>
            </div>
          </section>
          <hr />
          <section className="space-y-2">
            <h3 className="text-lg font-semibold">Token Allocation</h3>
            <div className="grid grid-cols-8 text-xs text-center ">
              <div className="col-span-2 space-y-1">
                <div className="bg-[#2563eb] rounded-l-md h-5" />
                <p>Team 5%</p>
              </div>
              <div className="col-span-3 space-y-1">
                <div className=" bg-[#1e40af] h-5" />
                <p>Community 55%</p>
              </div>
              <div className="col-span-3 space-y-1">
                <div className=" bg-[#172554] h-5 rounded-r-md" />
                <p>Public 40%</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Total Supply:{" "}
              {parseFloat(
                formatUnits(tokenInfo?.totalSupply as bigint, 2)
              ).toLocaleString()}{" "}
              <span className="text-xs text-muted-foreground">
                {tokenInfo?.symbol}
              </span>
            </p>
          </section>
          <hr />
          <section className="grid grid-cols-2 gap-5">
            <div>
              <h3 className="text-muted-foreground text-sm">Liquidity</h3>
              <p className="text-xl font-semibold">$ 1000.000</p>
            </div>
            <div>
              <h3 className="text-muted-foreground text-sm">Market Cap</h3>
              <p className="text-xl font-semibold">$ 1000.000</p>
            </div>
          </section>
        </div>
      </CardContent>
    </Card>
  );
}
