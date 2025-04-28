"use client";
import useGetTokenInfo from "@/hooks/getTokenInfo";
import React from "react";
import { formatUnits } from "viem";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import useGetDetailProposals from "@/hooks/getDetailProposal";

export default function TokenInfo({ index }: { index: number }) {
  const { proposal } = useGetDetailProposals(index);
  const { tokenInfo } = useGetTokenInfo({ index });
  return (
    <Card>
      <CardHeader>
        <CardTitle>Token Information</CardTitle>
      </CardHeader>
      {proposal?.approved ? (
        <CardContent>
          <p>{tokenInfo?.name}</p>
          <p>{tokenInfo?.symbol}</p>
          <p>{tokenInfo?.decimals}</p>
          <p>{tokenInfo?.totalSupply}</p>
        </CardContent>
      ) : (
        <CardContent>
          <p className="text-muted-foreground text-sm">
            Proposal komunitas belum disetujui
          </p>
        </CardContent>
      )}
    </Card>
  );
}
