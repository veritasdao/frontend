"use client";
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatUnits } from "viem";
import useGetFundraising from "@/hooks/getFundraising";

export default function HistoryFundraising({ index }: { index: number }) {
  const { fundraising, isLoading } = useGetFundraising(index);

  if (isLoading) {
    return (
      <Card className="bg-transparent border-[#1d4ed8]">
        <CardHeader>
          <CardTitle>Fundraising History</CardTitle>
          <CardDescription>Recent fundraising activities</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground">Loading...</p>
        </CardContent>
      </Card>
    );
  }

  if (!fundraising || !Array.isArray(fundraising) || fundraising.length < 3) {
    return (
      <Card className="bg-transparent border-[#1d4ed8]">
        <CardHeader>
          <CardTitle>Fundraising History</CardTitle>
          <CardDescription>Recent fundraising activities</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground">
            No fundraising history yet
          </p>
        </CardContent>
      </Card>
    );
  }

  const [contributors, amounts] = fundraising;

  if (
    !Array.isArray(contributors) ||
    !Array.isArray(amounts) ||
    contributors.length === 0
  ) {
    return (
      <Card className="bg-transparent border-[#1d4ed8]">
        <CardHeader>
          <CardTitle>Fundraising History</CardTitle>
          <CardDescription>Recent fundraising activities</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground">
            No fundraising history yet
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-transparent border-[#1d4ed8]">
      <CardHeader>
        <CardTitle>Fundraising History</CardTitle>
        <CardDescription>Recent fundraising activities</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Address</TableHead>
              {/* <TableHead>Time</TableHead> */}
              <TableHead className="text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {contributors.map((contributor, i) => {
              const amount = amounts[i];
              if (typeof amount !== "bigint") return null;

              const formatedAmount = formatUnits(amount, 2);
              // const formatedDate = moment(
              //   Number(donate.timestamp) * 1000
              // ).format("LLLL");

              return (
                <TableRow key={i}>
                  <TableCell className="font-medium">
                    {String(contributor).slice(0, 5)}...
                    {String(contributor).slice(-5)}
                  </TableCell>
                  {/* <TableCell className="font-medium">{formatedDate}</TableCell> */}
                  <TableCell className="text-right text-xl">
                    {formatedAmount} <span className="text-sm">IDRX</span>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
