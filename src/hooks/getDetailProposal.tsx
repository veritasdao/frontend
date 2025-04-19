"use client";

import { DAOABI, DAOToken } from "@/config/DAO";
import React from "react";
import { useReadContract } from "wagmi";

type ProposalType = {
  title: string;
  image: string;
  github: string;
  whitepaper: string;
  ownerlink: string;
  description: string;
  motivasi: string;
  rincian: string;
  keuntungan: string;
  tantangan: string;
  dampak_dan_hasil: string;
  proposer: string;
  requestedAmount: bigint;
  deadline: bigint;
  quorum: boolean;
  yesVotes: bigint;
  noVotes: bigint;
  executed: boolean;
  approved: boolean;
  withdrawn: boolean;
  rewardPool: bigint;
  totalYesPower: bigint;
  totalNoPower: bigint;
  totalDonated: bigint;
  voterCount: bigint;
  donationCount: bigint;
};

// Define the type for the raw data returned from the contract
type ProposalRawData = [
  string, // title
  string, // image
  string, // github
  string, // whitepaper
  string, // ownerlink
  string, // description
  string, // motivasi
  string, // rincian
  string, // keuntungan
  string, // tantangan
  string, // dampak_dan_hasil
  string, // proposer
  bigint, // requestedAmount
  bigint, // deadline
  boolean, // quorum
  bigint, // yesVotes
  bigint, // noVotes
  boolean, // executed
  boolean, // approved
  boolean, // withdrawn
  bigint, // rewardPool
  bigint, // totalYesPower
  bigint, // totalNoPower
  bigint, // totalDonated
  bigint, // voterCount
  bigint // donationCount
];

export default function useGetDetailProposals(index: number) {
  const { data, isLoading, refetch } = useReadContract({
    abi: DAOABI,
    address: DAOToken,
    functionName: "getProposalSummary",
    args: [index],
  });

  // Transform the array data into a structured object
  const proposal: ProposalType | null = data
    ? {
        title: (data as unknown as ProposalRawData)[0],
        image: (data as unknown as ProposalRawData)[1],
        github: (data as unknown as ProposalRawData)[2],
        whitepaper: (data as unknown as ProposalRawData)[3],
        ownerlink: (data as unknown as ProposalRawData)[4],
        description: (data as unknown as ProposalRawData)[5],
        motivasi: (data as unknown as ProposalRawData)[6],
        rincian: (data as unknown as ProposalRawData)[7],
        keuntungan: (data as unknown as ProposalRawData)[8],
        tantangan: (data as unknown as ProposalRawData)[9],
        dampak_dan_hasil: (data as unknown as ProposalRawData)[10],
        proposer: (data as unknown as ProposalRawData)[11],
        requestedAmount: (data as unknown as ProposalRawData)[12],
        deadline: (data as unknown as ProposalRawData)[13],
        quorum: (data as unknown as ProposalRawData)[14],
        yesVotes: (data as unknown as ProposalRawData)[15],
        noVotes: (data as unknown as ProposalRawData)[16],
        executed: (data as unknown as ProposalRawData)[17],
        approved: (data as unknown as ProposalRawData)[18],
        withdrawn: (data as unknown as ProposalRawData)[19],
        rewardPool: (data as unknown as ProposalRawData)[20],
        totalYesPower: (data as unknown as ProposalRawData)[21],
        totalNoPower: (data as unknown as ProposalRawData)[22],
        totalDonated: (data as unknown as ProposalRawData)[23],
        voterCount: (data as unknown as ProposalRawData)[24],
        donationCount: (data as unknown as ProposalRawData)[25],
      }
    : null;

  React.useEffect(() => {
    refetch();
  }, [refetch]);

  console.log(proposal);

  return {
    proposal,
    isLoading,
  };
}
