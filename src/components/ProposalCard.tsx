"use client";
import useGetProposals from "@/hooks/getProposal";
import Image from "next/image";
import React from "react";
import moment from "moment";
import { formatUnits } from "viem";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { NumberTicker } from "./magicui/number-ticker";
// import { useReadContract } from "wagmi";
// import { DAOABI, DAOToken } from "@/config/DAO";

export default function ProposalCard() {
  const { proposals, isLoading } = useGetProposals();
  // const proposal = proposals?.map((image) => image.image);
  // console.log(proposal);
  // const [index, setIndex] = React.useState<number | null>(null);

  // React.useEffect(() => {
  //   if (proposals && proposals.length > 0) {
  //     setIndex(proposals.length - 1);
  //   }
  // }, [proposals]);

  // const {
  //   data: totalDonations,
  //   isLoading: loadingTotalDonations,
  //   refetch,
  // } = useReadContract({
  //   abi: DAOABI,
  //   address: DAOToken,
  //   functionName: "getTotalDonations",
  //   args: [index],
  // });

  // React.useEffect(() => {
  //   refetch();
  // }, [refetch]);

  return (
    <>
      <h1 className="text-xl text-muted-foreground">
        Menampilkan{" "}
        {proposals && (
          <strong className="text-primary">{proposals.length} Proposal</strong>
        )}
      </h1>
      <div className="grid xl:grid-cols-3 2xl:grid-cols-4 gap-5">
        {isLoading && <p>Loading...</p>}
        {proposals
          ?.sort((a, b) => Number(b.deadline) - Number(a.deadline))
          .map((proposal, index: number) => {
            return (
              <Link
                href={`/proposal/${proposals.length - 1 - index}`}
                key={index}
              >
                <div className="rounded-md space-y-1 bg-gradient-to-br from-[#3b82f6] via-black to-black hover:from-black hover:to-[#1d4ed8] p-5 duration-300 transition ease-in-out">
                  <Image
                    src={proposal.image}
                    alt="Proposal Image "
                    width={500}
                    height={300}
                    className="rounded-md object-cover mb-3 aspect-video"
                    priority={true}
                  />
                  <h2 className="text-lg font-semibold capitalize ine-clamp-2">
                    {proposal.title}
                  </h2>
                  <p className="text-sm text-muted-foreground ">
                    creator: {proposal.proposer.slice(0, 5)}...
                    {proposal.proposer.slice(-5)}
                  </p>
                  <p className="line-clamp-2 mb-3 text-sm">
                    {proposal.description}
                  </p>
                  <div className="text-end">
                    <p className="text-xs text-muted-foreground">
                      Jumlah Terkumpul
                    </p>
                    <NumberTicker
                      className="font-bold text-3xl"
                      value={parseFloat(
                        formatUnits(BigInt(proposal.requestedAmount), 2)
                      )}
                    />
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
