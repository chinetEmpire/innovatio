import { Star } from "lucide-react";

import { testimonials } from "@/data/testimonials";
import Reveal from "./Reveal";

export default function Testimonials() {
  return (
    <section className="bg-[#faf7ff] py-16 sm:py-20">
      <div className="mx-auto max-w-3xl px-5 text-center sm:px-8">
        <Reveal>
          <div className="flex items-center justify-center gap-1 text-yellow-500">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} size={18} fill="currentColor" />
            ))}
          </div>
          <blockquote className="mt-6 text-xl font-medium leading-relaxed text-ink sm:text-2xl">
            {testimonials.quote}
          </blockquote>
          <p className="mt-7 text-sm font-semibold text-ink">{testimonials.name}</p>
          <p className="mt-1 text-sm text-[#8a8493]">{testimonials.role}</p>
        </Reveal>
      </div>
    </section>
  );
}
