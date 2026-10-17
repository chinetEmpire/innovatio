import Image from "next/image";
import Link from "next/link";

import heroHome from "@/app/images/heroHome.png";
import { homeEmployerLogos } from "@/data/site";
import CoursePickerModal from "./CoursePickerModal";

export default function HomeHero() {
  return (
    <section className="overflow-hidden bg-white">
      <div className="grid lg:grid-cols-[1.05fr_0.95fr] lg:pl-[4.2%]">
        <div className="flex flex-col justify-start px-5 pb-14 pt-10 sm:px-8 lg:pb-20 lg:pl-0 lg:pr-[4.2%] lg:pt-10">
          
          <h1
            className="animate-fade-up mt-2 max-w-xl text-[32px] font-black leading-[1.05] tracking-tight sm:text-[38px] lg:mt-0 lg:text-[62px]"
            style={{ "--reveal-delay": "100ms" } as React.CSSProperties}
          >
            Train here. Get hired anywhere.
          </h1>
          <p
            className="animate-fade-up mt-10 max-w-md text-[19px] text-[#5f5b65]"
            style={{ "--reveal-delay": "200ms" } as React.CSSProperties}
          >
            Whether you&apos;re starting from scratch or switching careers, we&apos;ll help you build the confidence and
            experience needed to succeed in today&apos;s tech industry.
          </p>
          <div
            className="animate-fade-up mt-10 flex flex-wrap gap-3"
            style={{ "--reveal-delay": "300ms" } as React.CSSProperties}
          >
            <Link
              href="/enroll"
              data-control
              className="flex h-11 min-w-28 items-center justify-center rounded-full bg-brand px-5 text-sm font-semibold text-white transition-colors hover:bg-[#4520b4] lg:h-14 lg:min-w-40 lg:px-15 lg:text-lg"
            >
              Enroll now
            </Link>
            <CoursePickerModal />
          </div>
        </div>

        <div className="relative min-h-[320px] overflow-hidden bg-gradient-to-br from-brand to-[#6b3fe0] sm:min-h-[400px] lg:min-h-[560px]">
          <div className="animate-float-slow absolute -left-14 top-12 h-44 w-44 rounded-full bg-[#8a63ec]/50 blur-2xl" />
          <div className="animate-float-ring absolute -right-16 -bottom-16 h-64 w-64 rounded-full border-[32px] border-white/10" />
          <div className="absolute inset-0 flex items-center justify-center p-5">
            <Image
              src={heroHome}
              alt="Innovatio learner holding a laptop"
              priority
              className="animate-scale-in h-[90%] w-auto max-w-full object-contain drop-shadow-2xl"
            />
          </div>
        </div>
      </div>

      <div id="learners" className="border-t border-[#f0ebf7] bg-[#faf7ff] py-8 sm:py-10">
        <div className="flex flex-col gap-8 px-5 sm:px-8 lg:flex-row lg:items-center lg:justify-between lg:gap-x-6 lg:px-[4.2%]">
          <p className="text-2xl font-bold text-black lg:shrink-0 lg:whitespace-nowrap lg:text-[26px] xl:text-[32px]">
            Where our learners work:
          </p>
          <div className="min-w-0 overflow-hidden lg:flex-1">
            <div className="animate-marquee flex w-max items-center gap-x-6 gap-y-5">
              {[...homeEmployerLogos, ...homeEmployerLogos].map((brand, index) => (
                <Image
                  key={`${brand.alt}-${index < homeEmployerLogos.length ? 1 : 2}`}
                  src={brand.src}
                  alt={brand.alt}
                  className={brand.className ?? "max-h-14 w-auto shrink-0 lg:max-h-[3.25rem] xl:max-h-14"}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
