"use client";
import { DAOABI, DAOToken } from "@/config/DAO";
import useGetProposals from "@/hooks/getProposal";
import Image from "next/image";
import React from "react";
import { useReadContract } from "wagmi";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function Information() {
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
    <section>
      {isLoading && <p>Loading...</p>}
      {proposals?.map((proposal, index: number) => {
        return (
          <div className="flex gap-5" key={index}>
            {" "}
            <Image
              src={`https://giveth.io/_next/image?url=https%3A%2F%2Fgiveth.mypinata.cloud%2Fipfs%2FQmYdgHKGzuRa3ww9nAZWsoRsvk1kb35yW2x1CKPVm6jVWr&w=1920&q=75`}
              alt="Proposal Image "
              width={100}
              height={100}
              className="rounded-md object-cover mb-3 aspect-square"
            />
            <div className="space-y-2">
              <h1 className="text-3xl font-bold">{proposal.title}</h1>
              <div>
                <p className="text-xs text-muted-foreground">Pemilik Projek:</p>
                <div className="flex items-center gap-2">
                  <Avatar>
                    <AvatarImage src="https://github.com/shadcn.png" />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                  <p className="text-sm text-muted-foreground ">
                    {proposal.proposer.slice(0, 5)}...
                    {proposal.proposer.slice(-5)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </section>
  );
}
