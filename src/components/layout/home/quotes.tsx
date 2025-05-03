import React from "react";
import { Button } from "../../ui/button";
import { BorderBeam } from "../../magicui/border-beam";
import { SparklesText } from "../../magicui/sparkles-text";
import Link from "next/link";

export default function Quotes() {
  return (
    <section className="text-center space-y-10">
      <SparklesText>
        &quot;In the digital world, the best contribution is one that is open to
        all and impacts many.&quot;
      </SparklesText>
      <h1 className="text-2xl xl:hidden font-bold mb-4">
        &quot;In the digital world, the best contribution is one that is open to
        all and impacts many.&quot;
      </h1>
      <h2 className="text-xl">
        <strong>Vitalik Buterin</strong> - Co-founder of Ethereum
      </h2>
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
