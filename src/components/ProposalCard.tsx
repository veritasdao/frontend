"use client";
import useGetProposals from "@/hooks/getProposal";
import Image from "next/image";
import React from "react";
import moment from "moment";
import { formatUnits } from "viem";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { NumberTicker } from "./magicui/number-ticker";
import { useReadContract } from "wagmi";
import { DAOABI, DAOToken } from "@/config/DAO";

export default function ProposalCard() {
  const { proposals, isLoading } = useGetProposals();
  const [index, setIndex] = React.useState<number | null>(null);

  React.useEffect(() => {
    if (proposals && proposals.length > 0) {
      setIndex(proposals.length - 1);
    }
  }, [proposals]);

  const {
    data: totalDonations,
    isLoading: loadingTotalDonations,
    refetch,
  } = useReadContract({
    abi: DAOABI,
    address: DAOToken,
    functionName: "getTotalDonations",
    args: [index],
  });

  React.useEffect(() => {
    refetch();
  }, [refetch]);

  return (
    <>
      <h1 className="text-xl text-muted-foreground">
        Menampilkan{" "}
        {proposals && (
          <strong className="text-primary">{proposals.length} Proposal</strong>
        )}
      </h1>
      <div className="grid grid-cols-4 gap-5">
        {isLoading && <p>Loading...</p>}
        {proposals?.map((proposal, index: number) => {
          return (
            <Link href={`/proposal/${index}`} key={index}>
              <div className="rounded-md bg-gradient-to-br from-[#1d4ed8] via-black to-black hover:from-black hover:to-[#1d4ed8] p-5 duration-300 transition ease-in-out">
                <Image
                  src={`https://giveth.io/_next/image?url=https%3A%2F%2Fgiveth.mypinata.cloud%2Fipfs%2FQmYdgHKGzuRa3ww9nAZWsoRsvk1kb35yW2x1CKPVm6jVWr&w=1920&q=75`}
                  alt="Proposal Image "
                  width={500}
                  height={300}
                  className="rounded-md object-cover mb-3"
                />
                <h2 className="text-lg font-semibold capitalize">
                  {proposal.title}
                </h2>
                <div className="flex items-center gap-2">
                  <Avatar>
                    <AvatarImage src="https://github.com/shadcn.pnsg" />
                    <AvatarFallback>
                      {proposal.proposer.charAt(1)}
                    </AvatarFallback>
                  </Avatar>
                  <p className="text-sm text-muted-foreground ">
                    {proposal.proposer.slice(0, 5)}...
                    {proposal.proposer.slice(-5)}
                  </p>
                </div>
                <p className="line-clamp-2 mb-3">{proposal.description}</p>
                <div className="text-end">
                  <p className="text-xs text-muted-foreground">
                    Jumlah Terkumpul
                  </p>
                  {!loadingTotalDonations && (
                    <NumberTicker
                      className="font-bold text-3xl"
                      value={
                        typeof totalDonations === "bigint"
                          ? parseFloat(formatUnits(totalDonations, 2))
                          : 0
                      }
                    />
                  )}
                  IDRX
                </div>
                <p className="text-sm text-muted-foreground text-end">
                  berakhir:{" "}
                  {moment(Number(proposal.deadline) * 1000).format("LLL")}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </>
  );
}
