"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ChevronDown, Menu, X } from "lucide-react";

import logo from "@/app/images/logo.png";
import { courseLinks } from "@/data/courses";
import { navLinks } from "@/data/site";

export default function Header() {
  const [open, setOpen] = useState(false);
  const [coursesOpen, setCoursesOpen] = useState(false);
  const pathname = usePathname();
  const isHome = pathname === "/";
  const coursesActive = pathname.startsWith("/courses");

  useEffect(() => {
    setOpen(false);
    setCoursesOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!coursesOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setCoursesOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [coursesOpen]);

  return (
    <header className="sticky top-0 z-50 border-b border-[#ece6f6] bg-white/90 backdrop-blur">
      <nav
        className={`flex h-16 items-center justify-between px-5 sm:px-8 ${
          isHome ? "lg:px-[8%]" : "mx-auto max-w-6xl"
        }`}
      >
        <Link href="/" aria-label="Innovatio Academy home" className="shrink-0 transition-opacity hover:opacity-80">
          <Image src={logo} alt="Innovatio Academy" className="h-auto w-[160px]" priority />
        </Link>

        <div className="hidden items-center gap-8 text-[15px] font-medium md:flex">
          {navLinks.map((link) => {
            if (link.label !== "Courses") {
              const active = link.href === pathname;
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  className={`transition-colors hover:text-brand ${active ? "text-brand" : "text-ink/70"}`}
                >
                  {link.label}
                </Link>
              );
            }

            return (
              <div
                key={link.label}
                className="relative"
                onMouseEnter={() => setCoursesOpen(true)}
                onMouseLeave={() => setCoursesOpen(false)}
              >
                <button
                  data-control
                  type="button"
                  aria-haspopup="menu"
                  aria-expanded={coursesOpen}
                  onClick={() => setCoursesOpen((value) => !value)}
                  className={`flex h-auto min-w-0 items-center gap-1 bg-transparent p-0 text-[15px] font-medium transition-colors hover:text-brand ${
                    coursesActive ? "text-brand" : "text-ink/70"
                  }`}
                >
                  Courses
                  <ChevronDown size={16} className={`transition-transform ${coursesOpen ? "rotate-180" : ""}`} />
                </button>
                {coursesOpen && (
                  <div className="absolute left-1/2 top-full z-50 w-56 -translate-x-1/2 pt-3">
                    <div className="animate-fade-in overflow-hidden rounded-xl border border-[#ece6f6] bg-white py-2 shadow-[0_24px_48px_rgba(47,31,101,0.16)]">
                      {courseLinks.map((course) => (
                        <Link
                          key={course.href}
                          href={course.href}
                          className={`block px-4 py-2.5 text-sm transition-colors hover:bg-brand/5 hover:text-brand ${
                            pathname === course.href ? "text-brand" : "text-ink/80"
                          }`}
                        >
                          {course.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <button
          data-control
          onClick={() => setOpen(!open)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          className="flex h-9 w-9 items-center justify-center rounded-full text-brand transition-colors hover:bg-brand/10 md:hidden"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {open && (
        <div className="animate-fade-in border-t border-[#f0ecf6] bg-white px-5 pb-6 pt-3 md:hidden">
          <div className="flex flex-col gap-1">
            {navLinks.map((link) => {
              if (link.label !== "Courses") {
                const active = link.href === pathname;
                return (
                  <Link
                    key={link.label}
                    href={link.href}
                    className={`rounded-lg px-3 py-3 text-base font-medium transition-colors ${active ? "bg-brand/10 text-brand" : "text-ink/80 hover:bg-brand/5"}`}
                  >
                    {link.label}
                  </Link>
                );
              }

              return (
                <div key={link.label}>
                  <button
                    data-control
                    type="button"
                    aria-expanded={coursesOpen}
                    onClick={() => setCoursesOpen((value) => !value)}
                    className={`flex min-h-0 w-full items-center justify-between rounded-lg px-3 py-3 text-base font-medium transition-colors ${
                      coursesActive ? "bg-brand/10 text-brand" : "text-ink/80 hover:bg-brand/5"
                    }`}
                  >
                    Courses
                    <ChevronDown size={18} className={`transition-transform ${coursesOpen ? "rotate-180" : ""}`} />
                  </button>
                  {coursesOpen && (
                    <div className="animate-fade-in mt-1 flex flex-col gap-1 pl-4">
                      {courseLinks.map((course) => (
                        <Link
                          key={course.href}
                          href={course.href}
                          className={`rounded-lg px-3 py-2.5 text-[15px] font-medium transition-colors ${
                            pathname === course.href ? "bg-brand/10 text-brand" : "text-ink/70 hover:bg-brand/5 hover:text-brand"
                          }`}
                        >
                          {course.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
}
