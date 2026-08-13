import Image from "next/image";

import { companyLogos } from "@/data/site";
import Reveal from "./Reveal";

export default function CompaniesSection() {
  return (
    <section className="py-16 text-center sm:py-20">
      <Reveal>
        <p className="mx-auto max-w-xl text-lg font-medium leading-relaxed text-ink sm:text-xl">
          Our grads get great jobs with both startups and industry giants
        </p>
      </Reveal>
      <div className="mx-auto mt-10 grid max-w-5xl grid-cols-2 items-center justify-items-center gap-x-8 gap-y-8 px-5 sm:grid-cols-3 sm:px-8 md:grid-cols-6">
        {companyLogos.map(({ src, alt, className = "" }, index) => (
          <Reveal key={alt} delay={index * 80} className="flex items-center justify-center">
            <Image
              src={src}
              alt={alt}
              className={`max-h-8 w-auto object-contain opacity-55 grayscale transition-all duration-300 hover:opacity-100 hover:grayscale-0 ${className}`}
            />
          </Reveal>
        ))}
      </div>
    </section>
  );
}
