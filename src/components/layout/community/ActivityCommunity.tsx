"use client";
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

export default function ActivityCommunity() {
  return (
    <div className="rounded-md border">
      <Table>
        <TableCaption>A list of earn activity community</TableCaption>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead>Proposal</TableHead>
            <TableHead className="text-green-500">Yes Vote</TableHead>
            <TableHead className="text-destructive">No Vote</TableHead>
            <TableHead className="text-right">Earning</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell className="font-medium">Proposal 1</TableCell>
            <TableCell>100</TableCell>
            <TableCell>100</TableCell>
            <TableCell className="text-right">$250.00</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
}
