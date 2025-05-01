import Featured from "@/components/layout/community/featured";
import Hero from "@/components/layout/community/hero";
import React from "react";
import CommunityCard from "@/components/layout/community/CommunityCard";

export default function page() {
  return (
    <main className="space-y-10">
      <Hero />
      <Featured />
      <CommunityCard />
    </main>
  );
}
