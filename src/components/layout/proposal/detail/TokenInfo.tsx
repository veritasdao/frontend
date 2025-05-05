"use client";
import useGetTokenInfo from "@/hooks/getTokenInfo";
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import useGetDetailProposals from "@/hooks/getDetailProposal";
// import useGetDetailProposals from "@/hooks/getDetailProposal";
// import Link from "next/link";
// import { Button } from "@/components/ui/button";

export default function TokenInfo({ index }: { index: number }) {
  const { proposal } = useGetDetailProposals(index);
  const { tokenInfo } = useGetTokenInfo({ index });
  return (
    <Card>
      <CardHeader>
        <CardTitle>Token Information</CardTitle>
        <CardDescription>
          Tokens generated through this proposal will be fully managed by the
          community.
        </CardDescription>
      </CardHeader>
      {/* {proposal?.approved ? ( */}
      <CardContent>
        <div className="space-y-5">
          <section className="space-y-5">
            <div>
              <h3 className="text-lg font-semibold">{proposal?.name}</h3>
              <h3 className="text-sm font-semibold">$ {proposal?.symbol}</h3>
              <p className="text-muted-foreground text-sm">
                Contract Address: {tokenInfo?.tokenAddress.slice(0, 6)}...
                {tokenInfo?.tokenAddress.slice(-4)}
              </p>
            </div>
          </section>
          <hr />
          <section className="space-y-5">
            <h3 className="text-lg font-semibold">Token Allocation</h3>
            <div className="grid grid-cols-8 text-xs text-center ">
              <div className="col-span-2 space-y-1">
                <div className="bg-[#2563eb] rounded-l-md h-10" />
                <p>Team 5%</p>
              </div>
              <div className="col-span-3 space-y-1">
                <div className=" bg-[#1e40af] h-10" />
                <p>Community 55%</p>
              </div>
              <div className="col-span-3 space-y-1">
                <div className=" bg-[#172554] h-10 rounded-r-md" />
                <p>Public 40%</p>
              </div>
            </div>
            <h3 className="text-lg font-semibold">
              Total Supply: 1.000.000.000 {proposal?.symbol}
            </h3>
          </section>
        </div>
      </CardContent>
      {/* ) : (
        <CardContent>
          <p className="text-muted-foreground text-sm italic">
            Community proposal has not been approved
          </p>
        </CardContent>
      )} */}
    </Card>
  );
}
