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
        <p>Jumlah (IDRX)</p>
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
        placeholder="Contoh: 10000"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <Button
        onClick={sendDonation}
        disabled={isPending || confirming || confirmed || !amount}
      >
        {isPending || confirming ? (
          <p className="flex gap-1">
            Mengkonfirmasi <LoaderCircle className="animate-spin" />
          </p>
        ) : (
          "Konfirmasi Fundraising"
        )}
      </Button>

      <div className="max-w-5xl mx-auto text-center">
        {confirming && <p>Mengkonfirmasi transasi...</p>}
        {confirmed && <p>Transaksi disetujui!</p>}
        {isError && <p>Error: {failureReason?.toString()}</p>}
        {isReceiptError && <p>Error: {receiptFailureReason?.toString()}</p>}
        {isSuccess && confirmed && <p>Transaksi telah dikonfimasi!</p>}
        {isSuccess && !confirming && (
          <div>
            <Link
              href={`https://sepolia-blockscout.lisk.com/tx/${hash}`}
              target="_blank"
            >
              <Button variant={"outline"}>Lihat Detail Transaksi</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
