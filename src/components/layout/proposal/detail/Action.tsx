"use client";
import React from "react";
import Amount from "./Amount";
import useGetDetailProposals from "@/hooks/getDetailProposal";
import TabAction from "./TabAction";

export default function Action({ index }: { index: number }) {
  const { proposal, isLoading } = useGetDetailProposals(index);
  console.log(proposal?.quorum);

  return (
    <section className="border border-[#1d4ed8] p-5 rounded-md space-y-5 h-fit">
      {isLoading && <p>Loading...</p>}
      <React.Fragment key={index}>
        <Amount
          requestedAmount={
            proposal?.requestedAmount ? Number(proposal.requestedAmount) : null
          }
          totalDonation={
            proposal?.totalDonated ? Number(proposal.totalDonated) : null
          }
          rewardPool={proposal?.rewardPool ? Number(proposal.rewardPool) : null}
          totalVoter={proposal?.voterCount ? Number(proposal.voterCount) : 0}
          totalQuorum={proposal?.quorum ? Number(proposal.quorum) : 0}
        />
        <hr />
        <TabAction index={index} />
      </React.Fragment>
    </section>
  );
}
