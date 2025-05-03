"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import React from "react";
import Image from "next/image";
import useGetDetailProposals from "@/hooks/getDetailProposal";
// import useGetTokenInfo from "@/hooks/getTokenInfo";

export default function Information({ index }: { index: number }) {
  const { proposal, isLoading } = useGetDetailProposals(index);
  // const { tokenInfo } = useGetTokenInfo({ index });

  return (
    <section className="space-y-5">
      {isLoading && <p>Loading...</p>}
      <div className="flex items-start gap-5">
        <Image
          src={proposal?.image || "/placeholder.jpg"}
          alt="Proposal Image "
          width={100}
          height={100}
          className="rounded-md object-cover mb-3 aspect-square bg-secondary"
        />
        <h1 className="text-3xl font-bold">{proposal?.title}</h1>
      </div>
      <div>
        <p className="text-sm text-muted-foreground">Creator/Builder</p>
        <div className="flex items-center gap-2">
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-medium">@KayzDev</p>
            <p className="text-xs">
              {proposal?.proposer.slice(0, 5)}...
              {proposal?.proposer.slice(-5)}
            </p>
          </div>
        </div>
      </div>
      <p className="text-muted-foreground">{proposal?.description}</p>
    </section>
  );
}
