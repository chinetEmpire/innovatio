import Image from "next/image";

import flowerImage from "@/app/images/flower.png";
import Reveal from "./Reveal";

type CourseIntroSectionProps = {
  heading: string;
  paragraphs: [string, string];
};

export default function CourseIntroSection({ heading, paragraphs }: CourseIntroSectionProps) {
  return (
    <section className="mx-auto max-w-6xl px-5 pb-16 sm:px-8">
      <div className="grid items-center gap-10 md:grid-cols-2">
        <Reveal>
          <Image
            src={flowerImage}
            alt="Innovatio Academy student"
            className="mx-auto h-auto w-full max-w-sm rounded-2xl object-cover shadow-[0_24px_48px_rgba(47,31,101,0.12)]"
          />
        </Reveal>
        <Reveal delay={150}>
          <div>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">{heading}</h2>
            {paragraphs.map((paragraph, index) => (
              <p
                key={paragraph.slice(0, 24)}
                className={`${index === 0 ? "mt-5" : "mt-4"} text-base leading-relaxed text-[#4d4752]`}
              >
                {paragraph}
              </p>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
