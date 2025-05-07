"use client";
import React from "react";
import Amount from "./Amount";
import useGetDetailProposals from "@/hooks/getDetailProposal";
import TabAction from "./TabAction";
import useGetTotalFundraising from "@/hooks/getTotalFundraising";
import StatusBar from "@/components/StatusBar";
import { Card } from "@/components/ui/card";

export default function Action({ index }: { index: number }) {
  const { proposal, isLoading } = useGetDetailProposals(index);
  const { totalFundraising } = useGetTotalFundraising(index);

  const totalVoter = proposal?.yesVotes + proposal?.noVotes;
  const totalVoterPower = proposal?.totalYesPower + proposal?.totalNoPower;

  if (isLoading) return <p>Loading...</p>;
  return (
    <Card className=" p-5 rounded-md h-fit">
      <StatusBar index={index} />
      <React.Fragment key={index}>
        <Amount
          requestedAmount={
            proposal?.requestedAmount ? BigInt(proposal.requestedAmount) : null
          }
          totalFundraising={
            totalFundraising ? BigInt(totalFundraising as bigint) : null
          }
          totalVoter={totalVoter ? Number(totalVoter) : 0}
          totalVoterPower={
            totalVoterPower ? BigInt(totalVoterPower) : BigInt(0)
          }
          votingDeadline={
            proposal?.votingDeadline ? Number(proposal.votingDeadline) : 0
          }
          fundraisingDeadline={
            proposal?.fundraisingDeadline
              ? Number(proposal.fundraisingDeadline)
              : 0
          }
          yesVotes={proposal?.yesVotes ? Number(proposal.yesVotes) : 0}
          noVotes={proposal?.noVotes ? Number(proposal.noVotes) : 0}
          isExecuted={proposal?.executed}
        />
        <hr />
        <TabAction index={index} />
      </React.Fragment>
    </Card>
  );
}
