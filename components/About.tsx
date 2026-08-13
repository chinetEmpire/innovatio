import Image from "next/image";

import useImage from "@/app/images/innovate.png";
import Reveal from "./Reveal";

export default function About() {
  return (
    <section id="about" className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
      <div className="grid items-center gap-12 lg:grid-cols-2">
        <Reveal>
          <div className="relative mx-auto w-full max-w-[430px]">
            <div className="absolute -left-4 -top-4 h-28 w-28 rounded-2xl bg-brand/10" aria-hidden />
            <div className="relative h-[280px] w-full overflow-hidden rounded-2xl bg-[#f5f5f5] shadow-[0_24px_48px_rgba(47,31,101,0.12)] sm:h-[320px]">
              <Image
                src={useImage}
                alt="Innovatio learners"
                className="h-full w-full object-contain object-center"
                priority
              />
            </div>
          </div>
        </Reveal>

        <Reveal delay={150}>
          <div>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">About Innovatio</h2>
            <p className="mt-5 text-base leading-relaxed text-[#5f5b65]">
              Great careers aren&apos;t built on certificates alone — they&apos;re built on knowledge, experience, and the
              ability to solve real-world challenges. That&apos;s the philosophy behind Innovatio Academy.
            </p>
            <p className="mt-4 text-base leading-relaxed text-[#5f5b65]">
              Our mission is to train, mentor, and empower the next generation of software engineers and cybersecurity
              professionals through practical, project-based learning that reflects the realities of the modern tech
              industry.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
