"use client";

import Image from "next/image";
import { TabAnimation } from "./ui/tab-animation";

export function ImageFlow() {
  const tabs = [
    {
      title: "Are you user?",
      value: "user-flow",
      content: (
        <div className="bg-secondary p-5 w-full space-y-5 rounded-md">
          <h1 className="text-4xl font-bold">User Flow</h1>
          <Image
            src="/images/user flow.png"
            alt="Flow"
            width={1920}
            height={1080}
            className="object-cover rounded-md"
          />
        </div>
      ),
    },
    {
      title: "Are you builder?",
      value: "builder",
      content: (
        <div className="bg-secondary p-5 w-full space-y-5 rounded-md">
          <h1 className="text-4xl font-bold">Builder Flow</h1>
          <Image
            src="/images/user flow.png"
            alt="Flow"
            width={1920}
            height={1080}
            className="object-cover rounded-md"
          />
        </div>
      ),
    },
  ];

  return (
    <div className="h-[20rem] md:h-[40rem] [perspective:1000px] relative b flex flex-col max-w-5xl mx-auto w-full items-start justify-start my-5">
      <TabAnimation tabs={tabs} />
      <div>
        <h1 className="text-4xl font-bold">Vote, Funding, & Earn</h1>
        <p className="text-xl text-muted-foreground">
          Support the right proposal, every voter gets a share from the reward
          pool.
        </p>
      </div>
    </div>
  );
}
