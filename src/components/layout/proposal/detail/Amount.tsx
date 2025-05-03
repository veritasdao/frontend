import React from "react";
import { Progress } from "@/components/ui/progress";
import { formatUnits } from "viem";
import { NumberTicker } from "@/components/magicui/number-ticker";
import moment from "moment";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function Amount({
  requestedAmount,
  totalFundraising,
  totalVoter,
  totalVoterPower,
  votingDeadline,
  fundraisingDeadline,
  yesVotes,
  noVotes,
}: {
  requestedAmount: number | null;
  totalFundraising: number | null;
  totalVoter: number | 0;
  totalVoterPower: number | 0;
  votingDeadline: number | 0;
  fundraisingDeadline: number | 0;
  yesVotes: number | 0;
  noVotes: number | 0;
}) {
  // Calculate progress percentage
  const progressValue =
    requestedAmount && totalFundraising
      ? Number(BigInt(totalFundraising) * BigInt(100)) /
        Number(BigInt(requestedAmount))
      : 0;

  const [timeLeft, setTimeLeft] = React.useState("");
  const [isEnded, setIsEnded] = React.useState(false);

  // Check if proposal is accepted
  const isAccepted = yesVotes > noVotes;

  // Fundraising period state
  const [fundraisingTimeLeft, setFundraisingTimeLeft] = React.useState("");
  const [isFundraisingEnded, setIsFundraisingEnded] = React.useState(false);

  React.useEffect(() => {
    const calculateTimeLeft = () => {
      const now = moment();
      const end = moment(votingDeadline * 1000);
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

    const interval = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(interval);
  }, [votingDeadline]);

  React.useEffect(() => {
    if (isEnded && isAccepted) {
      const calculateFundraisingTimeLeft = () => {
        const now = moment();
        const end = moment(fundraisingDeadline * 1000);
        const duration = moment.duration(end.diff(now));

        if (duration.asSeconds() <= 0) {
          setIsFundraisingEnded(true);
          return "00:00:00:00";
        }

        setIsFundraisingEnded(false);
        const days = Math.floor(duration.asDays()).toString().padStart(2, "0");
        const hours = duration.hours().toString().padStart(2, "0");
        const minutes = duration.minutes().toString().padStart(2, "0");
        const seconds = duration.seconds().toString().padStart(2, "0");

        return `${days}:${hours}:${minutes}:${seconds}`;
      };

      setFundraisingTimeLeft(calculateFundraisingTimeLeft());
      const interval = setInterval(() => {
        setFundraisingTimeLeft(calculateFundraisingTimeLeft());
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isEnded, isAccepted, fundraisingDeadline]);

  const formatedDeadline = moment(votingDeadline * 1000).format("LLLL");
  moment.locale("en");

  return (
    <section className="grid gap-5">
      <div className={`text-center ${isEnded ? "opacity-50" : ""}`}>
        <p className="text-muted-foreground text-sm">
          {isEnded
            ? isAccepted
              ? `Voting has ended and the proposal is accepted`
              : `Voting has ended and the proposal is rejected`
            : `Voting will end at ${formatedDeadline}`}
        </p>
        <div
          className={`flex items-center justify-center gap-2 ${
            isEnded
              ? isAccepted
                ? "text-green-600"
                : "text-red-500"
              : "text-primary"
          }`}
        >
          <p className="font-bold text-2xl">{timeLeft}</p>
          {isEnded && (
            <span
              className={`text-sm px-2 py-1 rounded-full ${
                isAccepted
                  ? "bg-green-100 text-green-600"
                  : "bg-red-100 text-red-500"
              }`}
            >
              Ended
            </span>
          )}
        </div>
      </div>
      <hr />
      <div className="space-y-2">
        {isEnded ? (
          isAccepted ? (
            isFundraisingEnded ? (
              <div className="bg-green-50 p-4 rounded-lg text-center">
                <p className="text-green-600 text-sm font-semibold">
                  The fundraising period has ended.
                </p>
                <div className="relative mt-2">
                  <Progress
                    value={progressValue}
                    className="h-3 rounded-full"
                  />
                  <div className="absolute -top-6 right-0 text-sm font-medium text-primary">
                    {progressValue.toFixed(1)}%
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-green-50 p-4 rounded-lg text-center">
                <p className="text-green-600 text-sm font-semibold">
                  Fundraising is in progress
                </p>
                <p className="text-xs text-green-700 mt-1">
                  Fundraising ends in:{" "}
                  <span className="font-mono">{fundraisingTimeLeft}</span>
                </p>
                <div className="relative mt-2">
                  <Progress
                    value={progressValue}
                    className="h-3 rounded-full"
                  />
                  <div className="absolute -top-6 right-0 text-sm font-medium text-primary">
                    {progressValue.toFixed(1)}%
                  </div>
                </div>
              </div>
            )
          ) : (
            <div className="bg-red-50 p-4 rounded-lg text-center">
              <p className="text-red-500 text-sm font-semibold">
                Proposal rejected. Fundraising will not proceed.
              </p>
            </div>
          )
        ) : null}
      </div>

      <div>
        {!isEnded && isAccepted && (
          <p className="text-muted-foreground text-sm">
            (Fundraising Started after voting is accepted)
          </p>
        )}
        <h1 className="text-muted-foreground font-medium">Total Fundraising</h1>
        <div className="flex items-center flex-wrap gap-1">
          <p className="font-bold text-4xl">
            {totalFundraising !== null
              ? parseFloat(
                  formatUnits(BigInt(totalFundraising), 2)
                ).toLocaleString()
              : "0"}{" "}
          </p>
          <div className="flex items-center gap-1">
            <Avatar className="w-5 h-5">
              <AvatarImage src="/images/idrx.svg" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <span className="text-muted-foreground text-sm">IDRX</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <p className="text-muted-foreground text-sm">Target: </p>
          <div className="flex items-center flex-wrap gap-1">
            <p>
              {requestedAmount !== null
                ? parseFloat(
                    formatUnits(BigInt(requestedAmount), 2)
                  ).toLocaleString()
                : "0"}{" "}
            </p>
            <div className="flex items-center gap-1">
              <Avatar className="w-5 h-5">
                <AvatarImage src="/images/idrx.svg" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <span className="text-muted-foreground text-sm">IDRX</span>
            </div>
          </div>
        </div>
      </div>

      <div>
        <h1 className="text-muted-foreground font-medium">
          Total Votes ({totalVoter} Voters)
        </h1>
        <div className="font-bold text-4xl">
          <NumberTicker
            value={
              totalVoter !== null
                ? parseFloat(formatUnits(BigInt(totalVoterPower), 2))
                : 0
            }
          />
        </div>
        <div className="flex items-center gap-2 text-sm">
          <p>Yes Vote: {yesVotes}</p>
          <p>No Vote: {noVotes}</p>
        </div>
      </div>
    </section>
  );
}
