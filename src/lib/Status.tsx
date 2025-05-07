"use client";

import useGetProposals from "@/hooks/getProposal";
import moment from "moment";

export default function Status({ index }: { index: number }) {
  const { proposals, isLoading } = useGetProposals();

  // Use the first proposal for status (or handle empty)
  const proposal = proposals && proposals.length > 0 ? proposals[index] : null;
  console.log(proposal);

  if (isLoading || !proposal) {
    return <span className="text-muted-foreground">Loading...</span>;
  }

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

  let color = "";
  switch (status) {
    case "Voting":
      color = "text-yellow-500";
      break;
    case "Fundraising":
      color = "text-green-600";
      break;
    case "Approved":
      color = "text-[#166534]";
      break;
    case "Rejected":
      color = "text-[#991b1b]";
      break;
    default:
      color = "text-muted-foreground";
  }

  return <span className={`${color} font-`}>{status}</span>;
}
