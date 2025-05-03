"use client";

import { DAOABI, DAOToken } from "@/config/DAO";
import React from "react";
import { useReadContract } from "wagmi";

type statusProposalType = {
  isActive: boolean;
  isExecuted: boolean;
  isApproved: boolean;
  timeLeft: number;
};

type statusProposalRawData = [
  boolean, // isActive
  boolean, // isExecuted
  boolean, // isApproved
  number // timeLeft
];
export default function useGetStatusProposal(index: number | null) {
  const { data, isLoading, refetch } = useReadContract({
    abi: DAOABI,
    address: DAOToken,
    functionName: "getProposalStatus",
    args: [index], // Ganti dengan index proposal yang sesuai
  });

  // Transform the array data into a structured object
  const statusProposal: statusProposalType | null = data
    ? {
        isActive: (data as unknown as statusProposalRawData)[0],
        isExecuted: (data as unknown as statusProposalRawData)[1],
        isApproved: (data as unknown as statusProposalRawData)[2],
        timeLeft: (data as unknown as statusProposalRawData)[3],
      }
    : null;
  //   const statusProposal = data as statusProposalType[]; // ✅ cast ke tipe yang tepa

  React.useEffect(() => {
    refetch();
  }, [refetch]);

  return {
    statusProposal,
    isLoading,
  };
}
