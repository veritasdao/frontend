"use client";
import { cn } from "@/lib/utils";
import { Marquee } from "@/components/magicui/marquee";
import Image from "next/image";
import useGetProposals from "@/hooks/getProposal";
import React from "react";

const ReviewCard = ({
  img,
  name,
  description,
  tokenAddress,
}: {
  img: string;
  name: string;
  description: string;
  tokenAddress: string;
}) => {
  return (
    <figure
      className={cn(
        "relative h-full w-64 cursor-pointer overflow-hidden rounded-xl border p-4",
        // light styles
        "border-gray-950/[.1] bg-gray-950/[.01] hover:bg-gray-950/[.05]",
        // dark styles
        "dark:border-gray-50/[.1] dark:bg-gray-50/[.10] dark:hover:bg-gray-50/[.15]"
      )}
    >
      <div className="flex flex-row items-center gap-2">
        <Image
          className="rounded-full"
          width={32}
          height={32}
          alt={name}
          src={img}
          priority={true}
        />
        <div className="flex flex-col">
          <figcaption className="text-sm font-medium dark:text-white">
            {name}
          </figcaption>
          <p className="text-xs font-medium dark:text-white/40">
            {tokenAddress.slice(0, 4)}...{tokenAddress.slice(-4)}
          </p>
        </div>
      </div>
      <blockquote className="mt-2 text-sm line-clamp-2">
        {description}
      </blockquote>
    </figure>
  );
};

export default function Featured() {
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

  if (isLoading) return null;

  return (
    <div className="relative flex w-full flex-col items-center justify-center overflow-hidden">
      {/* <Marquee pauseOnHover className="[--duration:10s]">
        {filteredProposals
          .slice(0, Math.ceil(filteredProposals.length / 2))
          .map((proposal, index) => (
            <ReviewCard
              key={index}
              img={proposal.image}
              name="DAO Token"
              description={proposal.description}
              tokenAddress={proposal.tokenAddress}
            />
          ))}
      </Marquee> */}
      <Marquee reverse pauseOnHover className="[--duration:10s]">
        {filteredProposals
          .slice(Math.ceil(filteredProposals.length / 2))
          .map((proposal, index) => (
            <ReviewCard
              key={index}
              img={proposal.image}
              name="DAO Token"
              description={proposal.description}
              tokenAddress={proposal.tokenAddress}
            />
          ))}
      </Marquee>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-background"></div>
      <div className="pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-background"></div>
    </div>
  );
}
