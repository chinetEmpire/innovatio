"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
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

  const goToPrevious = () =>
    setActiveSlide((prev) => (prev - 1 + testimonialCount) % testimonialCount);
  const goToNext = () =>
    setActiveSlide((prev) => (prev + 1) % testimonialCount);

  return (
    <section className="overflow-hidden bg-[#faf7ff] bg-[radial-gradient(#e9e3f5_1.5px,transparent_1.5px)] [background-size:24px_24px] py-16 sm:py-20">
      <div className="px-5 sm:px-8 lg:px-[4.2%]">
        <Reveal>
          <h2 className="text-center text-3xl font-black tracking-tight text-black sm:text-4xl">See Why Learners Trust Us</h2>
        </Reveal>

        <Reveal delay={120}>
          <div className="relative">
            <button
              type="button"
              data-control
              aria-label="Previous testimonial"
              onClick={goToPrevious}
              className="absolute left-4 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white text-black shadow-[0_8px_20px_rgba(0,0,0,0.14)] transition-transform hover:scale-105"
            >
              <ChevronLeft size={26} />
            </button>
            <button
              type="button"
              data-control
              aria-label="Next testimonial"
              onClick={goToNext}
              className="absolute right-4 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white text-black shadow-[0_8px_20px_rgba(0,0,0,0.14)] transition-transform hover:scale-105"
            >
              <ChevronRight size={26} />
            </button>
          <div
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            className="relative mt-10 flex w-full items-center justify-center gap-4 sm:gap-6"
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
                  <div className={`flex flex-col rounded-xl bg-white px-5 py-5 sm:px-7 sm:py-6 ${
                      isActive
                        ? "h-[220px] items-center justify-center gap-6 text-center sm:h-[240px]"
                        : "h-[164px] justify-between text-left sm:h-[174px] opacity-80"
                    }`}>
                    <blockquote className={`mx-auto max-w-xl leading-[1.35] text-ink ${
                      isActive ? "text-[19px]" : "text-[12px] sm:text-[13px]"
                    }`}>
                      {testimonial.quote}
                    </blockquote>
                    <div className={`flex items-center gap-3 ${
                      isActive ? "justify-center" : ""
                    }`}>
                      <Image
                        src={avatarImage}
                        alt=""
                        className="h-9 w-9 rounded-full object-cover sm:h-10 sm:w-10"
                      />
                      <div>
                        <p className={`font-semibold leading-tight text-ink ${
                          isActive ? "text-[19px]" : "text-[12px] sm:text-[13px]"
                        }`}>{testimonial.name}</p>
                        <p className={`mt-1 leading-tight text-[#8a8493] ${
                          isActive ? "text-[19px]" : "text-[10px] sm:text-[11px]"
                        }`}>{testimonial.role}</p>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
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
