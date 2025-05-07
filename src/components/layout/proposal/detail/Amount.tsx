import React, { useMemo } from "react";
import { Progress } from "@/components/ui/progress";
import { formatUnits } from "viem";
import { NumberTicker } from "@/components/magicui/number-ticker";
import moment from "moment";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils"; // Assuming you have a utility function for classnames

// Type definitions for better type safety
type AmountProps = {
  requestedAmount: bigint | null;
  totalFundraising: bigint | null;
  totalVoter: number;
  totalVoterPower: bigint;
  votingDeadline: number;
  fundraisingDeadline: number;
  yesVotes: number;
  noVotes: number;
  isExecuted: boolean;
};

// Custom hook for countdown timer
const useCountdown = (deadlineTimestamp: number) => {
  const [timeLeft, setTimeLeft] = React.useState("");
  const [isEnded, setIsEnded] = React.useState(false);

  React.useEffect(() => {
    const calculateTimeLeft = () => {
      const now = moment();
      const end = moment(deadlineTimestamp * 1000);
      const duration = moment.duration(end.diff(now));

      if (duration.asSeconds() <= 0) {
        setIsEnded(true);
        return "00:00:00:00";
      }

      setIsEnded(false);
      const days = Math.floor(duration.asDays()).toString().padStart(2, "0");
      const hours = duration.hours().toString().padStart(2, "0");
      const minutes = duration.minutes().toString().padStart(2, "0");
      const seconds = duration.seconds().toString().padStart(2, "0");

      return `${days}:${hours}:${minutes}:${seconds}`;
    };

    setTimeLeft(calculateTimeLeft());
    const interval = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(interval);
  }, [deadlineTimestamp]);

  return { timeLeft, isEnded };
};

// Currency display component
const CurrencyAmount = ({
  amount,
  className = "",
  size = "normal",
}: {
  amount: string | number;
  className?: string;
  size?: "small" | "normal" | "large";
}) => {
  const sizeClasses = {
    small: "text-sm",
    normal: "text-base",
    large: "text-4xl font-bold",
  };

  return (
    <div className={cn("flex items-center flex-wrap gap-1", className)}>
      <p className={sizeClasses[size]}>
        {typeof amount === "string" ? amount : amount.toLocaleString()}
      </p>
      <div className="flex items-center gap-1">
        <Avatar className="w-5 h-5">
          <AvatarImage src="/images/idrx.svg" alt="IDRX Token" />
          <AvatarFallback>ID</AvatarFallback>
        </Avatar>
        <span className="text-muted-foreground text-sm">IDRX</span>
      </div>
    </div>
  );
};

// Status badge component
const StatusBadge = ({ isAccepted }: { isAccepted: boolean }) => (
  <span
    className={cn(
      "text-sm px-2 py-1 rounded-full",
      isAccepted ? "bg-green-100 text-green-600" : "bg-red-100 text-red-500"
    )}
  >
    Ended
  </span>
);

export default function Amount({
  requestedAmount,
  totalFundraising,
  totalVoter,
  totalVoterPower,
  votingDeadline,
  fundraisingDeadline,
  yesVotes,
  noVotes,
  isExecuted,
}: AmountProps) {
  // Voting period countdown
  const { timeLeft: votingTimeLeft, isEnded: isVotingEnded } =
    useCountdown(votingDeadline);

  // Fundraising period countdown (only used when voting has ended and proposal executed)
  const { timeLeft: fundraisingTimeLeft, isEnded: isFundraisingEnded } =
    useCountdown(fundraisingDeadline);

  // Check if proposal is accepted
  const isAccepted = useMemo(() => yesVotes > noVotes, [yesVotes, noVotes]);

  // Calculate progress percentage with memoization
  const progressValue = useMemo(() => {
    if (!requestedAmount || !totalFundraising) return 0;

    try {
      return Number((totalFundraising * BigInt(100)) / requestedAmount);
    } catch (error) {
      console.error("Error calculating progress:", error);
      return 0;
    }
  }, [requestedAmount, totalFundraising]);

  // Format amounts for display with memoization
  const formattedRequestedAmount = useMemo(() => {
    if (!requestedAmount) return "0";
    try {
      return parseFloat(formatUnits(requestedAmount, 2)).toLocaleString();
    } catch (error) {
      console.error("Error formatting requested amount:", error);
      return "0";
    }
  }, [requestedAmount]);

  const formattedTotalFundraising = useMemo(() => {
    if (!totalFundraising) return "0";
    try {
      return parseFloat(formatUnits(totalFundraising, 2)).toLocaleString();
    } catch (error) {
      console.error("Error formatting total fundraising:", error);
      return "0";
    }
  }, [totalFundraising]);

  const formattedVoterPower = useMemo(() => {
    try {
      return parseFloat(formatUnits(totalVoterPower, 2));
    } catch (error) {
      console.error("Error formatting voter power:", error);
      return 0;
    }
  }, [totalVoterPower]);

  // Format deadlines with memoization
  const formattedVotingDeadline = useMemo(
    () => moment(votingDeadline * 1000).format("LLLL"),
    [votingDeadline]
  );

  const formattedFundraisingDeadline = useMemo(
    () => moment(fundraisingDeadline * 1000).format("LLLL"),
    [fundraisingDeadline]
  );

  // Determine the current state for rendering
  const currentState = useMemo(() => {
    if (!isVotingEnded) {
      return "voting";
    } else if (isAccepted && isExecuted && !isFundraisingEnded) {
      return "fundraising";
    } else if (isAccepted && isExecuted && isFundraisingEnded) {
      return "completed";
    } else {
      return "rejected";
    }
  }, [isVotingEnded, isAccepted, isExecuted, isFundraisingEnded]);

  // Render appropriate status message
  const statusMessage = useMemo(() => {
    switch (currentState) {
      case "voting":
        return `Voting will end at ${formattedVotingDeadline}`;
      case "fundraising":
        return `Voting has ended and the majority agree. Fundraising has started and will end at ${formattedFundraisingDeadline}`;
      case "completed":
        return "Voting has ended and the proposal is accepted";
      case "rejected":
        return "Voting has ended and the proposal is rejected";
      default:
        return "";
    }
  }, [currentState, formattedVotingDeadline, formattedFundraisingDeadline]);

  // Determine which countdown to display
  const displayTimeLeft =
    currentState === "fundraising" ? fundraisingTimeLeft : votingTimeLeft;

  // Determine status section color
  const statusColor = useMemo(() => {
    if (currentState === "voting") return "text-primary";
    if (currentState === "rejected") return "text-red-500";
  }, [currentState]);

  return (
    <section className="grid gap-5">
      {/* Status and countdown section */}
      <div
        className={cn(
          "text-center",
          currentState !== "voting" &&
            currentState !== "fundraising" &&
            "opacity-50"
        )}
      >
        <p className="text-muted-foreground text-sm">{statusMessage}</p>
        <div
          className={cn("flex items-center justify-center gap-2", statusColor)}
        >
          <p className="font-bold text-3xl" aria-label="Time remaining">
            {displayTimeLeft}
          </p>
          {currentState !== "voting" && currentState !== "fundraising" && (
            <StatusBadge isAccepted={isAccepted} />
          )}
        </div>
      </div>

      <hr className="border-muted my-2" />

      {/* Fundraising progress section */}
      <div className="space-y-2">
        {currentState === "fundraising" && (
          <div>
            <p>Fundraising is in progress</p>
            <div className="relative mt-2">
              <Progress
                value={progressValue}
                className="h-3 rounded-full"
                aria-label={`Fundraising progress: ${progressValue.toFixed(
                  1
                )}%`}
              />
              <div className="absolute -top-6 right-0 text-sm font-medium text-primary">
                {progressValue.toFixed(1)}%
              </div>
            </div>
          </div>
        )}

        {currentState === "completed" && (
          <div>
            <p className="text-[#14b8a6] text-sm font-semibold">
              The fundraising period has ended.
            </p>
            <div className="relative mt-2">
              <Progress
                value={progressValue}
                className="h-3 rounded-full"
                aria-label={`Final fundraising result: ${progressValue.toFixed(
                  1
                )}%`}
              />
              <div className="absolute -top-6 right-0 text-sm font-medium text-primary">
                {progressValue.toFixed(1)}%
              </div>
            </div>
          </div>
        )}

        {currentState === "rejected" && (
          <div className="bg-red-50 p-4 rounded-lg text-center">
            <p className="text-red-500 text-sm font-semibold">
              Proposal rejected or not executed. Fundraising will not proceed.
            </p>
          </div>
        )}
      </div>

      {/* Fundraising amount section */}
      <div>
        {currentState === "voting" && isExecuted && (
          <p className="text-muted-foreground text-sm">
            (Fundraising will start after proposal is executed)
          </p>
        )}
        <h2 className="text-muted-foreground font-medium mb-2">
          Total Fundraising
        </h2>
        <CurrencyAmount amount={formattedTotalFundraising} size="large" />
        <div className="flex items-center gap-2 mt-1">
          <p className="text-muted-foreground text-sm">Target: </p>
          <CurrencyAmount amount={formattedRequestedAmount} size="small" />
        </div>
      </div>

      {/* Voting section */}
      <div>
        <h2 className="text-muted-foreground font-medium mb-2">
          Total Votes ({totalVoter} Voters)
        </h2>
        <div className="font-bold text-4xl">
          <NumberTicker value={formattedVoterPower} />
        </div>
        <div className="flex items-center gap-4 text-sm mt-1">
          <p className="flex items-center gap-1">
            <span className="inline-block w-2 h-2 rounded-full bg-[#14b8a6]"></span>
            Yes: {yesVotes}
          </p>
          <p className="flex items-center gap-1">
            <span className="inline-block w-2 h-2 rounded-full bg-red-500"></span>
            No: {noVotes}
          </p>
        </div>
      </div>
    </section>
  );
}
