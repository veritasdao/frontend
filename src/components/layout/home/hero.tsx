import React from "react";
import { Button } from "@/components/ui/button";
import { AvatarUser } from "../../AvatarUser";
import { BorderBeam } from "../../magicui/border-beam";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="flex flex-col items-center justify-center gap-10 text-center py-10">
      <span className="pointer-events-none whitespace-pre-wrap bg-gradient-to-t from-black to-white bg-clip-text text-center text-4xl xl:text-7xl 2xl:text-8xl font-semibold leading-none text-transparent dark:from-white dark:to-slate-900/10">
        Raise Money, Support Creators, Build the Future
      </span>
      <h1 className="xl:text-2xl font-medium text-muted-foreground xl:w-1/2">
        Supporting Builders and Innovators Through Community-Based Decentralized
        Funding.
      </h1>
      <AvatarUser />
      <Link href={"/proposal"} target="_blank">
        <Button
          size={"lg"}
          className="shadow-xl shadow-[#1d4ed8] relative px-10 py-6 text-lg"
          variant={"outline"}
        >
          Getting Started
          <BorderBeam
            duration={5}
            size={80}
            colorFrom="#1d4ed8"
            colorTo="#1d4ed8"
          />
        </Button>
      </Link>
    </section>
  );
}
