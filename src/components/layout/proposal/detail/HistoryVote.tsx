"use client";
import useGetVoters from "@/hooks/getVoters";
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
import { Badge } from "@/components/ui/badge";
import { formatUnits } from "viem";
import moment from "moment";

export default function HistoryVote({ index }: { index: number }) {
  const { voters } = useGetVoters(index) as {
    voters: Array<{
      support: boolean;
      voter: string;
      votingPower: bigint;
      timestamp: bigint;
    }>;
  };

  if (!voters || voters.length === 0) {
    return (
      <Card className="bg-transparent border-[#1d4ed8]">
        <CardHeader>
          <CardTitle>Voting History</CardTitle>
          <CardDescription>Recent voting activities</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground">
            No voting history yet
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-transparent border-[#1d4ed8]">
      <CardHeader>
        <CardTitle>Voting History</CardTitle>
        <CardDescription>Recent voting activities</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Address</TableHead>
              <TableHead>Time</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {voters.map((voter, i) => {
              const formatedAmount = parseFloat(
                formatUnits(voter.votingPower, 2)
              ).toLocaleString();
              const formatedDate = moment(
                Number(voter.timestamp) * 1000
              ).format("LLLL");

              return (
                <TableRow key={i}>
                  <TableCell className="font-medium">
                    {String(voter.voter).slice(0, 5)}...
                    {String(voter.voter).slice(-5)}
                  </TableCell>
                  <TableCell className="font-medium">{formatedDate}</TableCell>
                  <TableCell>
                    <Badge variant={voter.support ? "default" : "destructive"}>
                      {voter.support ? "Yes" : "No"}
                    </Badge>
                  </TableCell>
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
