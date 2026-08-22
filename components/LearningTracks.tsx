import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { tracks } from "@/data/tracks";
import Reveal from "./Reveal";

export default function LearningTracks() {
  return (
    <section id="tracks" className="bg-[#faf7ff] py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-5 sm:px-8 ">
        <Reveal className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-center">Our learning tracks</h2>
          <p className="mt-4 text-base text-[#5f5b65] text-center">
            We aim to build an ecosystem for young techies and startup companies that create value and make a difference
            while staying up to date with the new technologies.
          </p>
        </Reveal>
        <div className="mx-auto mt-10 grid grid-cols-1 gap-6 min-[600px]:grid-cols-2">
          {tracks.map((track, index) => (
            <Reveal key={track.title} delay={index * 120}>
              <article className="group flex h-full flex-col overflow-hidden rounded-[14px] border border-[#ded9e8] bg-white p-2 shadow-[0_7px_18px_rgba(47,31,101,0.12)] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_18px_32px_rgba(47,31,101,0.16)]">
                <div className="overflow-hidden rounded-[11px]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={track.image}
                    alt={track.title}
                    className="aspect-[1.94] h-auto w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="min-h-[78px] flex-1 px-3 pb-2 pt-3">
                  <h3 className="text-[14px] font-semibold leading-tight">{track.title}</h3>
                  <p className="mt-2 text-[11px] leading-[1.35] text-[#5f5b65]">{track.description}</p>
                </div>
                <Link
                  href="/courses"
                  className="-mx-2 -mb-2 mt-3 py-8 flex h-9 items-center gap-1.5 bg-brand px-5 text-[20px] font-semibold text-white transition-colors duration-300 hover:bg-[#4520b4]"
                >
                  View curriculum <ArrowRight size={14} />
                </Link>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
