import Image from "next/image";
import Link from "next/link";

import heroHome from "@/app/images/heroHome.png";
import { homeEmployerLogos } from "@/data/site";

export default function HomeHero() {
  return (
    <section className="overflow-hidden bg-white">
      <div className="grid lg:grid-cols-[1.05fr_0.95fr]">
        <div className="flex flex-col justify-center px-5 py-14 sm:px-8 lg:px-[8%] lg:py-20">
          
          <h1
            className="animate-fade-up mt-6 max-w-xl text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl"
            style={{ "--reveal-delay": "100ms" } as React.CSSProperties}
          >
            Train here. Get hired anywhere.
          </h1>
          <p
            className="animate-fade-up mt-5 max-w-md text-base text-[#5f5b65]"
            style={{ "--reveal-delay": "200ms" } as React.CSSProperties}
          >
            Whether you&apos;re starting from scratch or switching careers, we&apos;ll help you build the confidence and
            experience needed to succeed in today&apos;s tech industry.
          </p>
          <div
            className="animate-fade-up mt-8 flex flex-wrap gap-3"
            style={{ "--reveal-delay": "300ms" } as React.CSSProperties}
          >
            <Link
              href="/apply"
              className="rounded-full bg-brand px-6 py-3 text-sm font-semibold text-white shadow-[0_10px_22px_rgba(84,41,208,0.3)] transition-transform hover:scale-[1.03] active:scale-95"
            >
              Enroll now
            </Link>
            <Link
              href="/courses"
              className="rounded-full border border-[#e2d9f2] px-6 py-3 text-sm font-semibold text-ink transition-colors hover:border-brand hover:text-brand"
            >
              View courses
            </Link>
          </div>
          <div
            className="animate-fade-up mt-10 flex flex-wrap gap-x-10 gap-y-5"
            style={{ "--reveal-delay": "400ms" } as React.CSSProperties}
          >
            <div>
              <p className="text-2xl font-bold tracking-tight">4.8/5</p>
              <p className="mt-1 text-sm text-[#8a8493]">2.5k+ learner reviews</p>
            </div>
            <div>
              <p className="text-2xl font-bold tracking-tight">6 months</p>
              <p className="mt-1 text-sm text-[#8a8493]">to job-ready skills</p>
            </div>
            <div>
              <p className="text-2xl font-bold tracking-tight">No IT</p>
              <p className="mt-1 text-sm text-[#8a8493]">background needed</p>
            </div>
          </div>
        </div>

        <div className="relative min-h-[320px] overflow-hidden bg-gradient-to-br from-brand to-[#6b3fe0] sm:min-h-[400px] lg:min-h-[560px]">
          <div className="animate-float-slow absolute -left-14 top-12 h-44 w-44 rounded-full bg-[#8a63ec]/50 blur-2xl" />
          <div className="animate-float-ring absolute -right-16 -bottom-16 h-64 w-64 rounded-full border-[32px] border-white/10" />
          <div className="absolute inset-0 flex items-center justify-center p-8">
            <Image
              src={heroHome}
              alt="Innovatio learner holding a laptop"
              priority
              className="animate-scale-in h-[85%] w-auto max-w-full object-contain drop-shadow-2xl"
            />
          </div>
        </div>
      </div>

      <div className="border-t border-[#f0ebf7] bg-[#faf7ff] px-5 py-6">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 sm:flex-row sm:justify-between">
          <p className="text-sm font-medium text-[#8a8493]">Where our learners work:</p>
          <div className="flex flex-wrap items-center justify-center gap-x-7 gap-y-3">
            {homeEmployerLogos.map((brand) => (
              <Image
                key={brand.alt}
                src={brand.src}
                alt={brand.alt}
                className="max-h-6 w-auto opacity-55 grayscale transition duration-300 hover:opacity-100 hover:grayscale-0"
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
