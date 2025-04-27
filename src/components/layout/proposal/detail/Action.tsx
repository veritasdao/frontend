"use client";
import React from "react";
import Amount from "./Amount";
import useGetDetailProposals from "@/hooks/getDetailProposal";
import TabAction from "./TabAction";
import useGetTotalFundraising from "@/hooks/getTotalFundraising";
import StatusBar from "@/components/StatusBar";

export default function Action({ index }: { index: number }) {
  const { proposal, isLoading } = useGetDetailProposals(index);
  const { totalFundraising } = useGetTotalFundraising(index);

  const totalVoter = proposal?.yesVotes + proposal?.noVotes;
  const totalVoterPower = proposal?.totalYesPower + proposal?.totalNoPower;

  if (isLoading) return <p>Loading...</p>;
  return (
    <section className="border border-[#1d4ed8] p-5 rounded-md space-y-7 h-fit">
      <StatusBar index={index} />
      <React.Fragment key={index}>
        <Amount
          requestedAmount={
            proposal?.requestedAmount ? Number(proposal.requestedAmount) : null
          }
          totalFundraising={totalFundraising ? Number(totalFundraising) : null}
          totalVoter={totalVoter ? Number(totalVoter) : 0}
          totalVoterPower={totalVoterPower ? Number(totalVoterPower) : 0}
          totalQuorum={proposal?.quorum ? Number(proposal.quorum) : 0}
          deadline={proposal?.deadline ? Number(proposal.deadline) : 0}
        />
        <hr />
        <TabAction index={index} />
      </React.Fragment>
    </section>
  );
}
