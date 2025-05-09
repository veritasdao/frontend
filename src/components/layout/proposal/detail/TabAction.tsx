import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Vote from "./Vote";
import Fundraising from "../fundraising";
import useGetDetailProposals from "@/hooks/getDetailProposal";
import useGetHasVoted from "@/hooks/getHasVoted";
import { injected, useAccount, useConnect } from "wagmi";
import { Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import moment from "moment";
import useGetTokenInfo from "@/hooks/getTokenInfo";
export default function TabAction({ index }: { index: number }) {
  const { isConnected } = useAccount();
  const { proposal } = useGetDetailProposals(index);
  const { hasVoted } = useGetHasVoted(index);
  const { connect } = useConnect();
  const { tokenInfo } = useGetTokenInfo({ index });
  const votingDeadline = moment(Number(proposal.votingDeadline) * 1000);
  const fundraisingDeadline = moment(
    Number(proposal.fundraisingDeadline) * 1000
  );
  const now = moment();

  let status = "";

  if (votingDeadline.isAfter(now) && !proposal.executed) {
    status = "Voting";
  } else if (
    proposal.executed &&
    proposal.yesVotes > proposal.noVotes &&
    fundraisingDeadline.isAfter(now)
  ) {
    status = "Fundraising";
  } else if (
    proposal.executed &&
    proposal.yesVotes > proposal.noVotes &&
    fundraisingDeadline.isBefore(now)
  ) {
    status = "Approved";
  } else if (
    !proposal.executed &&
    !proposal.approved &&
    (proposal.yesVotes < proposal.noVotes ||
      proposal.yesVotes === proposal.noVotes) &&
    votingDeadline.isBefore(now)
  ) {
    status = "Rejected";
  }

  if (tokenInfo?.distributed) {
    return (
      <div className="py-5 space-y-5">
        <p className="text-muted-foreground text-sm">
          Token has been distributed. You can claim your reward by clicking the
          button below.
        </p>
        <Button>Claim Reward</Button>
      </div>
    );
  }
  if (status === "Rejected") {
    return null;
  }

  return (
    <div>
      <Tabs defaultValue={status === "Fundraising" ? "fundraising" : "vote"}>
        <TabsList>
          <TabsTrigger value="fundraising" disabled={status !== "Fundraising"}>
            Fundraising
          </TabsTrigger>
          <TabsTrigger value="vote" disabled={status !== "Voting"}>
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
