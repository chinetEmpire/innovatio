"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { ArrowRight, Code2, ShieldCheck, X } from "lucide-react";

import { courses } from "@/data/courses";
import { coursePriceBySlug, formatNaira } from "@/data/paymentOptions";

const courseIcons = { cybersecurity: ShieldCheck, "software-engineering": Code2 } as const;

export default function CoursePickerModal() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <button
        data-control
        type="button"
        onClick={() => setOpen(true)}
        className="flex h-[58px] min-w-[165px] items-center justify-center rounded-full border border-[#e2d9f2] px-6 text-[20px] font-semibold text-ink transition-colors hover:border-brand hover:text-brand lg:h-[68px] lg:min-w-[184px] lg:text-[24px]"
      >
        View courses
      </button>

      {open &&
        createPortal(
          <div
            className="fixed inset-0 z-[100] flex items-end justify-center px-4 pb-4 sm:items-center sm:p-6"
            role="dialog"
            aria-modal="true"
            aria-label="Choose your course"
          >
          <div className="animate-fade-in absolute inset-0 bg-[#17131f]/60 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <div className="animate-modal-in relative z-10 w-full max-w-lg rounded-2xl border border-[#ece6f6] bg-white p-6 shadow-[0_24px_48px_rgba(24,10,64,0.3)] sm:p-8">
            <button
              data-control
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close course picker"
              className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full text-ink/60 transition-colors hover:bg-brand/10 hover:text-brand"
            >
              <X size={20} />
            </button>
            <h2 className="pr-8 text-xl font-bold tracking-tight sm:text-2xl">Choose your course</h2>
            <p className="mt-2 text-sm text-[#5f5b65]">
              Pick a program to see the full curriculum, career paths, and payment options.
            </p>
            <div className="mt-6 space-y-3">
              {Object.values(courses).map((course) => {
                const Icon = courseIcons[course.slug];
                const price = coursePriceBySlug(course.slug);
                return (
                  <Link
                    key={course.slug}
                    href={`/courses/${course.slug}`}
                    onClick={() => setOpen(false)}
                    className="group flex items-center gap-4 rounded-xl border border-[#ece6f6] p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-brand/40 hover:shadow-[0_16px_32px_rgba(84,41,208,0.12)] sm:p-5"
                  >
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand/10 text-brand">
                      <Icon size={22} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block font-semibold text-ink">{course.navLabel}</span>
                      <span className="mt-0.5 block text-sm text-[#8a8493]">
                        {price ? `${price.duration} · ${formatNaira(price.priceNgn)}` : course.hero.facts[1].value}
                      </span>
                    </span>
                    <ArrowRight size={20} className="shrink-0 text-brand transition-transform group-hover:translate-x-1" />
                  </Link>
                );
              })}
            </div>
          </div>
        </div>,
          document.body
        )}
    </>
  );
}
