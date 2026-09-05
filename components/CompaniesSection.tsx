import Image from "next/image";

import { companyLogos } from "@/data/site";
import Reveal from "./Reveal";

export default function CompaniesSection() {
  return (
    <section className="py-16 text-center sm:py-20">
      <Reveal>
        <p className="mx-auto max-w-xl font-medium leading-relaxed text-ink" style={{ fontSize: "35px" }}>
          Our grads get great jobs with both startups and industry giants
        </p>
      </Reveal>
      <style>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-100%);
          }
        }
        .scroll-container {
          animation: scroll 30s linear infinite;
        }
        .scroll-container:hover {
          animation-play-state: paused;
        }
      `}</style>
      <div className="mx-auto mt-10 max-w-5xl overflow-hidden px-5 sm:px-8">
        <div className="scroll-container flex gap-8">
          {[...companyLogos, ...companyLogos].map(({ src, alt, className = "" }, index) => (
            <div key={`${alt}-${index}`} className="flex shrink-0 items-center justify-center">
              <Image
                src={src}
                alt={alt}
                className={`max-h-16 w-auto object-contain transition-all duration-300 hover:opacity-75 ${className}`}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
