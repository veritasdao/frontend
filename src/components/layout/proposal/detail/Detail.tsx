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
          <h2 className="text-2xl font-bold text-[#3b82f6]">Abstrak</h2>
          <p>{proposal?.description}</p>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-[#3b82f6]">Motivasi</h2>
          <p>{proposal?.motivasi}</p>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-[#3b82f6]">Rincian</h2>
          <p className="whitespace-pre-line">{proposal?.rincian}</p>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-[#3b82f6]">
            Manfaat/Keuntungan
          </h2>
          <p>{proposal?.keuntungan}</p>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-[#3b82f6]">Tantangan</h2>
          <p>{proposal?.tantangan}</p>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-[#3b82f6]">
            Dampak dan Hasil
          </h2>
          <p>{proposal?.dampak_dan_hasil}</p>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-[#3b82f6] mb-1">
            Dokumen Pendukung
          </h2>

          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <BookUser />
              <p>Pemilik proposal:</p>
              <LinkPreview url={`${proposal?.ownerlink}`}>
                <span className="text-[#3b82f6]">{proposal?.ownerlink}</span>
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
