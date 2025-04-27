"use client";
import useGetDonates from "@/hooks/getDonates";
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
import moment from "moment";
import { formatUnits } from "viem";

export default function HistoryFundraising({ index }: { index: number }) {
  const { donates } = useGetDonates(index) as {
    donates: Array<{
      address: string;
      amount: bigint;
      timestamp: bigint;
    }>;
  };

  if (!donates || donates.length === 0) {
    return (
      <Card className="bg-transparent border-[#1d4ed8]">
        <CardHeader>
          <CardTitle>Donation History</CardTitle>
          <CardDescription>Recent donation activities</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground">
            No donation history yet
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-transparent border-[#1d4ed8]">
      <CardHeader>
        <CardTitle>Donation History</CardTitle>
        <CardDescription>Recent donation activities</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Address</TableHead>
              <TableHead>Time</TableHead>
              <TableHead className="text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {donates.map((donate, i) => {
              const formatedAmount = formatUnits(donate.amount, 2);
              const formatedDate = moment(
                Number(donate.timestamp) * 1000
              ).format("LLLL");

              return (
                <TableRow key={i}>
                  <TableCell className="font-medium">
                    {String(donate.address).slice(0, 5)}...
                    {String(donate.address).slice(-5)}
                  </TableCell>
                  <TableCell className="font-medium">{formatedDate}</TableCell>
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
