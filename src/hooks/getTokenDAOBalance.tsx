"use client";
import { IDRXABI, IDRXToken } from "@/config/DAO";
import React from "react";
import { useAccount, useBalance, useReadContract } from "wagmi";

export default function useGetTokenDAOBalance({
  tokenAddress,
}: {
  tokenAddress: `0x${string}`;
}) {
  const { address } = useAccount();

  const {
    data: balanceToken,
    refetch: refetchBalanceToken,
    isLoading,
  } = useReadContract({
    address: tokenAddress,
    abi: IDRXABI,
    functionName: "balanceOf",
    args: [address],
  });

  React.useEffect(() => {
    refetchBalanceToken();
  }, [refetchBalanceToken]);

  return { balanceToken, isLoading };
}
