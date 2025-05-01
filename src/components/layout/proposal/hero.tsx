import { Button } from "@/components/ui/button";
import React from "react";

export default function Hero() {
  return (
    <section>
      <h1 className="text-5xl font-bold">
        On-chain Proposals, <br />
        Real-world Impact
      </h1>
      <p className="text-muted-foreground w-1/2 mt-2">
        Temukan proposal yang layak didukung. Voting, danai, dan bantu projek
        mereka. Semua proposal di sini tervalidasi di blockchain LISK. Voting
        menggunakan IDRX untuk mendukung ide yang kamu yakini.
      </p>
      <Button className="mt-4" size="lg">
        Buat Proposal
      </Button>
    </section>
  );
}
