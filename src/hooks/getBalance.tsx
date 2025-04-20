"use client";
import { IDRXABI, IDRXToken } from "@/config/DAO";
import React from "react";
import { useAccount, useBalance, useReadContract } from "wagmi";

export default function useGetBalance() {
  const { address } = useAccount();

  const { data: balanceNative, refetch: refetchBalanceNative } = useBalance({
    address: address,
  });

  console.log(balanceNative);

  const { data: balanceIDRX, refetch: refetchBalanceIDRX } = useReadContract({
    address: IDRXToken,
    abi: IDRXABI,
    functionName: "balanceOf",
    args: [address],
  });

  React.useEffect(() => {
    refetchBalanceNative();
    refetchBalanceIDRX();
  }, [refetchBalanceNative, refetchBalanceIDRX]);

  return {
    balanceNative,
    balanceIDRX,
  };
}
