import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DAOABI, DAOToken, IDRXABI, IDRXToken } from "@/config/DAO";
import { LoaderCircle, Wallet } from "lucide-react";
import Link from "next/link";
import React from "react";
import { formatUnits, parseUnits } from "viem";
import {
  useAccount,
  useReadContract,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";

export default function Fundraising({ index }: { index: number }) {
  const { address } = useAccount();
  const [amount, setAmount] = React.useState<string>("");

  const {
    data: hash,
    writeContractAsync,
    isPending,
    isError,
    isSuccess,
    failureReason,
  } = useWriteContract();

  const {
    isLoading: confirming,
    isSuccess: confirmed,
    isError: isReceiptError,
    failureReason: receiptFailureReason,
  } = useWaitForTransactionReceipt({
    hash: hash,
  });

  async function sendDonation() {
    try {
      await writeContractAsync({
        abi: IDRXABI,
        address: IDRXToken,
        functionName: "approve",
        args: [DAOToken, parseUnits(amount || "0", 2)],
      });
      await writeContractAsync({
        abi: DAOABI,
        address: DAOToken,
        functionName: "fundraising",
        args: [index, parseUnits(amount || "0", 2)],
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
    <div className="border p-5 rounded-md space-y-3">
      <div className="flex justify-between">
        <p className="text-sm">Amount (IDRX)</p>
        {balanceIDRX ? (
          <p className="text-muted-foreground flex gap-1">
            <Wallet strokeWidth={1} />
            <span className="font-bold">
              {parseFloat(
                formatUnits(BigInt(balanceIDRX as bigint), 2)
              ).toLocaleString()}
            </span>{" "}
            IDRX
          </p>
        ) : (
          <p className="text-muted-foreground flex gap-1">
            <Wallet /> 0 IDRX
          </p>
        )}
      </div>
      <Input
        placeholder="Example: 10000"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <Button
        className="w-full"
        variant={
          Number(amount) > Number(formatUnits(BigInt(balanceIDRX as bigint), 2))
            ? "outline"
            : "default"
        }
        onClick={sendDonation}
        disabled={
          isPending ||
          confirming ||
          confirmed ||
          !amount ||
          Number(amount) > Number(formatUnits(BigInt(balanceIDRX as bigint), 2))
        }
      >
        {isPending || confirming ? (
          <p className="flex gap-1">
            Confirming <LoaderCircle className="animate-spin" />
          </p>
        ) : Number(amount) >
          Number(formatUnits(BigInt(balanceIDRX as bigint), 2)) ? (
          <p className="text-destructive">Insufficient Balance IDRX</p>
        ) : (
          "Confirm Fundraising"
        )}
      </Button>

      <section className="max-w-5xl mx-auto text-center space-y-5">
        <div>
          {confirming && <p>Confirming transaction...</p>}
          {confirmed && <p>Transaction confirmed!</p>}
          {isError && <p>Error: {failureReason?.toString()}</p>}
          {isReceiptError && <p>Error: {receiptFailureReason?.toString()}</p>}
          {isSuccess && confirmed && <p>Transaction has been confirmed!</p>}
        </div>
        {isSuccess && !confirming && (
          <div>
            <Link
              href={`https://sepolia-blockscout.lisk.com/tx/${hash}`}
              target="_blank"
            >
              <Button variant={"outline"}>View Transaction Details</Button>
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}
