import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { DAOABI, DAOToken } from "@/config/DAO";
import useGetDetailProposals from "@/hooks/getDetailProposal";
import useGetHasVoted from "@/hooks/getHasVoted";
import useGetTokenInfo from "@/hooks/getTokenInfo";
import { Loader2 } from "lucide-react";
import React from "react";
import { toast } from "sonner";
import { useWaitForTransactionReceipt, useWriteContract } from "wagmi";

interface InteractProposalProps {
  index: number;
}

export default function InteractProposal({ index }: InteractProposalProps) {
  const { proposal } = useGetDetailProposals(index);
  const { hasVoted } = useGetHasVoted(index);
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

  const isVotingEnded = proposal?.votingDeadline
    ? Number(proposal.votingDeadline) < Math.floor(Date.now() / 1000)
    : false;

  const isFundraisingEnded = proposal?.fundraisingDeadline
    ? Number(proposal.fundraisingDeadline) < Math.floor(Date.now() / 1000)
    : false;

  let color = "outline"; // default gray
  switch (isVotingEnded || isFundraisingEnded) {
    case true:
      color = "default"; // green (custom)
      break;
    case false:
      color = "outline"; // yellow (custom)
      break;
    default:
      color = "outline"; // green (custom)
      break;
  }

  React.useEffect(() => {
    if (receipt?.status === "success") {
      toast.success("Proposal executed successfully");
    }
  }, [receipt]);

  async function executeProposal() {
    if (!isVotingEnded) {
      toast.error("Voting must be completed before executing proposal");
      return;
    }
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
    if (!isFundraisingEnded) {
      toast.error("Fundraising must be completed before creating community");
      return;
    }
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

  if (!hasVoted) {
    return null;
  }

  return (
    <section className="grid grid-cols-2 gap-5">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={color as "default" | "outline"}
              onClick={executeProposal}
              disabled={isPending || proposal?.executed || isLoadingReceipt}
            >
              {isPending ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : null}
              Start Fundraising
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            {proposal?.executed
              ? "Fundraising has already started"
              : proposal?.approved
              ? "Proposal has already been approved"
              : "Voting must be completed before starting fundraising"}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={color as "default" | "outline"}
              onClick={finalizeProposal}
              disabled={isPending || tokenInfo?.distributed || isLoadingReceipt}
            >
              {isPending ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : null}
              Create Community
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            {tokenInfo?.distributed || isFundraisingEnded
              ? "Community has already been created"
              : "Fundraising must be completed before creating community"}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </section>
  );
}
