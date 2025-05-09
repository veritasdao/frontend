"use client";
import { AirdropABI, AirdropToken } from "@/config/Airdrop";
import React from "react";
import { useAccount, useReadContract } from "wagmi";

export default function useGetClaimedAirdrop() {
  const { address } = useAccount();

  const { data: hasClaimed, refetch: refetchClaimedAirdrop } = useReadContract({
    address: AirdropToken,
    abi: AirdropABI,
    functionName: "hasClaimed",
    args: [address],
  });

  React.useEffect(() => {
    refetchClaimedAirdrop();
  }, [refetchClaimedAirdrop]);

  return {
    hasClaimed,
  };
}
