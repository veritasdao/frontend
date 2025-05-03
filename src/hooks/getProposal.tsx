"use client";

import { DAOABI, DAOToken } from "@/config/DAO";
import React from "react";
import { useReadContract } from "wagmi";

type ProposalCardType = {
  title: string;
  image: string;
  github: string;
  whitepaper: string;
  ownerlink: string;
  description: string;
  motivasi: string;
  rincian: string;
  keuntungan: string;
  tantangan: string;
  dampakdanhasil: string;
  proposer: string;
  requestedAmount: number;
  votingDeadline: number;
  fundraisingDeadline: number;
  yesVotes: number;
  noVotes: number;
  executed: boolean;
  approved: boolean;
  totalYesPower: number;
  totalNoPower: number;
  tokenAddress: string;
  distributed: boolean;
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
