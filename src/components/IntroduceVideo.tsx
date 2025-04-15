"use client";
import React from "react";
import { ContainerScroll } from "./ui/container-scroll-animation";
import Hero from "./layout/home/hero";
import HeroVideoDialog from "./magicui/hero-video-dialog";

export function IntroduceVideo() {
  return (
    <div className="flex flex-col overflow-hidden">
      <ContainerScroll titleComponent={<Hero />}>
        {/* <Image
          src={`/linear.webp`}
          alt="hero"
          height={720}
          width={1400}
          className="mx-auto rounded-2xl object-cover h-full object-left-top"
          draggable={false}
        /> */}
        <div className="relative">
          <HeroVideoDialog
            className="block"
            animationStyle="from-center"
            videoSrc="https://www.youtube.com/embed/qh3NGpYRG3I?si=4rb-zSdDkVK9qxxb"
            thumbnailSrc="https://startup-template-sage.vercel.app/hero-dark.png"
            thumbnailAlt="Dummy Video Thumbnail"
          />
        </div>
      </ContainerScroll>
    </div>
  );
}
