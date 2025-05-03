"use client";

import { Badge } from "@/components/ui/badge";
import useGetDetailProposals from "@/hooks/getDetailProposal";
import useGetStatusProposal from "@/hooks/getStatusProposal";

type StatusBadgeProps = {
  index: number;
};

export default function StatusBadge({ index }: StatusBadgeProps) {
  const { statusProposal } = useGetStatusProposal(index);
  const { proposal } = useGetDetailProposals(index);

  const getStatus = () => {
    if (!statusProposal || !proposal) return "Loading...";

    // Case 1: Pemilihan
    if (
      statusProposal.isActive &&
      !statusProposal.isExecuted &&
      !statusProposal.isApproved &&
      statusProposal.timeLeft > 0
    ) {
      return "Voting";
    }

    // Case 2: Fundraising
    if (
      !statusProposal.isActive &&
      statusProposal.isExecuted &&
      statusProposal.isApproved &&
      statusProposal.timeLeft > 0 &&
      proposal.yesVotes > proposal.noVotes
    ) {
      return "Fundraising";
    }

    // Case 3: Rejected
    if (statusProposal.timeLeft <= 0 && proposal.noVotes > proposal.yesVotes) {
      return "Rejected";
    }

    return "Loading...";
  };

  const status = getStatus();

  let color = "secondary"; // default gray
  switch (status) {
    case "Voting":
      color = "outline"; // yellow (custom)
      break;
    case "Fundraising":
      color = "default"; // green (custom)
      break;
    case "Rejected":
      color = "destructive"; // red (default shadcn)
      break;
    default:
      color = "secondary"; // gray
  }

  return (
    <Badge
      variant={color as "secondary" | "default" | "destructive" | "outline"}
    >
      {status}
    </Badge>
  );
}
