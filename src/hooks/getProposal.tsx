"use client";

import { DAOABI, DAOToken } from "@/config/DAO";
import React from "react";
import { useReadContract } from "wagmi";

type ProposalCardType = {
  title: string;
  description: string;
  proposer: string;
  requestedAmount: number;
  deadline: number;
  yesVotes: number;
  noVotes: number;
  quorum: number;
  executed: boolean;
  approved: boolean;
  withdrawn: boolean;
  rewardPool: number;
};
export default function useGetProposals() {
  const { data, isLoading, refetch } = useReadContract({
    abi: DAOABI,
    address: DAOToken,
    functionName: "getProposals",
  });

  const proposals = data as ProposalCardType[]; // ✅ cast ke tipe yang tepa

  React.useEffect(() => {
    refetch();
  }, [refetch]);

  return {
    proposals,
    isLoading,
  };
}
