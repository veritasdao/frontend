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
      !statusProposal.isApproved &&
      !statusProposal.hasMetQuorum &&
      statusProposal.timeLeft > 0
    ) {
      return "Pemilihan";
    }

    // Case 2: Fundraising
    if (
      !statusProposal.isActive &&
      statusProposal.isExecuted &&
      statusProposal.isApproved &&
      statusProposal.hasMetQuorum &&
      statusProposal.timeLeft > 0 &&
      proposal.yesVotes > proposal.noVotes
    ) {
      return "Fundraising";
    }

    // Case 3: Ditolak
    if (
      !statusProposal.isActive &&
      !statusProposal.isExecuted &&
      !statusProposal.hasMetQuorum &&
      statusProposal.timeLeft <= 0 &&
      proposal.noVotes > proposal.yesVotes
    ) {
      return "Ditolak";
    }

    return "Loading...";
  };

  const status = getStatus();

  let color = "secondary"; // default gray
  switch (status) {
    case "Pemilihan":
      color = "default"; // yellow (custom)
      break;
    case "Fundraising":
      color = "default"; // green (custom)
      break;
    case "Ditolak":
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
