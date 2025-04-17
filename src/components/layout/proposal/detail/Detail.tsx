"use client";
import { Button } from "@/components/ui/button";
import { LinkPreview } from "@/components/ui/link-preview";
// import { DAOABI, DAOToken } from "@/config/DAO";
import useGetProposals from "@/hooks/getProposal";
import { Github, Newspaper } from "lucide-react";
import React from "react";
// import { useReadContract } from "wagmi";

export default function Detail() {
  const { proposals, isLoading } = useGetProposals();
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
      {proposals?.map((proposal, index: number) => {
        return (
          <div className="space-y-5" key={index}>
            <div>
              <h2 className="text-2xl font-bold text-muted-foreground">
                About -{" "}
                <span className="font-normal text-primary">
                  {proposal.title}
                </span>
              </h2>
              <p>{proposal.description}</p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-muted-foreground">
                Resource & Reference -{" "}
                <span className="font-normal text-primary">
                  {proposal.title}
                </span>
              </h2>

              <div className="space-x-5">
                <LinkPreview url={`${proposal.github}`}>
                  <Button size={"lg"}>
                    <Github />
                  </Button>
                </LinkPreview>

                <LinkPreview url={`${proposal.github}`}>
                  <Button size={"lg"}>
                    <Newspaper />
                  </Button>
                </LinkPreview>
              </div>
            </div>
          </div>
        );
      })}
    </section>
  );
}
