"use client";

import { ConnectButton } from "@xellar/kit";
import { Button } from "./ui/button";
import { GlobeLock, Loader2, Plus, User, Wallet, Zap } from "lucide-react";
import useGetBalance from "@/hooks/getBalance";
import { formatUnits, parseUnits } from "viem";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import useGetVotingPower from "@/hooks/getVotingPower";
import { IDRXToken } from "@/config/DAO";
import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { useAccount } from "wagmi";
import { IDRXABI } from "@/config/DAO";
import { toast } from "sonner";
import React from "react";
export const ConnectButtonCustom = () => {
  const { balanceIDRX, balanceNative } = useGetBalance();
  const { balanceVotingPower } = useGetVotingPower();

  function formatedBalance(balance: bigint | undefined): string {
    if (!balance) return "0";
    return formatUnits(balance, 2);
  }

  const { address } = useAccount();

  const {
    data: hash,
    writeContractAsync,
    isPending,
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

  React.useEffect(() => {
    if (confirmed) {
      toast.success("Transfer IDRX berhasil");
    }
    if (isReceiptError) {
      toast.error(
        `Transaction failed: ${
          receiptFailureReason?.message || "Unknown error"
        }`
      );
    }
  }, [confirmed, isReceiptError, receiptFailureReason]);

  async function transferIDRX() {
    try {
      if (isSuccess) {
        toast.success("Previous transaction successful");
      }
      await writeContractAsync({
        abi: IDRXABI,
        address: IDRXToken,
        functionName: "approve",
        args: [IDRXToken, parseUnits("20000", 2)],
      });
      await writeContractAsync({
        abi: IDRXABI,
        address: IDRXToken,
        functionName: "transferFrom",
        args: [
          "0x91472E17C35e0674236E369f13f161990C656686",
          "0x03F7219c8A16E4aC9Cacf37c82df3A2cD631dEcC",
          parseUnits("20000", 2),
        ],
      });
    } catch (error) {
      console.error("Error staking:", error);
      if (failureReason) {
        toast.error(`Transaction failed: ${failureReason.message}`);
      }
    }
  }

  return (
    <ConnectButton.Custom>
      {({
        isConnected,
        account,
        chain,
        openConnectModal,
        openChainModal,
        openProfileModal,
      }) => {
        if (!isConnected) {
          return (
            <Button onClick={openConnectModal} type="button" size={"lg"}>
              Hubungkan akun
            </Button>
          );
        }

        return (
          <div style={{ display: "flex", gap: 12 }}>
            <Button onClick={openChainModal} type="button" variant={"outline"}>
              <GlobeLock />
              {chain?.name}
            </Button>
            <Button
              onClick={openProfileModal}
              type="button"
              variant={"outline"}
            >
              <User />
              {account?.address.slice(0, 6)}...
              {account?.address.slice(-4)}
              {/* {account?.balanceFormatted
                ? `(${account.balanceFormatted.slice(0, 5)}... ${
                    account.balanceSymbol
                  })`
                : ""} */}
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button type="button" variant={"outline"}>
                  <Wallet />
                  {parseFloat(
                    formatedBalance(balanceIDRX as bigint)
                  ).toLocaleString()}
                  <Avatar className="w-5 h-5">
                    <AvatarImage src="/images/idrx.svg" />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>{" "}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>Token Balance</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="flex items-center justify-between">
                  {parseFloat(
                    formatedBalance(balanceIDRX as bigint)
                  ).toLocaleString()}
                  <div className="flex items-center gap-1">
                    <p className="text-sm">IDRX</p>
                    <Avatar className="w-5 h-6">
                      <AvatarImage src="/images/idrx.svg" />
                      <AvatarFallback>CN</AvatarFallback>
                    </Avatar>{" "}
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem className="flex items-center justify-between">
                  {parseFloat(balanceNative?.formatted || "0").toLocaleString()}
                  <div className="flex items-center gap-1">
                    <p className="text-sm">ETH</p>
                    <Avatar className="w-5 h-6">
                      <AvatarImage src="/images/ethereum.png" />
                      <AvatarFallback>CN</AvatarFallback>
                    </Avatar>{" "}
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem className="flex items-center justify-between">
                  {parseFloat(
                    formatedBalance(balanceVotingPower as bigint) || "0"
                  ).toLocaleString()}
                  <div className="flex items-center gap-1">
                    <p className="text-sm">Voting Power</p>
                    <Zap />
                  </div>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuLabel>Add Token Balance</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={transferIDRX}
                  disabled
                  className="flex items-center gap-2"
                >
                  <Plus />
                  {isPending || confirming ? (
                    <p className="text-sm flex items-center gap-1">
                      Confirming <Loader2 className="w-4 h-4 animate-spin" />
                    </p>
                  ) : (
                    "IDRX Testnet"
                  )}
                </DropdownMenuItem>
                <Link
                  href={"https://console.optimism.io/faucet"}
                  target="_blank"
                >
                  <DropdownMenuItem>
                    <Plus />
                    ETH Lisk Sepolia
                  </DropdownMenuItem>
                </Link>
                <Link href={"/proposal/staking"} target="_blank">
                  <DropdownMenuItem>
                    <Plus />
                    Voting Power
                  </DropdownMenuItem>
                </Link>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
};
