"use client";
import useGetProposals from "@/hooks/getProposal";
import Image from "next/image";
import React from "react";
import { formatUnits } from "viem";
import Link from "next/link";
import { NumberTicker } from "./magicui/number-ticker";
import { useReadContract } from "wagmi";
import { DAOABI, DAOToken } from "@/config/DAO";
import StatusBadge from "./StatusBadge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function ProposalCard() {
  const { proposals, isLoading } = useGetProposals();
  const [index, setIndex] = React.useState<number | null>(null);

  React.useEffect(() => {
    if (proposals && proposals.length > 0) {
      setIndex(proposals.length - 1);
    }
  }, [proposals]);

  const { data: totalFundraising, refetch } = useReadContract({
    abi: DAOABI,
    address: DAOToken,
    functionName: "getTotalFundraising",
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
                <Card className="pt-0">
                  <Image
                    src={proposal.image}
                    alt="Proposal Image"
                    width={1920}
                    height={1080}
                    className="object-cover aspect-video rounded-md"
                    priority={true}
                  />
                  <CardHeader>
                    <StatusBadge index={index} />
                    <CardTitle className="truncate">{proposal.title}</CardTitle>
                    <CardDescription className="line-clamp-2">
                      {proposal.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {proposal.approved ? (
                      <div className="mt-2">
                        <p className="text-xs text-muted-foreground">
                          Jumlah Penggalangan Dana
                        </p>
                        <NumberTicker
                          className="font-bold text-3xl"
                          value={
                            totalFundraising
                              ? parseFloat(
                                  formatUnits(
                                    BigInt(totalFundraising as bigint),
                                    2
                                  )
                                )
                              : 0
                          }
                        />
                        IDRX
                      </div>
                    ) : (
                      <p className="text-sm text-[#3b82f6]">
                        Pendanaan Belum Dimulai
                      </p>
                    )}
                  </CardContent>
                </Card>
              </Link>
            );
          })}
      </div>
    </>
  );
}
