import HomeHero from "@/components/HomeHero";
import About from "@/components/About";
import LearningTracks from "@/components/LearningTracks";
import WhatSetsUsApart from "@/components/WhatSetsUsApart";
import Testimonials from "@/components/Testimonials";
import Faq from "@/components/Faq";
import NextCohort from "@/components/NextCohort";
import Footer from "@/components/Footer";

export default function Page() {
  return (
    <main>
      <HomeHero />
      <About />
      <LearningTracks />
      <WhatSetsUsApart />
      <Testimonials />
      <Faq />
      <NextCohort />
      <Footer />
    </main>
  );
}
