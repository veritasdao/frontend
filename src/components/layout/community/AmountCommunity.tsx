"use client";
import { NumberTicker } from "@/components/magicui/number-ticker";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import useGetTokenDAOBalance from "@/hooks/getTokenDAOBalance";
import useGetTokenInfo from "@/hooks/getTokenInfo";
import useGetTotalFundraising from "@/hooks/getTotalFundraising";
import { formatUnits } from "viem";

export default function AmountCommunity({ index }: { index: number }) {
  const { totalFundraising, isLoading: isLoadingFundraising } =
    useGetTotalFundraising(index);
  const { tokenInfo } = useGetTokenInfo({
    index,
  });
  const { balanceToken, isLoading: isLoadingBalance } = useGetTokenDAOBalance({
    tokenAddress: tokenInfo?.tokenAddress as `0x${string}`,
  });

  const formattedValue = totalFundraising
    ? parseFloat(formatUnits(BigInt(totalFundraising as bigint), 2))
    : 0;

  const formattedBalance = balanceToken
    ? parseFloat(formatUnits(balanceToken as bigint, 2))
    : 0;

  const percentageHolding =
    balanceToken && tokenInfo?.totalSupply
      ? (Number(formatUnits(balanceToken as bigint, 2)) /
          Number(formatUnits(tokenInfo.totalSupply as bigint, 2))) *
        100
      : 0;

  if (isLoadingFundraising || isLoadingBalance) {
    return (
      <section className="space-y-6">
        <div className="bg-card border rounded-lg p-6 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <section key={i} className="flex flex-col space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-8 w-32" />
              </section>
            ))}
          </div>
        </div>
        <Skeleton className="h-12 w-48" />
      </section>
    );
  }

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
                value={formattedValue}
                className="text-2xl font-semibold"
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
        <NumberTicker value={6003.722} className="text-4xl font-bold" />
        <span className="text-muted-foreground text-2xl font-medium">
          Market Cap
        </span>
      </div>
    </section>
  );
}
