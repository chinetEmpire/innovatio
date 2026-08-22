"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

import avatarImage from "@/app/images/misc.png";
import { testimonials } from "@/data/testimonials";
import Reveal from "./Reveal";

const AUTOPLAY_INTERVAL_MS = 5000;

export default function Testimonials() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const slideIndexes = [-1, 0, 1];
  const testimonialCount = testimonials.length;

  useEffect(() => {
    if (isPaused || testimonialCount <= 1) return;
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % testimonialCount);
    }, AUTOPLAY_INTERVAL_MS);
    return () => clearInterval(timer);
  }, [activeSlide, isPaused, testimonialCount]);

  const getTestimonial = (offset: number) =>
    testimonials[(activeSlide + offset + testimonialCount) % testimonialCount];

  return (
    <section className="overflow-hidden bg-[#faf7ff] bg-[radial-gradient(#e9e3f5_1.5px,transparent_1.5px)] [background-size:24px_24px] py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <Reveal>
          <h2 className="text-center text-3xl font-bold tracking-tight sm:text-4xl">See Why Learners Trust Us</h2>
        </Reveal>

        <Reveal delay={120}>
          <div
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            className="relative left-1/2 mt-10 flex w-screen -translate-x-1/2 items-center justify-center gap-4 sm:gap-6"
          >
            {slideIndexes.map((offset) => {
              const isActive = offset === 0;
              const testimonial = getTestimonial(offset);
              return (
                <article
                  key={offset}
                  aria-hidden={!isActive}
                  className={`shrink-0 rounded-2xl border border-white bg-[#eeecee] p-2 transition-all duration-300 ${
                    isActive
                      ? "w-[min(86vw,680px)]"
                      : "hidden w-[min(42vw,350px)] opacity-90 sm:block"
                  }`}
                >
                  <div className={`flex h-[164px] flex-col justify-between rounded-xl bg-white px-5 py-5 text-left sm:h-[174px] sm:px-7 sm:py-6 ${isActive ? "" : "opacity-80"}`}>
                    <blockquote className="max-w-xl text-[12px] leading-[1.35] text-ink sm:text-[13px]">
                      {testimonial.quote}
                    </blockquote>
                    <div className="flex items-center gap-3">
                      <Image
                        src={avatarImage}
                        alt=""
                        className="h-9 w-9 rounded-full object-cover sm:h-10 sm:w-10"
                      />
                      <div>
                        <p className="text-[12px] font-semibold leading-tight text-ink sm:text-[13px]">{testimonial.name}</p>
                        <p className="mt-1 text-[10px] leading-tight text-[#8a8493] sm:text-[11px]">{testimonial.role}</p>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </Reveal>

        <div className="mt-7 flex items-center justify-center gap-1.5" aria-label="Testimonial slides">
          {testimonials.map((_, index) => (
            <button
              key={index}
              type="button"
              data-control
              aria-label={`Show testimonial ${index + 1}`}
              aria-pressed={activeSlide === index}
              onClick={() => setActiveSlide(index)}
              className={`h-1.5 rounded-full p-0 transition-all duration-300 ${activeSlide === index ? "w-6 bg-brand" : "w-1.5 bg-[#c8c5c9]"}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
