import ProposalCard from "@/components/ProposalCard";
import React from "react";

export default function Proposal() {
  return (
    <section className="space-y-10">
      <h1 className="text-xl text-muted-foreground">
        Menampilkan <strong className="text-primary">1000 Proposal</strong>
      </h1>
      <ProposalCard />
    </section>
  );
}
