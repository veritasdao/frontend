"use client";
import { DAOABI, DAOToken } from "@/config/DAO";
import React from "react";
import { useReadContract } from "wagmi";

type TokenInfoType = {
  name: string;
  symbol: string;
  decimals: number;
  totalSupply: bigint;
  tokenAddress: string;
  creator: string;
  createdAt: bigint;
  teamAllocation: bigint;
  communityAllocation: bigint;
  publicAllocation: bigint;
  distributed: boolean;
};

type tokenInfoRawData = [
  string, // name
  string, // symbol
  number, // decimals
  bigint, // totalSupply
  string, // tokenAddress
  string, // creator
  bigint, // createdAt
  bigint, // teamAllocation
  bigint, // communityAllocation
  bigint, // publicAllocation
  boolean // distributed
];

export default function useGetTokenInfo({ index }: { index: number }) {
  const { data, refetch: refetchTokenInfo } = useReadContract({
    address: DAOToken,
    abi: DAOABI,
    functionName: "getTokenInfo",
    args: [index],
  });

  const tokenInfo: TokenInfoType | null = data
    ? {
        name: (data as unknown as tokenInfoRawData)[0],
        symbol: (data as unknown as tokenInfoRawData)[1],
        decimals: (data as unknown as tokenInfoRawData)[2],
        totalSupply: (data as unknown as tokenInfoRawData)[3],
        tokenAddress: (data as unknown as tokenInfoRawData)[4],
        creator: (data as unknown as tokenInfoRawData)[5],
        createdAt: (data as unknown as tokenInfoRawData)[6],
        teamAllocation: (data as unknown as tokenInfoRawData)[7],
        communityAllocation: (data as unknown as tokenInfoRawData)[8],
        publicAllocation: (data as unknown as tokenInfoRawData)[9],
        distributed: (data as unknown as tokenInfoRawData)[10],
      }
    : null;

  React.useEffect(() => {
    refetchTokenInfo();
  }, [refetchTokenInfo]);

  return {
    tokenInfo,
  };
}
