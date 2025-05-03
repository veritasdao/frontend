import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Vote from "./Vote";
import Fundraising from "../fundraising";
import useGetStatusProposal from "@/hooks/getStatusProposal";
import useGetDetailProposals from "@/hooks/getDetailProposal";
import useGetHasVoted from "@/hooks/getHasVoted";
import { injected, useAccount, useConnect } from "wagmi";
import { Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
export default function TabAction({ index }: { index: number }) {
  const { isConnected } = useAccount();
  const { statusProposal } = useGetStatusProposal(index);
  const { proposal } = useGetDetailProposals(index);
  const { hasVoted } = useGetHasVoted(index);
  const { connect } = useConnect();
  const getStatus = () => {
    if (!statusProposal || !proposal) return "Loading...";

    // Case 1: Pemilihan
    if (
      statusProposal.isActive &&
      !statusProposal.isApproved &&
      statusProposal.timeLeft > 0
    ) {
      return "vote";
    }

    // Case 2: Fundraising
    if (
      !statusProposal.isActive &&
      statusProposal.isExecuted &&
      statusProposal.isApproved &&
      statusProposal.timeLeft > 0 &&
      proposal.yesVotes > proposal.noVotes
    ) {
      return "fundraising";
    }

    // Case 3: Rejected
    if (
      !statusProposal.isActive &&
      !statusProposal.isExecuted &&
      statusProposal.timeLeft <= 0 &&
      proposal.noVotes > proposal.yesVotes
    ) {
      return "rejected";
    }

    return "Loading...";
  };

  const status = getStatus();
  return (
    <div>
      <Tabs defaultValue={status === "fundraising" ? "fundraising" : "vote"}>
        <TabsList>
          <TabsTrigger value="fundraising" disabled={status !== "fundraising"}>
            Fundraising
          </TabsTrigger>
          <TabsTrigger value="vote" disabled={status !== "vote"}>
            Vote
          </TabsTrigger>
        </TabsList>
        {isConnected ? (
          <>
            <TabsContent value="fundraising">
              <Fundraising index={index} />
            </TabsContent>
            <TabsContent value="vote">
              {hasVoted ? (
                <div className="py-5 space-y-5">
                  <p className="">
                    You have already voted on this proposal. Thank you for your
                    participation in the proposal voting.
                  </p>
                  <Button disabled={!proposal?.executed}>Claim Reward</Button>
                  <p className="text-muted-foreground text-sm">
                    Note: If the proposal is approved, you will receive a reward
                    in the form of tokens from this community. This token can be
                    used for contributions to this community and can be
                    exchanged for IDRX.
                  </p>
                </div>
              ) : (
                <Vote index={index} />
              )}
            </TabsContent>
          </>
        ) : (
          <Button
            type="button"
            className="w-full rounded"
            size={"lg"}
            variant={"outline"}
            onClick={() => connect({ connector: injected() })}
          >
            <Wallet className="w-10 h-10" />
            Connect Account First
          </Button>
        )}
      </Tabs>
    </div>
  );
}
