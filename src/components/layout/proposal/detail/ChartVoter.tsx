"use client";

import { TrendingUp } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  XAxis,
  YAxis,
} from "recharts";
import type { TooltipProps } from "recharts";
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
import { Skeleton } from "@/components/ui/skeleton";

const chartConfig = {
  amountDay: {
    label: "Votes",
    theme: {
      light: "hsl(210 100% 63%)",
      dark: "hsl(210 100% 63%)",
    },
  },
} satisfies ChartConfig;

export function ChartVoter({ index }: { index: number }) {
  const { voters, isLoading, error } = useGetVoters(index) as {
    voters: Array<{
      support: boolean;
      voter: string;
      votingPower: bigint;
    }>;
    isLoading: boolean;
    error: Error | null;
  };

  if (isLoading) {
    return (
      <Card className="bg-transparent border-[#1d4ed8]">
        <CardHeader>
          <CardTitle>Voter Indicator</CardTitle>
          <CardDescription>Chart in 1D (1 Day)</CardDescription>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[300px] w-full" />
        </CardContent>
        <CardFooter className="flex-col items-start gap-2 text-sm">
          <Skeleton className="h-4 w-[200px]" />
          <Skeleton className="h-4 w-[150px]" />
        </CardFooter>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="bg-transparent border-[#1d4ed8]">
        <CardHeader>
          <CardTitle>Voter Indicator</CardTitle>
          <CardDescription>Chart in 1D (1 Day)</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-destructive text-sm">
            Failed to load voter data: {error.message}
          </div>
        </CardContent>
      </Card>
    );
  }

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

  // Calculate trending percentage per day with improved accuracy
  const calculateTrendingPercentage = () => {
    if (chartData.length < 2) return 0;

    const firstValue = chartData[0].amountDay;
    const lastValue = chartData[chartData.length - 1].amountDay;

    if (firstValue === 0) return 0;

    // Calculate daily change with improved accuracy
    const daysDiff = moment(chartData[chartData.length - 1].day).diff(
      moment(chartData[0].day),
      "days"
    );
    if (daysDiff === 0) return 0;

    // Use compound growth rate formula for more accurate trending
    const growthRate =
      Math.pow(Math.abs(lastValue / firstValue), 1 / daysDiff) - 1;
    return (lastValue > 0 ? growthRate : -growthRate) * 100;
  };

  const trendingPercentage = calculateTrendingPercentage();
  const isTrendingUp = trendingPercentage > 0;

  const formatValue = (value: any): string => {
    const numValue = Number(value) || 0;
    return `${numValue > 0 ? "+" : ""}${numValue.toLocaleString()}`;
  };

  return (
    <Card className="bg-transparent border-[#1d4ed8]">
      <CardHeader>
        <CardTitle>Voter Indicator</CardTitle>
        <CardDescription>Chart in 1D (1 Day)</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={chartData}
            barSize={75}
            margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
          >
            <XAxis
              dataKey="day"
              tickLine
              tickMargin={10}
              axisLine
              tick={{ fontSize: 12 }}
            />
            <YAxis tickFormatter={formatValue} tick={{ fontSize: 12 }} />
            <CartesianGrid vertical />
            <ChartTooltip
              cursor
              content={
                <ChartTooltipContent
                  hideLabel
                  hideIndicator
                  formatter={formatValue}
                />
              }
            />
            <Bar dataKey="amountDay">
              <LabelList
                position="top"
                dataKey="amountDay"
                fillOpacity={1}
                formatter={formatValue}
              />
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
          Showing total votes grouped by day. Positive values indicate support
          votes, negative values indicate against votes.
        </div>
      </CardFooter>
    </Card>
  );
}
