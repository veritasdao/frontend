import { HyperText } from "@/components/magicui/hyper-text";
import React from "react";
// import { ImageFlow } from "@/components/ImageFlow";
import Image from "next/image";

export default function Flow() {
  return (
    <section className="space-y-5">
      <HyperText className="text-center font-bold text-4xl">
        How it works
      </HyperText>
      <Image
        src="/images/VERITAS ON CHAIN SYSTEM.png"
        alt="flow"
        width={1920}
        height={1080}
        className="w-full rounded-md"
      />
      {/* <ImageFlow /> */}
      <div>
        <h1 className="text-4xl font-bold">Vote, Funding, & Earn</h1>
        <p className="text-xl text-muted-foreground">
          Support the right proposal, every voter gets a share from the reward
          pool.
        </p>
      </div>
    </section>
  );
}
