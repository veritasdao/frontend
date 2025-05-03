"use client";
import useGetProposals from "@/hooks/getProposal";
import React from "react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { NumberTicker } from "@/components/magicui/number-ticker";

export default function CommunityCard() {
  const { proposals, isLoading } = useGetProposals();

  const filteredProposals = React.useMemo(() => {
    if (!proposals) return [];
    return proposals
      .filter(
        (proposal) =>
          proposal.tokenAddress !== "0x0000000000000000000000000000000000000000"
      )
      .sort((a, b) => Number(b.votingDeadline) - Number(a.votingDeadline));
  }, [proposals]);

  return (
    <>
      <div className="space-y-3">
        <h1 className="text-xl text-muted-foreground">
          Showing{" "}
          {filteredProposals && (
            <strong className="text-primary">
              {filteredProposals.length} Communities
            </strong>
          )}
        </h1>
      </div>
      <div className="grid xl:grid-cols-3 2xl:grid-cols-4 gap-5">
        {isLoading && <p>Loading...</p>}
        {filteredProposals.map((proposal, index: number) => {
          return (
            <Link
              href={`/community/${proposals.length - 1 - index}`}
              key={index}
            >
              <Card className="hover:bg-secondary/20 duration-300">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={proposal.image} />
                      <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="truncate text-xl">
                        DAO Token
                      </CardTitle>
                      <CardDescription className="line-clamp-2">
                        {proposal.tokenAddress.slice(0, 4)}...
                        {proposal.tokenAddress.slice(-4)}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="line-clamp-2">{proposal.description}</p>
                </CardContent>
                <CardFooter>
                  <div>
                    <p className="text-muted-foreground text-sm">
                      Total pendanaan
                    </p>
                    <div className="flex items-center gap-2">
                      <NumberTicker
                        value={1000000}
                        className="whitespace-pre-wrap text-2xl font-semibold tracking-tighter"
                      />
                      <Avatar className="w-5 h-5">
                        <AvatarImage src="/images/idrx.svg" />
                        <AvatarFallback>CN</AvatarFallback>
                      </Avatar>
                    </div>
                  </div>
                </CardFooter>
              </Card>
            </Link>
          );
        })}
      </div>
    </>
  );
}
