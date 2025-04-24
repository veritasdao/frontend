"use client";
import { DAOABI, DAOToken } from "@/config/DAO";
import React from "react";
import { useAccount, useReadContract } from "wagmi";

export default function useGetVotingPower() {
  const { address } = useAccount();

  const { data: balanceVotingPower, refetch: refetchBalanceVoting } =
    useReadContract({
      address: DAOToken,
      abi: DAOABI,
      functionName: "getUserVotingPower",
      args: [address],
    });

  React.useEffect(() => {
    refetchBalanceVoting();
  }, [refetchBalanceVoting]);

  return {
    balanceVotingPower,
  };
}
