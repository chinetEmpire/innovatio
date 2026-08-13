import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Code2 } from "lucide-react";

import miscImage from "@/app/images/misc.png";
import Reveal from "./Reveal";

export default function WhatSetsUsApart() {
  return (
    <section className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
      <div className="grid items-center gap-12 lg:grid-cols-2">
        <Reveal>
          <div>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">What sets us apart</h2>
            <div className="mt-8 border-l-2 border-[#d8c6ff] pl-6">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand/10 text-brand">
                <Code2 size={20} />
              </span>
              <h3 className="mt-5 text-xl font-semibold">Learn by building</h3>
              <p className="mt-3 max-w-md text-base leading-relaxed text-[#5f5b65]">
                Real learning happens through practice. From day one, you&apos;ll write code and work with
                industry-standard tools that strengthen your understanding.
              </p>
              <Link
                href="/apply"
                className="mt-7 inline-flex items-center gap-1.5 rounded-full bg-brand px-6 py-3 text-sm font-semibold text-white shadow-[0_10px_22px_rgba(84,41,208,0.3)] transition-transform hover:scale-[1.03] active:scale-95"
              >
                Enroll now <ArrowUpRight size={16} />
              </Link>
            </div>
          </div>
        </Reveal>

        <Reveal delay={150}>
          <div className="relative mx-auto max-w-md">
            <div className="absolute -right-5 -top-5 h-28 w-28 rounded-2xl bg-brand/10" aria-hidden />
            <Image
              src={miscImage}
              alt="Learners collaborating"
              className="relative aspect-square w-full rounded-3xl object-cover shadow-[0_24px_48px_rgba(47,31,101,0.16)]"
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
