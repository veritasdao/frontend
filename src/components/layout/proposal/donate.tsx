"use client";
import { Button } from "@/components/ui/button";
import { DAOABI, DAOToken, IDRXABI, IDRXToken } from "@/config/DAO";
import React from "react";
import { formatUnits, parseUnits } from "viem";
import {
  useAccount,
  useReadContract,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";

export default function Donate() {
  const { address } = useAccount();
  const {
    data: hash,
    writeContractAsync,
    isPending,
    isError,
    isSuccess,
    failureReason,
  } = useWriteContract();

  const { isLoading: confirming, isSuccess: confirmed } =
    useWaitForTransactionReceipt({
      hash: hash,
    });

  async function sendDonation() {
    try {
      await writeContractAsync({
        abi: IDRXABI,
        address: IDRXToken,
        functionName: "approve",
        args: [DAOToken, parseUnits("1000", 2)],
      });
      await writeContractAsync({
        abi: DAOABI,
        address: DAOToken,
        functionName: "donate",
        args: [0, parseUnits("1000", 2)],
      });
    } catch (error) {
      console.error("Error sending donation:", error);
    }
  }

  const { data: balanceIDRX } = useReadContract({
    abi: IDRXABI,
    address: IDRXToken,
    functionName: "balanceOf",
    args: [address],
  });
  return (
    <div>
      <h1>donate</h1>
      {balanceIDRX ? (
        <p>BALANCE IDRX: {formatUnits(BigInt(balanceIDRX as bigint), 2)}</p>
      ) : null}
      <Button onClick={sendDonation} disabled={isPending}>
        {isPending ? "Sending..." : "Send Donation"}
      </Button>
      {isError && <p>Error: {failureReason?.toString()}</p>}
      {isSuccess && !confirming && <p>Transaction sent: {hash}</p>}
      {confirming && <p>Confirming transaction...</p>}
      {confirmed && <p>Transaction confirmed!</p>}
      {isSuccess && confirming && <p>Transaction confirmed!</p>}
    </div>
  );
}
