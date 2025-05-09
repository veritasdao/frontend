"use client";

import { DAOABI, DAOToken } from "@/config/DAO";
import React from "react";
import { useReadContract } from "wagmi";

// type ProposalDetailType = {
//   title: string;
//   description: string;
//   github: string;
//   proposer: string;
//   requestedAmount: number;
//   deadline: number;
//   yesVotes: number;
//   noVotes: number;
//   quorum: number;
//   executed: boolean;
//   approved: boolean;
//   withdrawn: boolean;
//   rewardPool: number;
//   totalYesPower: number;
//   totalNoPower: number;
//   //   totalDonated: number;
// };

type FundraisingData = [bigint, string[], bigint[]] | undefined;

export default function useGetFundraising(index: number) {
  const {
    data: fundraising,
    isLoading,
    refetch,
  } = useReadContract({
    abi: DAOABI,
    address: DAOToken,
    functionName: "getFundraising",
    args: [index], // Ganti dengan index proposal yang sesuai
  }) as {
    data: FundraisingData;
    isLoading: boolean;
    refetch: () => void;
  };

  // const proposals = data as ProposalDetailType[]; // ✅ cast ke tipe yang tepa

  React.useEffect(() => {
    refetch();
  }, [refetch]);

  return {
    fundraising,
    isLoading,
  };
}
