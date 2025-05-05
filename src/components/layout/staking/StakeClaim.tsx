import { NumberTicker } from "@/components/magicui/number-ticker";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle, CardHeader } from "@/components/ui/card";
import React from "react";

export default function StakeClaim() {
  return (
    <Card>
      <CardHeader>
        <span className="text-muted-foreground text-sm">
          This feature will be available soon
        </span>
        <CardTitle className="text-center">Available Rewards</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="font-bold text-4xl flex items-center justify-center gap-2">
          <Avatar>
            <AvatarImage src="/images/idrx.svg" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <NumberTicker
            // value={
            //   totalVoter !== null
            //     ? parseFloat(formatUnits(BigInt(totalVoterPower), 2))
            //     : 0
            // }
            value={0}
          />
          <span className="text-muted-foreground">IDRX</span>
        </div>
        <Button className="w-full" disabled>
          Claim Rewards
        </Button>
      </CardContent>
    </Card>
  );
}
