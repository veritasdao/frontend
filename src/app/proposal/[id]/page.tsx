import { ChartVoter } from "@/components/layout/proposal/detail/ChartVoter";
import Information from "@/components/layout/proposal/detail/Information";
import Donate from "@/components/layout/proposal/donate";
import React from "react";

export default function page() {
  return (
    <main className="grid xl:grid-cols-3 gap-5">
      <div className="col-span-2">
        <Information />
        <ChartVoter />
      </div>
      <div>
        <Donate />
      </div>
    </main>
  );
}
