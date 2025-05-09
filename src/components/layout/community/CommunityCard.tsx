"use client";
import useGetProposals from "@/hooks/getProposal";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { NumberTicker } from "@/components/magicui/number-ticker";
import { MagicCard } from "@/components/magicui/magic-card";

export default function CommunityCard() {
  const { proposals, isLoading } = useGetProposals();

  const filteredProposals = React.useMemo(() => {
    if (!proposals) return [];
    return (
      proposals
        // .filter(
        //   (proposal) =>
        //     proposal.tokenAddress !== "0x0000000000000000000000000000000000000000"
        // )
        .sort((a, b) => Number(b.votingDeadline) - Number(a.votingDeadline))
    );
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
              <MagicCard>
                <Card className="pt-0 hover:bg-secondary/20 duration-300">
                  <Image
                    src={proposal.image}
                    alt="Community Image"
                    width={1920}
                    height={1080}
                    className="object-cover aspect-video rounded-md"
                    priority={true}
                  />
                  <CardHeader>
                    <CardTitle className="truncate">{proposal.title}</CardTitle>
                    <CardDescription className="text-sm">
                      Token Address: {proposal.tokenAddress.slice(0, 4)}...
                      {proposal.tokenAddress.slice(-4)}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="line-clamp-1 text-sm">
                      {proposal.description}
                    </p>
                  </CardContent>
                </Card>
              </MagicCard>
            </Link>
          );
        })}
      </div>
    </>
  );
}
