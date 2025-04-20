import { IntroduceVideo } from "@/components/IntroduceVideo";
import Flow from "@/components/layout/home/flow";
import HomeHeader from "@/components/layout/home/HomeHeader";
import Intro from "@/components/layout/home/intro";
import Quotes from "@/components/layout/home/quotes";
import { Testimonials } from "@/components/layout/home/testimonials";
import { Velocity } from "@/components/layout/home/Velocity";

export default function Home() {
  return (
    <main className="m-5 xl:mx-20 2xl:mx-40 space-y-32">
      <HomeHeader />
      <IntroduceVideo />
      <Velocity />
      <Intro />
      <Flow />
      <Quotes />
      <Testimonials />
    </main>
  );
}
