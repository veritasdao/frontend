"use client";
import { NumberTicker } from "@/components/magicui/number-ticker";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import useGetTokenDAOBalance from "@/hooks/getTokenDAOBalance";
import useGetTokenInfo from "@/hooks/getTokenInfo";
import useGetTotalFundraising from "@/hooks/getTotalFundraising";
import React from "react";
import { formatUnits } from "viem";

export default function AmountCommunity({ index }: { index: number }) {
  const { totalFundraising } = useGetTotalFundraising(index);
  const { tokenInfo } = useGetTokenInfo({
    index,
  });
  const { balanceToken } = useGetTokenDAOBalance({
    tokenAddress: tokenInfo?.tokenAddress as `0x${string}`,
  });

  const [idrUsdRate, setIdrUsdRate] = React.useState<number>(0);

  React.useEffect(() => {
    async function fetchIDRUSDRate() {
      try {
        const response = await fetch(
          "https://api.exchangerate-api.com/v4/latest/IDR"
        );
        const data = await response.json();
        const rate = data.rates.USD;
        setIdrUsdRate(rate);
      } catch (error) {
        console.error("Failed to fetch IDR/USD rate:", error);
      }
    }

    fetchIDRUSDRate();
  }, []);

  const formattedValue = totalFundraising
    ? parseFloat(formatUnits(BigInt(totalFundraising as bigint), 2))
    : 0;

  const formattedBalance = balanceToken
    ? parseFloat(formatUnits(balanceToken as bigint, 2))
    : 0;

  const liquidity = formattedValue * idrUsdRate;

  // Calculate token price (IDRX price in USD)
  const tokenPrice = idrUsdRate; // Since IDRX is 1:1 with IDR

  // Calculate market cap using total supply (1 billion) and token price
  const TOTAL_SUPPLY = 1_000_000_000; // 1 billion tokens
  const marketCap = TOTAL_SUPPLY * tokenPrice;

  const percentageHolding =
    balanceToken && tokenInfo?.totalSupply
      ? (Number(formatUnits(balanceToken as bigint, 2)) /
          Number(formatUnits(tokenInfo.totalSupply as bigint, 2))) *
        100
      : 0;

  // if (isLoadingFundraising || isLoadingBalance) {
  //   return (
  //     <section className="space-y-6">
  //       <div className="bg-card border rounded-lg p-6 shadow-sm">
  //         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
  //           {[...Array(3)].map((_, i) => (
  //             <section key={i} className="flex flex-col space-y-2">
  //               <Skeleton className="h-4 w-24" />
  //               <Skeleton className="h-8 w-32" />
  //             </section>
  //           ))}
  //         </div>
  //       </div>
  //       <Skeleton className="h-12 w-48" />
  //     </section>
  //   );
  // }

  return (
    <section className="space-y-6">
      <div className="bg-card border rounded-lg p-6 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <section className="flex flex-col space-y-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <h1 className="text-muted-foreground font-medium text-sm cursor-help">
                    Total Fundraising
                  </h1>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Total amount raised for this community</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <div className="flex items-center gap-3">
              <NumberTicker
                value={formattedValue}
                className="text-2xl font-semibold"
              />
              <div className="flex items-center gap-2 px-3 py-1.5 bg-muted/50 rounded-full">
                <Avatar className="w-5 h-5">
                  <AvatarImage src="/images/idrx.svg" />
                  <AvatarFallback>IDRX</AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium">IDRX</span>
              </div>
            </div>
          </section>

          <section className="flex flex-col space-y-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <h1 className="text-muted-foreground font-medium text-sm cursor-help">
                    Liquidity
                  </h1>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Current liquidity pool value</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-semibold">$</span>
              <NumberTicker
                value={liquidity}
                className="text-2xl font-semibold"
                decimalPlaces={2}
              />
            </div>
          </section>

          <section className="flex flex-col space-y-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <h1 className="text-muted-foreground font-medium text-sm cursor-help">
                    Your Holding
                  </h1>
                </TooltipTrigger>
                <TooltipContent>
                  <p>
                    Your current token holdings and percentage of total supply
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <div className="flex items-center gap-2">
              <NumberTicker
                value={formattedBalance}
                className="text-2xl font-semibold"
              />
              <span className="text-muted-foreground">
                {percentageHolding.toFixed(2)}%
              </span>
            </div>
          </section>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-4xl font-bold">$</span>
        <NumberTicker
          value={marketCap}
          className="text-4xl font-bold"
          decimalPlaces={2}
        />
        <span className="text-muted-foreground text-2xl font-medium">
          Market Cap
        </span>
      </div>
    </section>
  );
}
