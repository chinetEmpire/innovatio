import Image from "next/image";
import { companyLogos } from "@/data/site";

export default function CompaniesSection() {
  return (
    <section className="pb-14 text-center">
      <p className="leading-tight">Our grads get great jobs with both<br />startups and industry giants</p>
      <div className="mx-auto mt-8 grid max-w-[760px] grid-cols-2 items-center justify-items-center gap-x-9 gap-y-7 px-5 sm:grid-cols-3 md:grid-cols-6 md:gap-x-6">
        {companyLogos.map(({ src, alt, className = "" }) => (
          <Image
            key={alt}
            src={src}
            alt={alt}
            className={`h-auto max-h-10 w-auto max-w-[130px] object-contain grayscale brightness-75 contrast-125 opacity-90 transition hover:opacity-100 ${className}`}
          />
        ))}
      </div>
    </section>
  );
}
