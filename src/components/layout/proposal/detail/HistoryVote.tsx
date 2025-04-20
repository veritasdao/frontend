"use client";
import useGetVoters from "@/hooks/getVoters";
import React from "react";

import {
  Table,
  TableBody,
  TableCaption,
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
    voters: [string[], boolean[], string[], string[], string[]]; // assumed all stringified from contract
  };

  if (!voters || voters.length < 5) {
    return <p className="text-center">Belum ada voting</p>;
  }

  const [addresses, supports, rawAmounts, , rawTimestamps] = voters;

  return (
    <Table>
      <TableCaption>Riwayat voting terbaru.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Address</TableHead>
          <TableHead>Waktu</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {addresses.map((address, i) => {
          const support = supports[i];
          const amount = BigInt(rawAmounts[i]);
          const timestamp = Number(rawTimestamps[i]);

          const formatedAmount = formatUnits(amount, 2);
          const formatedDate = moment(timestamp * 1000).format("LLLL");

          return (
            <TableRow key={i}>
              <TableCell className="font-medium">
                {String(address).slice(0, 5)}...{String(address).slice(-5)}
              </TableCell>
              <TableCell className="font-medium">{formatedDate}</TableCell>
              <TableCell>
                <Badge variant={support ? "default" : "destructive"}>
                  {support ? "Yes" : "No"}
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
  );
}
