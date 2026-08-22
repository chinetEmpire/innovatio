import type { CourseCareer } from "@/data/courses";
import Reveal from "./Reveal";

type CareerPathsProps = {
  careers: CourseCareer[];
};

export default function CareerPaths({ careers }: CareerPathsProps) {
  return (
    <section id="courses" className="bg-[#faf7ff] py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <Reveal className="max-w-2xl">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Where can this training take you?</h2>
        </Reveal>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {careers.map(({ title, blurb, salary }, index) => (
            <Reveal key={title} delay={index * 120}>
              <article className="h-full rounded-2xl border border-[#e9e2f5] bg-white p-6 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_24px_48px_rgba(47,31,101,0.14)] sm:p-7">
                <h3 className="text-lg font-semibold">{title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-[#4d4752]">{blurb}</p>
                <p className="mt-6 inline-block rounded-full bg-brand/10 px-3.5 py-1.5 text-sm font-bold text-brand">
                  {salary}
                </p>
                <p className="mt-2 text-xs text-[#8a8493]">starting pay for {title.toLowerCase()}s</p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
