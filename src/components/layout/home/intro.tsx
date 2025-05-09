import React from "react";
import { Orbit } from "../../Orbit";
import { LinkPreview } from "../../ui/link-preview";
import { BoxReveal } from "../../magicui/box-reveal";
import { HyperText } from "@/components/magicui/hyper-text";

export default function Intro() {
  return (
    <section className="space-y-3">
      <HyperText className="text-3xl 2xl:text-4xl font-bold">
        Revolution of Technology in World Starts Here
      </HyperText>
      <div className="xl:text-xl text-muted-foreground leading-9">
        <strong className="text-primary text-2xl underline-offset-4 underline">
          Veritas
        </strong>{" "}
        is a community-based crowdfunding and public funding platform built on
        the{" "}
        <LinkPreview url="https://portal.lisk.com/" className="font-bold">
          LISK
        </LinkPreview>{" "}
        network.
        <br />
        We empower{" "}
        <span className="text-primary font-medium">
          communities, developers, and individuals to bring projects to life
        </span>{" "}
        through a transparent voting system using{" "}
        <LinkPreview url="https://home.idrx.co/" className="font-bold">
          IDRX
        </LinkPreview>{" "}
        tokens. At Veritas, every vote counts. We reward voters who choose
        wisely, ensuring a fair and responsible decision-making process.
        Together with Veritas, we build a collaborative, open, and empowered
        future—one proposal, one vote, one real impact at a time.
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 place-content-center place-items-center">
        <div className="grid gap-5">
          <div className="border border-[#1d4ed8] p-5 rounded-md">
            <BoxReveal boxColor={"#1d4ed8"} duration={0.5}>
              <h2 className="text-2xl font-semibold">Build with Web3 </h2>
            </BoxReveal>
            <BoxReveal boxColor={"#1d4ed8"} duration={1}>
              <p className="text-muted-foreground">
                Learn blockchain while building real applications with IDRX
                tokens giving voting power in DAO decisions and benefiting from
                ecosystem growth
              </p>
            </BoxReveal>
          </div>
          <div className="border border-[#1d4ed8] p-5 rounded-md">
            <BoxReveal boxColor={"#1d4ed8"} duration={0.5}>
              <h2 className="text-2xl font-semibold">Total Transparency</h2>
            </BoxReveal>
            <BoxReveal boxColor={"#1d4ed8"} duration={1}>
              <p className="text-muted-foreground">
                All funding decisions and resource allocation are governed by
                smart contracts and community voting.
              </p>
            </BoxReveal>
          </div>
          <div className="border border-[#1d4ed8] p-5 rounded-md">
            <BoxReveal boxColor={"#1d4ed8"} duration={0.5}>
              <h2 className="text-2xl font-semibold">Sustainable Support</h2>
            </BoxReveal>
            <BoxReveal boxColor={"#1d4ed8"} duration={1}>
              <p className="text-muted-foreground">
                Innovative funding model that ensures developers can focus on
                their work, not fundraising.
              </p>
            </BoxReveal>
          </div>
          <div className="border border-[#1d4ed8] p-5 rounded">
            <BoxReveal boxColor={"#1d4ed8"} duration={0.5}>
              <h2 className="text-2xl font-semibold">Building Together</h2>
            </BoxReveal>
            <BoxReveal boxColor={"#1d4ed8"} duration={1}>
              <p className="text-muted-foreground">
                Join forces with thousands of other technology innovators in
                Indonesia to create greater impact.
              </p>
            </BoxReveal>
          </div>
        </div>
        <Orbit />
      </div>
    </section>
  );
}
