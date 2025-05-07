"use client";

import { Badge } from "@/components/ui/badge";
import useGetDetailProposals from "@/hooks/getDetailProposal";
import moment from "moment";

type StatusBadgeProps = {
  index: number;
};

export default function StatusBadge({ index }: StatusBadgeProps) {
  const { proposal } = useGetDetailProposals(index);

  const votingDeadline = moment(Number(proposal.votingDeadline) * 1000);
  const fundraisingDeadline = moment(
    Number(proposal.fundraisingDeadline) * 1000
  );
  const now = moment();

  const getStatus = () => {
    if (!proposal) return "Loading...";

    // Voting Phase
    if (
      !proposal.executed &&
      !proposal.approved &&
      votingDeadline.isAfter(now)
    ) {
      return "Voting";
    }

    // Voting ended unsuccessfully
    if (
      votingDeadline.isBefore(now) &&
      !proposal.executed &&
      !proposal.approved &&
      proposal.noVotes > proposal.yesVotes
    ) {
      return "Rejected";
    }

    // Fundraising Phase
    if (
      proposal.executed &&
      proposal.approved &&
      proposal.yesVotes > proposal.noVotes &&
      votingDeadline.isBefore(now) &&
      fundraisingDeadline.isAfter(now)
    ) {
      return "Fundraising";
    }

    if (
      proposal.yesVotes > proposal.noVotes &&
      votingDeadline.isBefore(now) &&
      fundraisingDeadline.isBefore(now)
    ) {
      return "Approved";
    }

    return "Loading...";
  };

  const status = getStatus();

  let color = ""; // default gray
  switch (status) {
    case "Voting":
      color = ""; // yellow (custom)
      break;
    case "Fundraising":
      color = ""; // green (custom)
      break;
    case "Approved":
      color = "bg-[#166534] text-white"; // green (custom)
      break;
    case "Rejected":
      color = "bg-[#991b1b] text-white"; // red (custom)
      break;
    default:
      color = "bg-muted text-muted-foreground"; // gray
  }

  return <Badge className={`${color}`}>{status}</Badge>;
}
