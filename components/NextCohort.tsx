"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import flowerImage from "@/app/images/flower.png";
import nextImage from "@/app/images/next.jpg";
import secondStepImage from "@/app/images/sec.png";
import thirdStepImage from "@/app/images/third.png";
import { cohortSteps } from "@/data/cohortSteps";
import Reveal from "./Reveal";

const stepImages = [nextImage, secondStepImage, thirdStepImage];
const stepImageAlts = [
  "Student learning online",
  "Students taking an assessment",
  "Students starting their learning journey",
];

export default function NextCohort() {
  const [activeStep, setActiveStep] = useState(0);

  return (
    <section id="cohort" className="bg-[#faf8ff] px-5 py-16 sm:px-8 sm:py-20">
      <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2">
        <Reveal>
          <div>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Join Our Next Cohort</h2>
            <p className="mt-5 max-w-md text-base leading-relaxed text-[#5f5b65]">
              Next Cohort Starts 21st of September, 2026. Registration starts on 7th of August, 2026 and closes on 7th of September, 2026. Apply now!
            </p>
            <Image src={flowerImage} alt="Innovatio Academy student" className="mt-8 hidden h-auto w-80 lg:block" />
          </div>
        </Reveal>

        <div className="lg:pt-2">
          {cohortSteps.map(({ title, description }, index) => (
            <Reveal key={title} delay={index * 120}>
              <div className="flex gap-4 border-b border-[#ded9e8] pb-6 pt-1 last:border-b-0 last:pb-0">
                <div className="flex w-6 shrink-0 flex-col items-center">
                  <button
                    type="button"
                    data-control
                    aria-label={`Show ${title}`}
                    aria-pressed={activeStep === index}
                    onClick={() => setActiveStep(index)}
                    className={`mt-1 h-3 w-3 min-w-0 rounded-full p-0 transition-colors ${
                      index <= activeStep ? "bg-[#f4c51b]" : "bg-[#c7c5c8]"
                    }`}
                  />
                  {index < cohortSteps.length - 1 && <span className="mt-1 w-px flex-1 bg-[#ded9e8]" />}
                </div>
                <div className="min-w-0 flex-1 pb-1">
                  <h3 className={`text-base font-semibold ${activeStep === index ? "text-ink" : "text-[#68656b]"}`}>{title}</h3>
                  <p className="mt-2 max-w-md text-sm leading-relaxed text-[#68656b]">{description}</p>
                  {activeStep === index && (
                    <Image
                      src={stepImages[index]}
                      alt={stepImageAlts[index]}
                      className="mt-4 h-40 w-full rounded-lg object-cover object-center sm:h-48"
                    />
                  )}
                </div>
              </div>
            </Reveal>
          ))}
          <Reveal delay={360}>
            <Link
              href="/enroll"
              className="mt-8 flex h-[58px] w-[165px] items-center justify-center rounded-full bg-brand text-[20px] font-semibold text-white shadow-[0_10px_22px_rgba(84,41,208,0.3)] transition-transform hover:scale-[1.03] active:scale-95 lg:h-[68px] lg:w-[184px] lg:text-[24px]"
            >
              Enroll now
            </Link>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
