"use client";
import React from "react";
import Amount from "./Amount";
import useGetDetailProposals from "@/hooks/getDetailProposal";
import useGetTotalDonations from "@/hooks/getTotalDonations";
import TabAction from "./TabAction";
import useGetVoters from "@/hooks/getVoters";

export default function Action({ index }: { index: number }) {
  const { proposals, isLoading } = useGetDetailProposals(index);
  const { totalDonation } = useGetTotalDonations(index);
  const { voters } = useGetVoters(index) as { voters: Array<string> };

  const requestedAmount = proposals ? proposals[4] : null;
  const rewardPool = proposals ? proposals[12] : null;
  const totalQuorum = proposals ? proposals[8] : 0;

  const totalVoter = voters ? voters[0]?.length : 0;

  return (
    <section className="border border-[#1d4ed8] p-5 rounded-md space-y-5 h-fit">
      {isLoading && <p>Loading...</p>}
      <React.Fragment key={index}>
        <Amount
          requestedAmount={requestedAmount as number | null}
          totalDonation={totalDonation as number | null}
          rewardPool={rewardPool as number | null}
          totalVoter={totalVoter as number | 0}
          totalQuorum={totalQuorum as number | 0}
        />
        <hr />
        <TabAction index={index} />
      </React.Fragment>
    </section>
  );
}
