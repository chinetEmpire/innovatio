"use client";

import Image from "next/image";
import { useState } from "react";
import { Menu, X } from "lucide-react";

import logo from "@/app/images/logo.png";
import heroHome from "@/app/images/heroHome.png";
import { homeEmployerLogos, homeNavLinks } from "@/data/site";

export default function HomeHero() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <section className="overflow-hidden bg-white">
      <div className="grid md:min-h-[450px] md:grid-cols-[1.1fr_0.9fr]">
        <div className="px-5 py-6 sm:px-8 md:px-[12%] md:py-8">
          <div className="relative flex items-center justify-between gap-5 md:justify-start">
            <div className="shrink-0">
              <Image src={logo} alt="Innovatio Academy" className="h-auto w-[120px] sm:w-[132px]" priority />
            </div>
            <div className="hidden items-center gap-5 text-[11px] font-medium text-white md:flex md:ml-auto">
              {homeNavLinks.map(({ label, href }, index) => (
                <a key={label} href={href} className={index === 0 ? "text-white underline underline-offset-4" : "text-white"}>
                  {label}
                </a>
              ))}
            </div>
            <button
              type="button"
              aria-label="Toggle menu"
              aria-expanded={mobileOpen}
              className="relative z-30 flex h-9 w-9 items-center justify-center rounded-full border border-brand/20 bg-white text-brand shadow-sm md:hidden"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
            {mobileOpen && (
              <div className="absolute left-0 right-0 top-[calc(100%+12px)] z-40 rounded-lg border border-brand/10 bg-white p-5 text-sm shadow-lg md:hidden">
                <div className="flex flex-col gap-4">
                  {homeNavLinks.map(({ label, href }, index) => (
                    <a key={label} href={href} className={index === 0 ? "text-brand underline underline-offset-4" : "text-brand"}>
                      {label}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
          <div className="mt-14 max-w-[430px] sm:mt-16 md:mt-20">
            <h1 className="text-[clamp(30px,5vw,62px)] font-bold leading-[1.05] tracking-tight md:text-[clamp(38px,4.7vw,62px)]">
              Train here. Get
              hired anywhere.
            </h1>
            <p className="mt-5 max-w-[340px] text-[#5f5b65]">Whether you&apos;re starting from scratch or switching careers, we&apos;ll help you build the confidence and experience needed to succeed in today&apos;s tech industry.</p>
            <div className="mt-7 flex flex-wrap gap-3">
              <a className="rounded-full border border-brand px-5 py-3 font-semibold text-brand transition hover:bg-brand hover:text-white" href="/courses">View Courses</a>
              <a className="rounded-full bg-brand px-5 py-3 font-semibold text-white transition hover:scale-105" href="#cohort">Enroll now</a>
            </div>
          </div>
        </div>
        <div className="relative block min-h-[280px] overflow-hidden bg-brand sm:min-h-[340px] md:min-h-[450px]">
          <div className="absolute left-8 top-4 z-20 md:left-12 md:top-6">
            <nav className="hidden md:flex md:items-center md:gap-5 md:text-[11px] md:font-medium md:text-white">
              {homeNavLinks.map(({ label, href }, index) => (
                <a key={label} href={href} className={index === 0 ? "text-white underline underline-offset-4" : "text-white"}>
                  {label}
                </a>
              ))}
            </nav>
          </div>
          <div className="hero-orb absolute -left-16 top-10 h-40 w-40 rounded-full bg-[#7048df] md:h-48 md:w-48" />
          <div className="hero-ring absolute -right-20 bottom-[-90px] h-56 w-56 rounded-full border-[26px] border-[#6840d7] md:-right-24 md:h-72 md:w-72 md:border-[32px]" />
          <div className="absolute left-1/2 top-1/2 h-[290px] w-[280px] -translate-x-1/2 -translate-y-1/2 sm:h-[340px] sm:w-[330px] md:h-[430px] md:w-[410px]">
            <Image src={heroHome} alt="Innovatio learner holding a laptop" className="h-full w-full object-contain object-center" />
          </div>
        </div>
      </div>
      <div className="flex min-h-20 flex-col items-center justify-center gap-3 bg-[#faf7ff] px-5 py-4 text-center font-bold sm:flex-row sm:flex-wrap sm:gap-x-7">
        <span>Where our learners work:</span>
        <div className="flex max-w-full flex-wrap items-center justify-center gap-x-5 gap-y-3 sm:gap-x-7">
          {homeEmployerLogos.map((brand, index) => (
            <Image
              key={brand.alt}
              src={brand.src}
              alt="Innovatio graduate employer"
              className={`h-auto w-auto brightness-75 contrast-125 opacity-95 ${index === 5 ? "max-h-11 max-w-[135px] sm:max-h-14 sm:max-w-[170px]" : "max-h-7 max-w-[82px] sm:max-h-9 sm:max-w-[120px]"}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
