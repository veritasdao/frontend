"use client";

import useGetDetailProposals from "@/hooks/getDetailProposal";
import { cn } from "@/lib/utils";
import moment from "moment";
import { Button } from "./ui/button";
import useGetTokenInfo from "@/hooks/getTokenInfo";
import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { toast } from "sonner";
import React from "react";
import { DAOToken } from "@/config/DAO";
import { DAOABI } from "@/config/DAO";

type StatusBarProps = {
  index: number;
};

export default function StatusBar({ index }: StatusBarProps) {
  const { proposal } = useGetDetailProposals(index);
  const { tokenInfo } = useGetTokenInfo({ index });
  const {
    writeContractAsync,
    data: hash,
    isPending,
    // isSuccess,
  } = useWriteContract();

  const { data: receipt, isLoading: isLoadingReceipt } =
    useWaitForTransactionReceipt({
      hash: hash,
    });

  React.useEffect(() => {
    if (receipt?.status === "success") {
      toast.success("Proposal executed successfully");
    }
  }, [receipt]);

  const votingDeadline = moment(Number(proposal.votingDeadline) * 1000);
  const fundraisingDeadline = moment(
    Number(proposal.fundraisingDeadline) * 1000
  );
  const now = moment();

  let status = "";

  // Determine status with possible progression from Rejected to Approved
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
    status = "Create Community";
  } else if (
    !proposal.executed &&
    !proposal.approved &&
    (proposal.yesVotes < proposal.noVotes ||
      proposal.yesVotes === proposal.noVotes) &&
    votingDeadline.isBefore(now)
  ) {
    status = "Rejected";
  }

  // Dynamically build stages based on proposal outcome
  let stages;
  if (
    !proposal.executed &&
    !proposal.approved &&
    (proposal.yesVotes < proposal.noVotes ||
      proposal.yesVotes === proposal.noVotes) &&
    votingDeadline.isBefore(now)
  ) {
    // Voting failed: Voting -> Rejected
    stages = [
      { id: "Voting", label: "Voting" },
      { id: "Rejected", label: "Rejected" },
    ];
  } else {
    // Voting passed: Voting -> Fundraising -> Approved
    stages = [
      { id: "Voting", label: "Voting" },
      { id: "Fundraising", label: "Fundraising" },
      { id: "Create Community", label: "Create Community" },
    ];
  }

  const getStageStatus = (stageId: string) => {
    const stageOrder = [
      "Voting",
      "Fundraising",
      "Create Community",
      "Rejected",
    ];
    const currentStageIndex = stageOrder.indexOf(status);
    const thisStageIndex = stageOrder.indexOf(stageId);

    if (thisStageIndex < currentStageIndex) {
      return "completed";
    } else if (thisStageIndex === currentStageIndex) {
      return "active";
    } else {
      return "inactive";
    }
  };

  async function executeProposal() {
    if (proposal?.executed) {
      toast.error("Proposal has already been executed");
      return;
    }
    try {
      await writeContractAsync({
        address: DAOToken,
        abi: DAOABI,
        functionName: "executeProposal",
        args: [index],
      });
      toast.success("Proposal execution started");
    } catch (error) {
      console.error(error);
      toast.error("Failed to execute proposal");
    }
  }

  async function finalizeProposal() {
    if (tokenInfo?.distributed) {
      toast.error("Community has already been created");
      return;
    }
    try {
      await writeContractAsync({
        address: DAOToken,
        abi: DAOABI,
        functionName: "finalizeProposal",
        args: [index],
      });
      toast.success("Proposal finalization started");
    } catch (error) {
      console.error(error);
      toast.error("Failed to finalize proposal");
    }
  }

  return (
    <div className="space-y-5">
      <h1 className="text-lg font-bold">Proposal Status</h1>
      <div className="flex flex-col gap-5">
        {stages.map((stage, index) => (
          <div key={stage.id} className="flex items-center gap-5">
            <div
              className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium",
                getStageStatus(stage.id) === "active" &&
                  "bg-primary text-primary-foreground",
                getStageStatus(stage.id) === "completed" &&
                  "bg-[#1d4ed8] text-white",
                getStageStatus(stage.id) === "inactive" &&
                  "bg-muted text-muted-foreground",
                stage.id === "Rejected" &&
                  getStageStatus(stage.id) === "active" &&
                  "bg-red-500 text-white"
              )}
            >
              {index + 1}
            </div>
            <div className="flex items-center gap-5">
              <p
                className={cn(
                  getStageStatus(stage.id) === "active" && "text-primary",
                  getStageStatus(stage.id) === "completed" && "opacity-50"
                )}
              >
                {stage.label}
              </p>
              {stage.id === "Voting" &&
                getStageStatus(stage.id) === "active" && (
                  <Button
                    onClick={executeProposal}
                    disabled={
                      isPending || proposal?.executed || isLoadingReceipt
                    }
                  >
                    {/* {isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : null} */}
                    Start Fundraising
                  </Button>
                )}
              {stage.id === "Create Community" &&
                getStageStatus(stage.id) === "active" &&
                !tokenInfo?.distributed && (
                  <Button
                    onClick={finalizeProposal}
                    disabled={
                      isPending || proposal?.executed || isLoadingReceipt
                    }
                  >
                    Finalize Proposal
                  </Button>
                )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
