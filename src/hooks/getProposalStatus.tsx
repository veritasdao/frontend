export type ProposalStatus =
  | "Pemilihan"
  | "Fundraising"
  | "Ditolak"
  | "Unknown";

type statusProposalType = {
  isActive: boolean;
  isExecuted: boolean;
  isApproved: boolean;
  hasMetQuorum: boolean;
  timeLeft: number;
};

type ProposalDetailType = {
  yesVotes: number;
  noVotes: number;
};

export function getProposalStatus(
  statusProposal: statusProposalType | null,
  proposal: ProposalDetailType | null
): ProposalStatus {
  if (!statusProposal || !proposal) return "Unknown";

  const { isActive, isExecuted, isApproved, hasMetQuorum, timeLeft } =
    statusProposal;
  const { yesVotes, noVotes } = proposal;

  if (isActive && !isApproved && !hasMetQuorum && timeLeft > 0) {
    return "Pemilihan";
  }

  if (
    !isActive &&
    isExecuted &&
    isApproved &&
    hasMetQuorum &&
    timeLeft > 0 &&
    yesVotes > noVotes
  ) {
    return "Fundraising";
  }

  if (
    !isActive &&
    !isExecuted &&
    !hasMetQuorum &&
    timeLeft <= 0 &&
    noVotes < yesVotes
  ) {
    return "Ditolak";
  }

  return "Unknown";
}
