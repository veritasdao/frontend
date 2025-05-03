"use client";

import useGetDetailProposals from "@/hooks/getDetailProposal";
import useGetStatusProposal from "@/hooks/getStatusProposal";
import { cn } from "@/lib/utils";

type StatusBarProps = {
  index: number;
};

export default function StatusBar({ index }: StatusBarProps) {
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

  const stages = [
    { id: "voting", label: "Voting" },
    {
      id: "final",
      label:
        status === "Voting"
          ? "Final"
          : status === "Fundraising"
          ? "Fundraising"
          : "Rejected",
    },
  ];

  const getStageStatus = (stageId: string) => {
    switch (status) {
      case "Voting":
        return stageId === "voting" ? "active" : "pending";
      case "Fundraising":
        return stageId === "final" ? "approved" : "completed";
      case "Rejected":
        return stageId === "final" ? "rejected" : "inactive";
      default:
        return "inactive";
    }
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2">
        {stages.map((stage, index) => (
          <div key={stage.id} className="flex flex-col items-center">
            <div
              className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium",
                getStageStatus(stage.id) === "active" &&
                  "bg-primary text-primary-foreground",
                getStageStatus(stage.id) === "completed" &&
                  "bg-green-500 text-white",
                getStageStatus(stage.id) === "approved" &&
                  "bg-green-500 text-white",
                getStageStatus(stage.id) === "rejected" &&
                  "bg-destructive text-destructive-foreground",
                getStageStatus(stage.id) === "pending" &&
                  "bg-secondary text-white",
                getStageStatus(stage.id) === "inactive" &&
                  "bg-muted text-muted-foreground"
              )}
            >
              {index + 1}
            </div>
            <span className="text-xs mt-1 text-center">{stage.label}</span>
          </div>
        ))}
      </div>
      <div className="relative">
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-muted" />
        <div
          className={cn(
            "absolute top-0 left-0 h-1 transition-all duration-300",
            status === "Voting" && "w-1/2 bg-primary",
            (status === "Fundraising" || status === "Rejected") &&
              "w-full bg-primary"
          )}
        />
      </div>
    </div>
  );
}
