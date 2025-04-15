"use client";
import { DAOABI, DAOToken } from "@/config/DAO";
import React from "react";
import { useReadContract } from "wagmi";

export function useGetTotalDonations(index: number) {
  const {
    data: totalDonations,
    isLoading,
    refetch,
  } = useReadContract({
    abi: DAOABI,
    address: DAOToken,
    functionName: "getTotalDonations",
    args: [index],
  });

  React.useEffect(() => {
    refetch();
  }, [refetch]);

  return {
    totalDonations,
    isLoading,
  };
}
