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
    voters: [string[], boolean[], string[], string[], number[]];
  };

  const formattedVoters =
    voters && voters[0]
      ? voters[0].map((_, i) => ({
          address: voters[0][i],
          support: voters[1][i],
          amount: Number(formatUnits(BigInt(voters[2][i]), 2)),
          date: moment(Number(voters[4][i]) * 1000).format("ll"),
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
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing total votes grouped by day
        </div>
      </CardFooter>
    </Card>
  );
}
