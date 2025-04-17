import React from "react";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatUnits } from "viem";
import { NumberTicker } from "@/components/magicui/number-ticker";

export default function Amount({
  requestedAmount,
  totalDonation,
  rewardPool,
  totalVoter,
  totalQuorum,
}: {
  requestedAmount: number | null;
  totalDonation: number | null;
  rewardPool: number | null;
  totalVoter: number | 0;
  totalQuorum: number | 0;
}) {
  // Hitung persentase progress
  const progressValue =
    requestedAmount && totalDonation
      ? Number(BigInt(totalDonation) * BigInt(100)) /
        Number(BigInt(requestedAmount))
      : 0;

  return (
    <section className="grid gap-5">
      <div className="space-y-2">
        <h1 className="text-muted-foreground font-medium">Total Donasi</h1>
        <div className="relative flex items-center justify-center">
          <Progress value={progressValue} className="h-10 rounded-md" />
          <p className="flex items-center gap-2 absolute text-primary font-bold">
            <Avatar className="w-5 h-5">
              <AvatarImage src="/images/idrx.svg" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            {requestedAmount !== null && totalDonation !== null
              ? formatUnits(BigInt(totalDonation), 2)
              : "0"}
            /
            {requestedAmount !== null
              ? formatUnits(BigInt(requestedAmount), 2)
              : "0"}{" "}
            IDRX
          </p>
        </div>
      </div>

      <div>
        <h1 className="text-muted-foreground font-medium">
          Total Reward Pool ({totalVoter} Voter)
        </h1>
        <div className="font-bold text-4xl">
          <NumberTicker
            value={
              rewardPool !== null
                ? parseFloat(formatUnits(BigInt(rewardPool), 2))
                : 0
            }
          />{" "}
          IDRX
        </div>
      </div>

      <div>
        <h1 className="text-muted-foreground font-medium">Total Suara</h1>
        <div className="font-bold text-4xl">
          <NumberTicker
            value={
              rewardPool !== null
                ? parseFloat(formatUnits(BigInt(rewardPool), 2))
                : 0
            }
          />
          <span className="font-normal text-[#1d4ed8]">/</span>
          <NumberTicker
            value={
              totalQuorum !== null
                ? parseFloat(formatUnits(BigInt(totalQuorum), 2))
                : 0
            }
          />
        </div>
      </div>
    </section>
  );
}
