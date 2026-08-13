import { benefits } from "@/data/benefits";
import Reveal from "./Reveal";

export default function ProgramOverview() {
  return (
    <section className="mx-auto max-w-6xl px-5 pb-16 pt-20 text-center sm:px-8">
      <Reveal>
        <h2 className="mx-auto max-w-2xl text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
          Become a Software Engineer with Innovatio Academy
        </h2>
      </Reveal>
      <div className="mt-12 grid gap-10 sm:grid-cols-3">
        {benefits.map(({ Icon, first, second }, index) => (
          <Reveal key={first} delay={index * 120}>
            <div className="flex flex-col items-center">
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand/10 text-brand transition-transform duration-300 hover:-translate-y-1">
                <Icon size={20} strokeWidth={1.8} />
              </span>
              <p className="mt-4 text-base font-medium text-ink">
                {first}
                <br />
                <span className="text-[#8a8493]">{second}</span>
              </p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
