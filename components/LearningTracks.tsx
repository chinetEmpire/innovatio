import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { tracks } from "@/data/tracks";
import Reveal from "./Reveal";

export default function LearningTracks() {
  return (
    <section id="tracks" className="bg-[#faf7ff] py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <Reveal className="max-w-2xl">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Our learning tracks</h2>
          <p className="mt-4 text-base text-[#5f5b65]">
            We aim to build an ecosystem for young techies and startup companies that create value and make a difference
            while staying up to date with the new technologies.
          </p>
        </Reveal>
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {tracks.map((track, index) => (
            <Reveal key={track.title} delay={index * 120}>
              <article className="group h-full overflow-hidden rounded-2xl border border-[#e9e2f5] bg-white transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_24px_48px_rgba(47,31,101,0.14)]">
                <div className="overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={track.image}
                    alt={track.title}
                    className="h-56 w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-6 sm:p-7">
                  <h3 className="text-xl font-semibold">{track.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-[#5f5b65]">{track.description}</p>
                  <Link
                    href="/courses"
                    className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-brand transition-all duration-300 hover:gap-3"
                  >
                    View curriculum <ArrowRight size={16} />
                  </Link>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
