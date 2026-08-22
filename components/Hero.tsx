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
        <div className="relative z-10 mx-auto flex h-[520px] max-w-6xl flex-col items-center justify-center px-5 pb-20 pt-16 text-center sm:px-8">
          <span
            className="animate-fade-up rounded-full border border-white/25 bg-white/10 px-3.5 py-1.5 text-xs font-semibold backdrop-blur"
            style={{ "--reveal-delay": "0ms" } as React.CSSProperties}
          >
            {badge}
          </span>
          <h1
            className="animate-fade-up mt-5 max-w-3xl text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl"
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

      <div className="relative z-10 mx-auto -mt-12 max-w-6xl px-5 pb-12 sm:px-8">
        <div
          className="animate-fade-up mx-auto grid max-w-4xl grid-cols-2 gap-px overflow-hidden rounded-2xl bg-[#e9e2f7] shadow-[0_24px_48px_rgba(24,10,64,0.25)] ring-1 ring-white/70 md:grid-cols-4"
          style={{ "--reveal-delay": "300ms" } as React.CSSProperties}
        >
          {facts.map((fact) => (
            <div key={fact.label} className="bg-white px-6 py-8 text-left">
              <p className="text-xs font-medium uppercase tracking-wide text-[#8a8493]">{fact.label}</p>
              <p className="mt-1.5 text-lg font-bold text-ink">{fact.value}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
