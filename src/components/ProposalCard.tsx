"use client";
import useGetProposals from "@/hooks/getProposal";
import Image from "next/image";
import React from "react";
// import { formatUnits } from "viem";
import Link from "next/link";
// import { NumberTicker } from "./magicui/number-ticker";
// import { useReadContract } from "wagmi";
// import { DAOABI, DAOToken } from "@/config/DAO";
// import StatusBadge from "./StatusBadge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MagicCard } from "./magicui/magic-card";
import moment from "moment";
import Status from "@/lib/Status";
import { Badge } from "./ui/badge";
import useGetAllProfile from "@/hooks/getAllProfile";

export default function ProposalCard() {
  const { proposals, isLoading } = useGetProposals();
  const { profile: allProfile } = useGetAllProfile();

  // const [index, setIndex] = React.useState<number | null>(null);
  const [filter, setFilter] = React.useState<string>("all");

  // React.useEffect(() => {
  //   if (proposals && proposals.length > 0) {
  //     setIndex(proposals.length - 1);
  //   }
  // }, [proposals]);

  const filteredProposals = React.useMemo(() => {
    if (!proposals) return [];
    return proposals
      .sort((a, b) => Number(b.votingDeadline) - Number(a.votingDeadline))
      .filter((proposal) => {
        if (isLoading || !proposal) {
          return <span className="text-muted-foreground">Loading...</span>;
        }

        const votingDeadline = moment(Number(proposal.votingDeadline) * 1000);
        const fundraisingDeadline = moment(
          Number(proposal.fundraisingDeadline) * 1000
        );
        const now = moment();

        let proposalStatus = "";

        if (votingDeadline.isAfter(now) && !proposal.executed) {
          proposalStatus = "Voting";
        } else if (
          proposal.executed &&
          proposal.yesVotes > proposal.noVotes &&
          fundraisingDeadline.isAfter(now)
        ) {
          proposalStatus = "Fundraising";
        } else if (
          proposal.executed &&
          proposal.yesVotes > proposal.noVotes &&
          fundraisingDeadline.isBefore(now)
        ) {
          proposalStatus = "Approved";
        } else if (
          !proposal.executed &&
          !proposal.approved &&
          (proposal.yesVotes < proposal.noVotes ||
            proposal.yesVotes === proposal.noVotes) &&
          votingDeadline.isBefore(now)
        ) {
          proposalStatus = "Rejected";
        }

        if (filter === "all") return true;
        if (filter === "voting" && proposalStatus === "Voting") return true;
        if (filter === "fundraising" && proposalStatus === "Fundraising")
          return true;
        if (filter === "approved" && proposalStatus === "Approved") return true;
        if (filter === "rejected" && proposalStatus === "Rejected") return true;
        return false;
      });
  }, [proposals, filter, isLoading]);

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
            <SelectItem value="voting">Voting</SelectItem>
            <SelectItem value="fundraising">Fundraising</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="grid xl:grid-cols-3 2xl:grid-cols-4 gap-5">
        {isLoading && <p>Loading...</p>}
        {filteredProposals.map((proposal, index: number) => {
          const username = allProfile.find(
            (profile) => profile.id === proposal.proposer
          )?.username;
          return (
            <Link
              href={`/proposal/${proposals.length - 1 - index}`}
              key={index}
            >
              <MagicCard>
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
                    {filter === "all" && (
                      <Badge variant="outline">
                        <Status index={index} />
                      </Badge>
                    )}
                    <CardTitle className="truncate">{proposal.title}</CardTitle>
                    <CardDescription className="line-clamp-2">
                      Created by @{username}
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
