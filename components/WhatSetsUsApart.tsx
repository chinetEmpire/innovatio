"use client";

import Image from "next/image";
import Link from "next/link";
import { BriefcaseBusiness, Database, Rocket, Wrench } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import miscImage from "@/app/images/misc.png";

const highlights = [
  { title: "Learn by building", description: "We believe real learning happens through practice. From day one, you'll write code and work with industry-standard tools that strengthen your understanding.", Icon: Rocket },
  { title: "Real-World Experience", description: "Our programs are built around practical projects that reflect real workplace scenarios. You'll develop applications and gain hands-on experience that prepares you for the demands of the tech industry.", Icon: Database },
  { title: "Build with AI", description: "We teach you how to use modern technologies, including AI, the right way. Instead of relying on tools to do the work, you'll learn how to build with them.", Icon: Wrench },
  { title: "Career Preparation", description: "From portfolio development and technical interview coaching to mentorship and career guidance, we prepare you for opportunities in startups and established companies.", Icon: BriefcaseBusiness },
];

export default function WhatSetsUsApart() {
  const sectionRef = useRef<HTMLElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    let frame: number | undefined;
    const updateActiveSlide = () => {
      const section = sectionRef.current;
      if (!section) return;
      const distance = section.offsetHeight - window.innerHeight;
      const progress = Math.min(1, Math.max(0, (window.scrollY - section.offsetTop) / Math.max(distance, 1)));
      setActiveIndex(Math.min(highlights.length - 1, Math.floor(progress * highlights.length)));
      frame = undefined;
    };
    const onScroll = () => { if (frame === undefined) frame = window.requestAnimationFrame(updateActiveSlide); };
    updateActiveSlide();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame !== undefined) window.cancelAnimationFrame(frame);
    };
  }, []);

  const chooseSlide = (index: number) => {
    const section = sectionRef.current;
    if (!section) return;
    const distance = section.offsetHeight - window.innerHeight;
    window.scrollTo({ top: section.offsetTop + (distance * index) / highlights.length, behavior: "smooth" });
  };

  const active = highlights[activeIndex];
  const ActiveIcon = active.Icon;

  return (
    <section ref={sectionRef} className="relative h-[400vh]" aria-label="What sets us apart">
      <div className="sticky top-0 flex min-h-screen items-center overflow-hidden px-5 py-16 sm:px-8 lg:px-[6.3%]">
        <div className="grid w-full items-center gap-12 lg:grid-cols-[1.08fr_0.92fr] lg:gap-16">
          <div>
            <h2 className="text-3xl font-black tracking-tight text-black sm:text-4xl">What Sets Us Apart</h2>
            <div className="mt-8 grid grid-cols-[40px_minmax(0,1fr)] gap-6 sm:mt-12 sm:grid-cols-[54px_minmax(0,1fr)] sm:gap-10">
              <div className="flex flex-col" aria-label={`Slide ${activeIndex + 1} of ${highlights.length}`}>
                {highlights.map((item, index) => (
                  <button key={item.title} type="button" data-control aria-label={`Show ${item.title}`} aria-current={index === activeIndex ? "true" : undefined} onClick={() => chooseSlide(index)} className={`h-16 border-l-2 transition-colors duration-300 sm:h-24 ${index === activeIndex ? "border-brand" : "border-[#d0d0d0]"}`} />
                ))}
              </div>
              <div key={active.title} className="animate-fade-up pb-1">
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[#eee8ff] text-brand sm:h-[68px] sm:w-[68px]"><ActiveIcon size={26} strokeWidth={1.8} aria-hidden="true" /></span>
                <h3 className="mt-4 text-xl font-semibold text-[#15121a] sm:mt-6">{active.title}</h3>
                <p className="mt-3 max-w-[570px] text-[18px] leading-relaxed text-[#5f5b65] sm:mt-4">{active.description}</p>
                <Link href="/enroll" data-control className="mt-6 inline-flex h-11 min-w-28 items-center justify-center rounded-full bg-brand px-5 text-sm font-semibold text-white transition-colors hover:bg-[#4520b4] sm:mt-8 sm:h-12 sm:min-w-32 sm:px-6 sm:text-base lg:h-[68px] lg:min-w-[184px] lg:px-6 lg:text-xl">Enroll now</Link>
              </div>
            </div>
          </div>
          <div className="relative mx-auto hidden w-full max-w-[520px] lg:block"><Image src={miscImage} alt="Learners collaborating" className="aspect-square w-full rounded-[48%] object-cover" /></div>
        </div>
      </div>
    </section>
  );
}
