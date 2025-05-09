"use client";
import useGetTokenInfo from "@/hooks/getTokenInfo";
import useGetTotalFundraising from "@/hooks/getTotalFundraising";
import React from "react";
import { formatUnits } from "viem";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
// import useGetDetailProposals from "@/hooks/getDetailProposal";

export default function TokenCommunity({ index }: { index: number }) {
  //   const { proposal } = useGetDetailProposals(index);
  const { tokenInfo } = useGetTokenInfo({ index });
  const { totalFundraising } = useGetTotalFundraising(index);
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

  // Calculate token price (IDRX price in USD)
  const tokenPrice = idrUsdRate; // Since IDRX is 1:1 with IDR

  // Calculate liquidity (Total Fundraising in USD)
  const liquidity = formattedValue * tokenPrice;

  // Calculate market cap (Total Supply × Token Price)
  const TOTAL_SUPPLY = 1_000_000_000; // 1 billion tokens
  const marketCap = TOTAL_SUPPLY * tokenPrice;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Token Community Information</CardTitle>
        <CardDescription>
          The community will have complete control over the tokens created by
          this proposal.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="space-y-5">
          <section>
            <div>
              <h3 className="text-lg font-semibold">$ {tokenInfo?.symbol}</h3>
              <p className="text-muted-foreground text-sm">
                Contract Address: {tokenInfo?.tokenAddress.slice(0, 6)}...
                {tokenInfo?.tokenAddress.slice(-4)}
              </p>
            </div>
          </section>
          <hr />
          <section className="space-y-2">
            <h3 className="text-lg font-semibold">Token Allocation</h3>
            <div className="grid grid-cols-8 text-xs text-center ">
              <div className="col-span-2 space-y-1">
                <div className="bg-[#2563eb] rounded-l-md h-5" />
                <p>Team 5%</p>
              </div>
              <div className="col-span-3 space-y-1">
                <div className=" bg-[#1e40af] h-5" />
                <p>Community 55%</p>
              </div>
              <div className="col-span-3 space-y-1">
                <div className=" bg-[#172554] h-5 rounded-r-md" />
                <p>Public 40%</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Total Supply:{" "}
              {tokenInfo?.totalSupply
                ? parseFloat(
                    formatUnits(tokenInfo.totalSupply as bigint, 2)
                  ).toLocaleString()
                : "0"}{" "}
              <span className="text-xs text-muted-foreground">
                {tokenInfo?.symbol}
              </span>
            </p>
          </section>
          <hr />
          <section className="grid grid-cols-2 gap-5">
            <div>
              <h3 className="text-muted-foreground text-sm">Liquidity</h3>
              <p className="text-xl font-semibold">$ {liquidity.toFixed(2)}</p>
            </div>
            <div>
              <h3 className="text-muted-foreground text-sm">Market Cap</h3>
              <p className="text-xl font-semibold">$ {marketCap.toFixed(2)}</p>
            </div>
          </section>
        </div>
      </CardContent>
    </Card>
  );
}
