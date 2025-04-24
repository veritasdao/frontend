"use client";

import { ConnectButton } from "@xellar/kit";
import { Button } from "./ui/button";
import { GlobeLock, Plus, User, Wallet, Zap } from "lucide-react";
import useGetBalance from "@/hooks/getBalance";
import { formatUnits } from "viem";
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

export const ConnectButtonCustom = () => {
  const { balanceIDRX, balanceNative } = useGetBalance();
  const { balanceVotingPower } = useGetVotingPower();

  function formatedBalance(balance: bigint | undefined): string {
    if (!balance) return "0";
    return formatUnits(balance, 2);
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
                <DropdownMenuLabel>Saldo Token</DropdownMenuLabel>
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
                    <p className="text-sm">Hak Suara</p>
                    <Zap />
                  </div>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuLabel>Tambah Saldo Token</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem disabled>
                  <Plus />
                  IDRX Testnet
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
                    Hak Suara
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
