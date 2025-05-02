"use client";
import { NumberTicker } from "@/components/magicui/number-ticker";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import useGetTotalFundraising from "@/hooks/getTotalFundraising";
import React from "react";
import { formatUnits } from "viem";

export default function AmountCommunity({ index }: { index: number }) {
  const { totalFundraising } = useGetTotalFundraising(index);
  const formattedValue = totalFundraising
    ? parseFloat(formatUnits(BigInt(totalFundraising as bigint), 2))
    : 0;

  return (
    <section className="space-y-6">
      <div className="bg-card border rounded-lg p-6 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <section className="flex flex-col space-y-2">
            <h1 className="text-muted-foreground font-medium text-sm">
              Total Fundraising
            </h1>
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
            <h1 className="text-muted-foreground font-medium text-sm">
              Liquidity
            </h1>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-semibold">$</span>
              <NumberTicker
                value={formattedValue}
                className="text-2xl font-semibold"
              />
            </div>
          </section>

          <section className="flex flex-col space-y-2">
            <h1 className="text-muted-foreground font-medium text-sm">
              Your Holding
            </h1>
            <div className="flex items-center gap-2">
              <NumberTicker
                value={formattedValue}
                className="text-2xl font-semibold"
              />
              <span className="text-muted-foreground">/ 0%</span>
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
