import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";

export default function Hero() {
  return (
    <section>
      <h1 className="text-5xl font-bold">
        On-chain Proposals, <br />
        Real-world Impact
      </h1>
      <p className="text-muted-foreground w-1/2 mt-2">
        Find proposals that are worth supporting. Vote, fund, and help projects.
        All proposals here are validated on the LISK blockchain. Voting uses
        IDRX to support ideas you believe in.
      </p>
      <Link href={"/proposal/create"}>
        <Button className="mt-4" size="lg">
          Create Proposal
        </Button>
      </Link>
    </section>
  );
}
