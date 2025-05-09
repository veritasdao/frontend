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
export default function useGetLocked(address: string) {
  const {
    data: locked,
    isLoading,
    refetch,
  } = useReadContract({
    abi: DAOABI,
    address: DAOToken,
    functionName: "lockedIDRX",
    args: [address], // Ganti dengan index proposal yang sesuai
  });

  // const proposals = data as ProposalDetailType[]; // ✅ cast ke tipe yang tepa


  React.useEffect(() => {
    refetch();
  }, [refetch]);

  return {
    locked,
    isLoading,
  };
}
