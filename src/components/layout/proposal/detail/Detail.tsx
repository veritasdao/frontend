"use client";
import { LinkPreview } from "@/components/ui/link-preview";
import useGetDetailProposals from "@/hooks/getDetailProposal";
// import { DAOABI, DAOToken } from "@/config/DAO";
import { BookUser, Github, Newspaper } from "lucide-react";
import React from "react";
// import { useReadContract } from "wagmi";

export default function Detail({ index }: { index: number }) {
  const { proposal, isLoading } = useGetDetailProposals(index);
  // const [index, setIndex] = React.useState<number | null>(null);

  // React.useEffect(() => {
  //   if (proposals && proposals.length > 0) {
  //     setIndex(proposals.length - 1);
  //   }
  // }, [proposals]);

  // const {
  //   data: totalDonations,
  //   isLoading: loadingTotalDonations,
  //   refetch,
  // } = useReadContract({
  //   abi: DAOABI,
  //   address: DAOToken,
  //   functionName: "getTotalDonations",
  //   args: [index],
  // });

  // React.useEffect(() => {
  //   refetch();
  // }, [refetch]);

  return (
    <section>
      {isLoading && <p>Loading...</p>}
      <div className="space-y-5" key={index}>
        <div>
          <h2 className="text-2xl font-bold text-[#3b82f6]">Abstract</h2>
          <p>{proposal?.description}</p>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-[#3b82f6]">Motivation</h2>
          <p>{proposal?.motivasi}</p>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-[#3b82f6]">Details</h2>
          <p className="whitespace-pre-line">{proposal?.rincian}</p>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-[#3b82f6]">
            Benefits/Advantages
          </h2>
          <p>{proposal?.keuntungan}</p>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-[#3b82f6]">Challenges</h2>
          <p>{proposal?.tantangan}</p>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-[#3b82f6]">
            Impact and Results
          </h2>
          <p>{proposal?.dampakdanhasil}</p>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-[#3b82f6] mb-1">
            Supporting Documents
          </h2>

          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <BookUser />
              <p>Proposal owner:</p>
              <LinkPreview url={`${proposal?.ownerLink}`}>
                <span className="text-[#3b82f6]">{proposal?.ownerLink}</span>
              </LinkPreview>
            </div>
            <div className="flex items-center gap-2">
              <Github />
              <p>Github:</p>
              <LinkPreview url={`${proposal?.github}`}>
                <span className="text-[#3b82f6]">{proposal?.github}</span>
              </LinkPreview>
            </div>
            <div className="flex items-center gap-2">
              <Newspaper />
              <p>Whitepaper:</p>
              <LinkPreview url={`${proposal?.whitepaper}`}>
                <span className="text-[#3b82f6]">{proposal?.whitepaper}</span>
              </LinkPreview>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
