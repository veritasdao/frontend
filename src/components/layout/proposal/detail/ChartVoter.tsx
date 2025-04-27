"use client";

import { TrendingUp } from "lucide-react";
import { Bar, BarChart, CartesianGrid, Cell, LabelList, XAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import useGetVoters from "@/hooks/getVoters";
import moment from "moment";
import { formatUnits } from "viem";

const chartConfig = {
  amountDay: {
    label: "Voters",
  },
} satisfies ChartConfig;

export function ChartVoter({ index }: { index: number }) {
  const { voters } = useGetVoters(index) as {
    voters: Array<{
      support: boolean;
      voter: string;
      votingPower: bigint;
    }>;
  };

  const formattedVoters = voters
    ? voters.map((voter) => ({
        address: voter.voter,
        support: voter.support,
        amount: Number(formatUnits(voter.votingPower, 2)),
        date: moment().format("ll"), // Using current date since timestamp isn't provided in new format
      }))
    : [];

  // Grouping by date
  const grouped = formattedVoters.reduce<Record<string, number>>(
    (acc, voter) => {
      const key = voter.date;
      const value = voter.support ? voter.amount : -voter.amount;
      acc[key] = (acc[key] || 0) + value;
      return acc;
    },
    {}
  );

  const chartData = Object.entries(grouped).map(([day, amountDay]) => ({
    day,
    amountDay,
  }));

  // Calculate trending percentage per day
  const calculateTrendingPercentage = () => {
    if (chartData.length < 2) return 0;

    const firstValue = chartData[0].amountDay;
    const lastValue = chartData[chartData.length - 1].amountDay;

    if (firstValue === 0) return 0;

    // Calculate daily change
    const daysDiff = moment(chartData[chartData.length - 1].day).diff(
      moment(chartData[0].day),
      "days"
    );
    if (daysDiff === 0) return 0;

    return (((lastValue - firstValue) / Math.abs(firstValue)) * 100) / daysDiff;
  };

  const trendingPercentage = calculateTrendingPercentage();
  const isTrendingUp = trendingPercentage > 0;

  return (
    <Card className="bg-transparent border-[#1d4ed8]">
      <CardHeader>
        <CardTitle>Voter Indikator</CardTitle>
        <CardDescription>Grafik dalam 1D (1 Day)</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={chartData}
            barSize={75}
            margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
          >
            <XAxis dataKey="day" tickLine tickMargin={10} axisLine />
            <CartesianGrid vertical />
            <ChartTooltip
              cursor
              content={<ChartTooltipContent hideLabel hideIndicator />}
            />
            <Bar dataKey="amountDay">
              <LabelList position="top" dataKey="amountDay" fillOpacity={1} />
              {chartData.map((item) => (
                <Cell
                  key={item.day}
                  fill={
                    item.amountDay > 0
                      ? "hsl(var(--chart-5))"
                      : "hsl(var(--chart-2))"
                  }
                />
              ))}
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          {isTrendingUp ? "Trending up" : "Trending down"} by{" "}
          {Math.abs(trendingPercentage).toFixed(1)}% per day{" "}
          {isTrendingUp ? (
            <TrendingUp className="h-4 w-4" />
          ) : (
            <TrendingUp className="h-4 w-4 rotate-180" />
          )}
        </div>
        <div className="leading-none text-muted-foreground">
          Showing total votes grouped by day
        </div>
      </CardFooter>
    </Card>
  );
}
