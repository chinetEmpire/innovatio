import type { CourseCareer } from "@/data/courses";
import swImage from "@/app/images/sw.png";
import Reveal from "./Reveal";

type CareerPathsProps = {
  careers: CourseCareer[];
};

export default function CareerPaths({ careers }: CareerPathsProps) {
  const rotations = [2.43, -4.48, 2.16];

  return (
    <section id="courses" className="relative overflow-hidden bg-[#faf7ff] py-16 sm:py-20">
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          backgroundImage: `url("${swImage.src}")`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      />
      <div className="relative px-5 sm:px-8 lg:px-[4.2%]">
        <Reveal className="max-w-4xl">
          <h2 className="text-4xl font-black leading-[1.5] tracking-tight sm:text-[2.75rem]">Where can your Full-stack Software Engineer training take you?</h2>
        </Reveal>
        <div className="mt-10 grid gap-16 md:grid-cols-3">
          {careers.map(({ title, blurb, salary }, index) => (
            <Reveal key={title} delay={index * 120}>
              <article className="h-full rounded-lg bg-white p-8 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,0,0,0.1)]" style={{ boxShadow: "0 0 0 16px rgba(200, 200, 200, 0.04), 0 0 0 17px #EEEBEB, 0 0 0 21px white" }}>
                <h3 className="text-3xl font-bold">{title}</h3>
                <p className="mt-8 text-1xl leading-relaxed text-[#000000]">{blurb}</p>
                <div style={{ transform: `rotate(${rotations[index]}deg)` }}>
                  <p className="mt-15 inline-block rounded-full bg-[#f0eded] px-4 py-2.5 text-lg font-bold text-black">
                    {salary}
                  </p>
                </div>
                <p className="mt-10 text-sm text-[#000000]">starting pay for {title.toLowerCase()}s</p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
