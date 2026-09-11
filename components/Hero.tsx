import Image from "next/image";

import type { CourseFact } from "@/data/courses";

import heroImage from "@/app/images/hero.jpg";

type HeroProps = {
  badge: string;
  title: string;
  subtitle: string;
  facts: CourseFact[];
};

export default function Hero({ badge, title, subtitle, facts }: HeroProps) {
  return (
    <>
      <section id="home" className="relative overflow-hidden text-white">
        <Image src={heroImage} alt="Software engineering students" priority fill className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-br from-[#2d0f7a]/95 via-[#4a21b8]/85 to-[#6b3fe0]/75" aria-hidden />
        <div className="relative z-10 flex h-[416px] flex-col items-center justify-center px-5 pb-20 pt-16 text-center sm:px-8 lg:px-[4.2%]">
          {badge && (
            <span
              className="animate-fade-up rounded-full border border-white/25 bg-white/10 px-3.5 py-1.5 text-xs font-semibold backdrop-blur"
              style={{ "--reveal-delay": "0ms" } as React.CSSProperties}
            >
              {badge}
            </span>
          )}
          <h1
            className="animate-fade-up mt-5 max-w-none text-4xl font-black leading-tight tracking-tight whitespace-normal sm:whitespace-nowrap sm:text-5xl lg:text-6xl"
            style={{ "--reveal-delay": "100ms" } as React.CSSProperties}
          >
            {title}
          </h1>
          <p
            className="animate-fade-up mt-5 max-w-xl text-base text-white/85"
            style={{ "--reveal-delay": "200ms" } as React.CSSProperties}
          >
            {subtitle}
          </p>
        </div>
      </section>

      <div className="relative z-10 -mt-[94px] px-6 pb-12">
        <div
          className="animate-fade-up mx-auto grid max-w-[64rem] grid-cols-2 gap-x-4 overflow-hidden rounded-[7px] bg-white shadow-[0_8px_24px_rgba(24,10,64,0.08)] sm:gap-x-8"
          style={{ "--reveal-delay": "300ms" } as React.CSSProperties}
        >
          {facts.map((fact) => (
            <div key={fact.label} className="flex flex-col bg-white px-5 py-6 sm:flex-row sm:items-center sm:justify-between sm:px-10 sm:py-8">
              <p className="text-[19px] font-bold text-ink sm:text-[23px]">{fact.label}</p>
              <p className="text-[19px] font-bold text-ink sm:text-[23px]">{fact.value}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
