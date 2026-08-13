import Image from "next/image";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

import flowerImage from "@/app/images/flower.png";
import { cohortSteps } from "@/data/cohortSteps";
import { footerInfo } from "@/data/site";
import Reveal from "./Reveal";

export default function NextCohort() {
  return (
    <section id="cohort" className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
      <div className="grid items-center gap-12 lg:grid-cols-2">
        <Reveal>
          <div>
            <span className="inline-block rounded-full border border-brand/20 bg-brand/5 px-3.5 py-1.5 text-xs font-semibold text-brand">
              Limited seats
            </span>
            <h2 className="mt-5 text-3xl font-bold tracking-tight sm:text-4xl">Join our next cohort</h2>
            <p className="mt-4 max-w-md text-base leading-relaxed text-[#5f5b65]">
              The next cohort starts <b className="text-ink">September 21, 2026</b>. Registration opens August 7, 2026
              and closes September 7, 2026. Apply now to secure your seat.
            </p>
            <Image src={flowerImage} alt="Innovatio Academy student" className="mt-8 hidden h-auto w-64 lg:block" />
          </div>
        </Reveal>

        <div>
          {cohortSteps.map(({ title, description }, index) => (
            <Reveal key={title} delay={index * 120}>
              <div className="flex gap-4 pb-8 last:pb-0">
                <div className="flex flex-col items-center">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand text-white shadow-[0_6px_16px_rgba(84,41,208,0.35)]">
                    <CheckCircle2 size={18} />
                  </span>
                  {index < cohortSteps.length - 1 && <span className="mt-2 w-px flex-1 bg-[#e4dcf4]" />}
                </div>
                <div className="pt-1">
                  <h3 className="text-lg font-semibold">{title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-[#5f5b65]">{description}</p>
                </div>
              </div>
            </Reveal>
          ))}
          <Reveal delay={360}>
            <Link
              href={`mailto:${footerInfo.email}`}
              className="mt-2 inline-flex items-center rounded-full bg-brand px-6 py-3 text-sm font-semibold text-white shadow-[0_10px_22px_rgba(84,41,208,0.3)] transition-transform hover:scale-[1.03] active:scale-95"
            >
              Apply now
            </Link>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
