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

// Sample data
const transaction = [
  {
    date: "2025-04-10",
    transactions: [
      { support: true, amount: 1500 },
      { support: false, amount: 300 },
      { support: true, amount: 700 },
    ],
  },
  {
    date: "2025-04-11",
    transactions: [
      { support: true, amount: 2000 },
      { support: false, amount: 500 },
    ],
  },
  {
    date: "2025-04-12",
    transactions: [
      { support: true, amount: 1800 },
      { support: false, amount: 400 },
      { support: true, amount: 600 },
      { support: false, amount: 5000 },
    ],
  },
  {
    date: "2025-04-10",
    transactions: [
      { support: true, amount: 1500 },
      { support: false, amount: 300 },
      { support: true, amount: 700 },
    ],
  },
  {
    date: "2025-04-11",
    transactions: [
      { support: true, amount: 2000 },
      { support: false, amount: 500 },
    ],
  },
  {
    date: "2025-04-12",
    transactions: [
      { support: true, amount: 1800 },
      { support: false, amount: 400 },
      { support: true, amount: 600 },
      { support: false, amount: 5000 },
    ],
  },
  {
    date: "2025-04-10",
    transactions: [
      { support: true, amount: 1500 },
      { support: false, amount: 300 },
      { support: true, amount: 700 },
    ],
  },
  {
    date: "2025-04-11",
    transactions: [
      { support: true, amount: 2000 },
      { support: false, amount: 500 },
    ],
  },
  {
    date: "2025-04-12",
    transactions: [
      { support: true, amount: 100 },
      { support: false, amount: 100 },
      { support: true, amount: 100 },
      { support: true, amount: 10000 },
    ],
  },
];

// Calculate daily net amount
const chartData = transaction.map((data) => {
  const amountDay = data.transactions.reduce(
    (sum, transact) =>
      sum + (transact.support ? transact.amount : -transact.amount),
    0
  );
  return {
    day: data.date,
    amountDay,
  };
});

const chartConfig = {
  amountDay: {
    label: "Voters",
  },
} satisfies ChartConfig;

export function ChartVoter() {
  return (
    <Card className="bg-transparent border-[#1d4ed8]">
      <CardHeader>
        <CardTitle>Voter Indikator</CardTitle>
        <CardDescription>Grafik dalam 1D (1 Day)</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={chartData}>
            <XAxis
              dataKey="day"
              tickLine={true}
              tickMargin={10}
              axisLine={true}
              // tickFormatter={(value) => value.slice()}
            />
            <CartesianGrid vertical={true} />
            <ChartTooltip
              cursor={true}
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
          Showing total visitors for the last 6 months
        </div>
      </CardFooter>
    </Card>
  );
}
