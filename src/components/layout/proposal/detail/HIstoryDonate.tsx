"use client";
import useGetDonates from "@/hooks/getDonates";
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
import moment from "moment";
import { formatUnits } from "viem";

export default function HistoryDonate({ index }: { index: number }) {
  const { donates } = useGetDonates(index) as {
    donates: [string[], string[], string[]]; // pastikan semua string dulu
  };

  if (!donates || donates.length !== 3) {
    return <p className="text-center">Belum ada donasi</p>;
  }

  const [addresses, rawAmounts, rawTimestamps] = donates;

  return (
    <Table>
      <TableCaption>Riwayat donasi terbaru.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Address</TableHead>
          <TableHead>Waktu</TableHead>
          <TableHead className="text-right">Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {addresses.map((address, i) => {
          const amount = BigInt(rawAmounts[i]); // pastikan ini string seperti "50000"
          const timestamp = Number(rawTimestamps[i]); // pastikan ini string/number seperti "1745039130"

          const formatedAmount = formatUnits(amount, 2);
          const formatedDate = moment(timestamp * 1000).format("LLLL");

          return (
            <TableRow key={i}>
              <TableCell className="font-medium">
                {" "}
                {String(address).slice(0, 5)}...{String(address).slice(-5)}
              </TableCell>
              <TableCell>{formatedDate}</TableCell>
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
