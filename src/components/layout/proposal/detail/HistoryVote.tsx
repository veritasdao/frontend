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

export default function HistoryVote({ index }: { index: number }) {
  const { voters } = useGetVoters(index) as { voters: Array<string> };
  const address = voters ? voters[0] : 0;
  const support = voters ? voters[1] : null;
  const amount = voters ? voters[2] : 0;

  return (
    <Table>
      <TableCaption>A list of your recent invoices.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Address</TableHead>
          <TableHead>Waktu</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell className="font-medium">{address}</TableCell>
          <TableCell className="font-medium">April 18, 2025 11:49 AM</TableCell>
          <TableCell>
            <Badge variant={support ? "default" : "destructive"}>
              {support ? "Yes" : "No"}
            </Badge>
          </TableCell>
          <TableCell className="text-right text-xl">
            {formatUnits(BigInt(amount), 2)}{" "}
            <span className="text-sm">IDRX</span>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}
