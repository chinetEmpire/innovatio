import Image from "next/image";

import flowerImage from "@/app/images/flower.png";
import Reveal from "./Reveal";

type CourseIntroSectionProps = {
  heading: string;
  paragraphs: [string, string];
};

export default function CourseIntroSection({ heading, paragraphs }: CourseIntroSectionProps) {
  return (
    <section className="mt-12 px-5 pb-16 pt-14 sm:px-8 lg:px-[4.2%]">
      <div className="grid items-center gap-10 md:grid-cols-2">
        <Reveal>
          <Image
            src={flowerImage}
            alt="Innovatio Academy student"
            className="mx-auto h-auto w-full max-w-sm rounded-2xl object-cover"
          />
        </Reveal>
        <Reveal delay={150}>
          <div>
            <h1 className="text-3xl font-extrabold leading-relaxed sm:text-4xl lg:text-5xl">{heading}</h1>
            {paragraphs.map((paragraph, index) => (
              <p
                key={paragraph.slice(0, 24)}
                className={`${index === 0 ? "mt-5" : "mt-4"} text-[19px] leading-relaxed text-[#4d4752]`}
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
