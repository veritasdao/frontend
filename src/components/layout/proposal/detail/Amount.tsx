import React from "react";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatUnits } from "viem";
import { NumberTicker } from "@/components/magicui/number-ticker";
import moment from "moment";

export default function Amount({
  requestedAmount,
  totalFundraising,
  totalVoter,
  totalVoterPower,
  totalQuorum,
  deadline,
}: {
  requestedAmount: number | null;
  totalFundraising: number | null;
  totalVoter: number | 0;
  totalVoterPower: number | 0;
  totalQuorum: number | 0;
  deadline: number | 0;
}) {
  // Hitung persentase progress
  const progressValue =
    requestedAmount && totalFundraising
      ? Number(BigInt(totalFundraising) * BigInt(100)) /
        Number(BigInt(requestedAmount))
      : 0;

  const [timeLeft, setTimeLeft] = React.useState("");
  const [isEnded, setIsEnded] = React.useState(false);

  React.useEffect(() => {
    const calculateTimeLeft = () => {
      const now = moment();
      const end = moment(deadline * 1000);
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
  }, [deadline]);

  const formatedDeadline = moment(deadline * 1000).format("LLLL");
  moment.locale("id");

  return (
    <section className="grid gap-5">
      <div className={`text-center ${isEnded ? "opacity-50" : ""}`}>
        <p className="text-muted-foreground text-sm">
          {isEnded
            ? "Pemilihan telah berakhir"
            : `Pemilihan akan berakhir pada ${formatedDeadline}`}
        </p>
        <div
          className={`flex items-center justify-center gap-2 ${
            isEnded ? "text-red-500" : "text-primary"
          }`}
        >
          <p className="font-bold text-2xl">{timeLeft}</p>
          {isEnded && (
            <span className="text-sm bg-red-100 text-red-500 px-2 py-1 rounded-full">
              Berakhir
            </span>
          )}
        </div>
      </div>
      <hr />
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h1 className="text-muted-foreground font-medium">Total Pendanaan</h1>
        </div>
        {isEnded ? (
          <div className="relative">
            <Progress value={progressValue} className="h-3 rounded-full" />
            <div className="absolute -top-6 right-0 text-sm font-medium text-primary">
              {progressValue.toFixed(1)}%
            </div>
          </div>
        ) : (
          <div className="bg-muted/50 p-4 rounded-lg text-center">
            <p className="text-muted-foreground text-sm">
              Pendanaan akan dimulai setelah pemilihan selesai dan diterima
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Target pendanaan:{" "}
              {requestedAmount !== null
                ? parseFloat(
                    formatUnits(BigInt(requestedAmount), 2)
                  ).toLocaleString()
                : "0"}{" "}
              IDRX
            </p>
          </div>
        )}
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">Terkumpul:</span>
            <span className="font-medium">
              {requestedAmount !== null && totalFundraising !== null
                ? parseFloat(
                    formatUnits(BigInt(totalFundraising), 2)
                  ).toLocaleString()
                : "0"}
            </span>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Avatar className="w-4 h-4">
                <AvatarImage src="/images/idrx.svg" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <span>IDRX</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">Target:</span>
            <span className="font-medium">
              {requestedAmount !== null
                ? parseFloat(
                    formatUnits(BigInt(requestedAmount), 2)
                  ).toLocaleString()
                : "0"}
            </span>
            <Avatar className="w-4 h-4">
              <AvatarImage src="/images/idrx.svg" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <span>IDRX</span>
          </div>
        </div>
      </div>

      <div>
        <h1 className="text-muted-foreground font-medium">
          Total Suara ({totalVoter} Voter)
        </h1>
        <div className="font-bold text-4xl">
          <NumberTicker
            value={
              totalVoter !== null
                ? parseFloat(formatUnits(BigInt(totalVoterPower), 2))
                : 0
            }
          />
          <span className="font-normal text-[#1d4ed8]">/</span>
          <NumberTicker
            value={
              totalQuorum !== null
                ? parseFloat(formatUnits(BigInt(totalQuorum), 2))
                : 0
            }
          />
        </div>
      </div>
    </section>
  );
}
