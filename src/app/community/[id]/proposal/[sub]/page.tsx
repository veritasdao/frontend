"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import useGetDetailProposals from "@/hooks/getDetailProposal";
import { formatUnits } from "viem";
import { NumberTicker } from "@/components/magicui/number-ticker";
import moment from "moment";
import Vote from "@/components/layout/proposal/detail/Vote";
import useGetHasVoted from "@/hooks/getHasVoted";
import { useAccount } from "wagmi";

function ProposalContent({ id }: { id: string }) {
  const { proposal, isLoading } = useGetDetailProposals(Number(id));
  const { hasVoted } = useGetHasVoted(Number(id));
  const { isConnected } = useAccount();

  if (isLoading) return <p>Loading...</p>;
  if (!proposal) return <p>Proposal not found</p>;

  const totalVoter = proposal.yesVotes + proposal.noVotes;
  const totalVoterPower = proposal.totalYesPower + proposal.totalNoPower;
  const formattedVoterPower = parseFloat(
    formatUnits(BigInt(totalVoterPower), 2)
  );
  const formattedVotingDeadline = moment(
    Number(proposal.votingDeadline) * 1000
  ).format("LLLL");

  return (
    <div className="container mx-auto py-8">
      <Card className="p-6">
        <div className="space-y-6">
          {/* Proposal Title and Description */}
          <div>
            <h1 className="text-2xl font-bold mb-2">{proposal.title}</h1>
            <p className="text-muted-foreground">{proposal.description}</p>
          </div>

          {/* Voting Information */}
          <div className="grid gap-4">
            <div>
              <h2 className="text-muted-foreground font-medium mb-2">
                Total Votes ({totalVoter} Voters)
              </h2>
              <div className="font-bold text-4xl">
                <NumberTicker value={formattedVoterPower} />
              </div>
              <div className="flex items-center gap-4 text-sm mt-1">
                <p className="flex items-center gap-1">
                  <span className="inline-block w-2 h-2 rounded-full bg-[#14b8a6]"></span>
                  Yes: {proposal.yesVotes}
                </p>
                <p className="flex items-center gap-1">
                  <span className="inline-block w-2 h-2 rounded-full bg-red-500"></span>
                  No: {proposal.noVotes}
                </p>
              </div>
            </div>

            {/* Voting Deadline */}
            <div>
              <p className="text-muted-foreground text-sm">
                Voting will end at {formattedVotingDeadline}
              </p>
            </div>

            {/* Voting Section */}
            {isConnected ? (
              hasVoted ? (
                <div className="py-5 space-y-5">
                  <p>
                    You have already voted on this proposal. Thank you for your
                    participation in the proposal voting.
                  </p>
                </div>
              ) : (
                <Vote index={Number(id)} />
              )
            ) : (
              <p className="text-muted-foreground">
                Please connect your wallet to vote on this proposal.
              </p>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}

type PageParams = {
  id: string;
  sub: string;
};

export default function Page({ params }: { params: Promise<PageParams> }) {
  const unwrappedParams = React.use(params) as PageParams;
  return <ProposalContent id={unwrappedParams.id} />;
}
