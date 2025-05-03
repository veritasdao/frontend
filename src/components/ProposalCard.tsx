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
import useGetStatusProposal from "@/hooks/getStatusProposal";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function ProposalCard() {
  const { proposals, isLoading } = useGetProposals();
  const [index, setIndex] = React.useState<number | null>(null);
  const [filter, setFilter] = React.useState<string>("all");

  React.useEffect(() => {
    if (proposals && proposals.length > 0) {
      setIndex(proposals.length - 1);
    }
  }, [proposals]);

  const { statusProposal } = useGetStatusProposal(index);
  const { data: totalFundraising, refetch } = useReadContract({
    abi: DAOABI,
    address: DAOToken,
    functionName: "getTotalFundraising",
    args: [index],
  });

  React.useEffect(() => {
    refetch();
  }, [refetch]);

  const filteredProposals = React.useMemo(() => {
    if (!proposals) return [];
    return proposals
      .sort((a, b) => Number(b.votingDeadline) - Number(a.votingDeadline))
      .filter((proposal) => {
        // Determine status for each proposal
        let proposalStatus = "";
        if (
          statusProposal?.isExecuted &&
          statusProposal?.isApproved &&
          proposal.yesVotes > proposal.noVotes
        ) {
          proposalStatus = "Fundraising";
        } else if (
          !statusProposal?.isExecuted &&
          !statusProposal?.isApproved &&
          proposal.yesVotes <= proposal.noVotes
        ) {
          proposalStatus = "Voting";
        } else if (
          statusProposal?.timeLeft !== undefined &&
          statusProposal.timeLeft <= 0 &&
          proposal.noVotes > proposal.yesVotes
        ) {
          proposalStatus = "Rejected";
        }
        if (filter === "all") return true;
        if (filter === "elections" && proposalStatus === "Voting") return true;
        if (filter === "fundraising" && proposalStatus === "Fundraising")
          return true;
        return false;
      });
  }, [proposals, filter, statusProposal]);

  return (
    <>
      <div className=" space-y-3">
        <h1 className="text-xl text-muted-foreground">
          Showing{" "}
          {filteredProposals && (
            <strong className="text-primary">
              {filteredProposals.length} Proposals
            </strong>
          )}
        </h1>
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Proposals</SelectItem>
            <SelectItem value="elections">Voting</SelectItem>
            <SelectItem value="fundraising">Fundraising</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="grid xl:grid-cols-3 2xl:grid-cols-4 gap-5">
        {isLoading && <p>Loading...</p>}
        {filteredProposals.map((proposal, index: number) => {
          return (
            <Link
              href={`/proposal/${proposals.length - 1 - index}`}
              key={index}
            >
              <Card className="pt-0 hover:bg-secondary/20 duration-300">
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
                        Total Fundraising Amount
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
                      Funding Not Started Yet
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
