"use client";
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Wallet } from "lucide-react";
import useGetTokenInfo from "@/hooks/getTokenInfo";
import useGetDetailProposals from "@/hooks/getDetailProposal";
import useGetBalance from "@/hooks/getBalance";
import { formatUnits, parseUnits } from "viem";
import useGetTokenDAOBalance from "@/hooks/getTokenDAOBalance";
import {
  useAccount,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import { useReadContract } from "wagmi";
import { FactoryTokenDAO, FactoryTokenDAOABI } from "@/config/FactoryTokenDAO";
import { IDRXABI, IDRXToken } from "@/config/DAO";
import { toast } from "sonner";

export default function TradeCard({ index }: { index: number }) {
  const { isConnected } = useAccount();
  const { proposal } = useGetDetailProposals(index);
  const { tokenInfo } = useGetTokenInfo({ index });
  const { balanceIDRX } = useGetBalance();

  const { balanceToken } = useGetTokenDAOBalance({
    tokenAddress: tokenInfo?.tokenAddress as `0x${string}`,
  });

  const [amount, setAmount] = React.useState<string>("");
  const [activeTab, setActiveTab] = React.useState<"buy" | "sell">("buy");
  const [insufficientBalance, setInsufficientBalance] =
    React.useState<boolean>(false);

  // Swap calculations
  const {
    data: buyCalculation,
    refetch: refetchBuyCalculation,
    isLoading: isLoadingBuyCalculation,
  } = useReadContract({
    address: FactoryTokenDAO as `0x${string}`,
    abi: FactoryTokenDAOABI,
    functionName: "calculateSwap",
    args: [IDRXToken, tokenInfo?.tokenAddress, parseUnits(amount || "0", 2)],
    query: { enabled: false },
  });

  const {
    data: sellCalculation,
    refetch: refetchSellCalculation,
    isLoading: isLoadingSellCalculation,
  } = useReadContract({
    address: FactoryTokenDAO as `0x${string}`,
    abi: FactoryTokenDAOABI,
    functionName: "calculateSwap",
    args: [tokenInfo?.tokenAddress, IDRXToken, parseUnits(amount || "0", 2)],
    query: { enabled: false },
  });

  // Debounced calculation
  React.useEffect(() => {
    const timeout = setTimeout(() => {
      if (!amount || isNaN(Number(amount))) return;

      if (activeTab === "buy") {
        refetchBuyCalculation();
      } else {
        refetchSellCalculation();
      }
    }, 500);

    return () => clearTimeout(timeout);
  }, [amount, activeTab, refetchBuyCalculation, refetchSellCalculation]);

  // Add balance validation effect
  React.useEffect(() => {
    if (!amount || isNaN(Number(amount))) {
      setInsufficientBalance(false);
      return;
    }

    const amountInWei = parseUnits(amount, 2);
    if (activeTab === "buy") {
      setInsufficientBalance(
        balanceIDRX ? BigInt(amountInWei) > (balanceIDRX as bigint) : false
      );
    } else {
      setInsufficientBalance(
        balanceToken ? BigInt(amountInWei) > (balanceToken as bigint) : false
      );
    }
  }, [amount, activeTab, balanceIDRX, balanceToken]);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(e.target.value);
  };

  const {
    data: hash,
    writeContract,
    isSuccess,
    isError: swapError,
    failureReason: swapFailureReason,
  } = useWriteContract();

  async function confirmBuy() {
    if (insufficientBalance) {
      toast.error("Insufficient IDRX balance");
      return;
    }
    await writeContract({
      address: tokenInfo?.tokenAddress as `0x${string}`,
      abi: IDRXABI,
      functionName: "approve",
      args: [FactoryTokenDAO, parseUnits(amount, 2)],
    });
    await writeContract({
      address: FactoryTokenDAO as `0x${string}`,
      abi: FactoryTokenDAOABI,
      functionName: "swapToken",
      args: [IDRXToken, tokenInfo?.tokenAddress, parseUnits(amount || "0", 2)],
    });
  }

  async function confirmSell() {
    if (insufficientBalance) {
      toast.error(`Insufficient ${tokenInfo?.symbol} balance`);
      return;
    }
    await writeContract({
      address: tokenInfo?.tokenAddress as `0x${string}`,
      abi: IDRXABI,
      functionName: "approve",
      args: [FactoryTokenDAO, parseUnits(amount, 2)],
    });
    await writeContract({
      address: FactoryTokenDAO as `0x${string}`,
      abi: FactoryTokenDAOABI,
      functionName: "swapToken",
      args: [tokenInfo?.tokenAddress, IDRXToken, parseUnits(amount || "0", 2)],
    });
  }

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash: hash || undefined,
    });

  React.useEffect(() => {
    if (isConfirmed && isSuccess) {
      toast(`Swap Succesfull!`);
    }
    if (isConfirmed && swapError) {
      toast.error(`Swap Failed: ${swapFailureReason}`);
    }
  }, [isConfirmed, isSuccess, swapError, swapFailureReason]);

  if (!isConnected) {
    return (
      <div className="border rounded p-4 text-center">
        <h1 className="font-semibold">Connect Your Wallet</h1>
        <p className="text-sm text-gray-400">
          Connect your wallet to buy or sell {tokenInfo?.symbol}
        </p>
      </div>
    );
  }

  console.log(balanceToken);
  console.log(activeTab);
  return (
    <div className="rounded-md border p-5 space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Trade Token Community</h1>
      </div>
      <Tabs
        defaultValue="buy"
        onValueChange={(val) => setActiveTab(val as "buy" | "sell")}
      >
        <TabsList>
          <TabsTrigger value="buy">Buy</TabsTrigger>
          <TabsTrigger value="sell">Sell</TabsTrigger>
        </TabsList>
        <TabsContent value="buy" className="space-y-2">
          <p className="text-sm text-muted-foreground flex items-center justify-end gap-1">
            <Wallet className="w-4 h-4" strokeWidth={1.5} />{" "}
            <span className="font-medium">
              {balanceIDRX
                ? parseFloat(
                    formatUnits(balanceIDRX as bigint, 2)
                  ).toLocaleString()
                : "0"}{" "}
              IDRX
            </span>
          </p>
          <div className="flex items-center justify-between relative">
            <Input
              placeholder="Amount"
              value={amount}
              onChange={handleAmountChange}
            />
            <div className="flex items-center gap-1 absolute right-0 p-2 rounded-r-md bg-secondary">
              <Avatar className="w-5 h-5">
                <AvatarImage src="/images/idrx.svg" />
                <AvatarFallback>IDRX</AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium">IDRX</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Recieve </p>
            <div className="flex items-center gap-5">
              <p className="text-sm font-medium">
                {isLoadingBuyCalculation
                  ? "calculating..."
                  : buyCalculation
                  ? parseFloat(
                      formatUnits(buyCalculation as bigint, 2)
                    ).toLocaleString()
                  : "0"}
              </p>
              <div className="flex items-center gap-1">
                <Avatar className="w-6 h-6">
                  <AvatarImage src={proposal?.image} />
                  <AvatarFallback>{tokenInfo?.symbol}</AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium">{tokenInfo?.symbol}</span>
              </div>
            </div>
          </div>
          <Button
            className="w-full"
            onClick={confirmBuy}
            disabled={
              !amount ||
              isConfirming ||
              isLoadingBuyCalculation ||
              insufficientBalance
            }
          >
            {isConfirming
              ? "Confirming..."
              : insufficientBalance
              ? "Insufficient Balance"
              : "Confirm Buy"}
          </Button>
          {isConfirmed && isSuccess && (
            <p className="text-sm">
              Hash:{" "}
              <a
                href={`https://sepolia-blockscout.lisk.com/tx/${hash}`}
                target="_blank"
              >
                {hash}
              </a>
            </p>
          )}
        </TabsContent>
        <TabsContent value="sell" className="space-y-2">
          <p className="text-sm text-muted-foreground flex items-center justify-end gap-1">
            <Wallet className="w-4 h-4" strokeWidth={1.5} />{" "}
            <span className="font-medium">
              {balanceToken
                ? parseFloat(
                    formatUnits(balanceToken as bigint, 2)
                  ).toLocaleString()
                : "0"}{" "}
              {tokenInfo?.symbol}
            </span>
          </p>
          <div className="flex items-center justify-between relative">
            <Input
              placeholder="Amount"
              value={amount}
              onChange={handleAmountChange}
            />
            <div className="flex items-center gap-1 absolute right-0 p-2 rounded-r-md bg-secondary">
              <Avatar className="w-5 h-5">
                <AvatarImage src={proposal?.image} />
                <AvatarFallback>{tokenInfo?.symbol}</AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium">{tokenInfo?.symbol}</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Recieve </p>
            <div className="flex items-center gap-5">
              <p className="text-sm font-medium">
                {isLoadingSellCalculation
                  ? "calculating..."
                  : sellCalculation
                  ? parseFloat(
                      formatUnits(sellCalculation as bigint, 2)
                    ).toLocaleString()
                  : "0"}
              </p>
              <div className="flex items-center gap-1">
                <Avatar className="w-6 h-6">
                  <AvatarImage src="/images/idrx.svg" />
                  <AvatarFallback>IDRX</AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium">IDRX</span>
              </div>
            </div>
          </div>
          <Button
            className="w-full"
            onClick={confirmSell}
            disabled={
              !amount ||
              isConfirming ||
              isLoadingSellCalculation ||
              insufficientBalance
            }
          >
            {isConfirming
              ? "Confirming..."
              : insufficientBalance
              ? "Insufficient Balance"
              : "Confirm Sell"}
          </Button>
          {isConfirmed && isSuccess && (
            <p className="text-sm">
              Hash:{" "}
              <a
                href={`https://sepolia-blockscout.lisk.com/tx/${hash}`}
                target="_blank"
              >
                {hash}
              </a>
            </p>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
