import { HyperText } from "@/components/magicui/hyper-text";
import React from "react";
import { ImageFlow } from "@/components/ImageFlow";

export default function Flow() {
  return (
    <section className="border py-5 rounded-md">
      <HyperText className="text-center font-bold text-4xl">
        How it works
      </HyperText>
      <ImageFlow />
    </section>
  );
}
