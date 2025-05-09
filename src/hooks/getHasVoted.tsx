"use client";
import { DAOABI, DAOToken } from "@/config/DAO";
import React from "react";
import { useAccount, useReadContract } from "wagmi";

export default function useGetHasVoted(index: number) {
  const { address } = useAccount();

  const { data: hasVoted, refetch: refetchHasVoted } = useReadContract({
    address: DAOToken,
    abi: DAOABI,
    functionName: "hasVoted",
    args: [index, address],
  });

  React.useEffect(() => {
    refetchHasVoted();
  }, [refetchHasVoted]);

  return {
    hasVoted,
  };
}
