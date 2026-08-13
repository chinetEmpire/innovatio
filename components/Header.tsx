"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";

import logo from "@/app/images/logo.png";
import { navLinks } from "@/data/site";

export default function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => setOpen(false), [pathname]);

  return (
    <header className="sticky top-0 z-50 border-b border-[#ece6f6] bg-white/90 backdrop-blur">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-8">
        <Link href="/" aria-label="Innovatio Academy home" className="shrink-0 transition-opacity hover:opacity-80">
          <Image src={logo} alt="Innovatio Academy" className="h-auto w-[140px]" priority />
        </Link>

        <div className="hidden items-center gap-8 text-sm font-medium md:flex">
          {navLinks.map((link) => {
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
          })}
          <Link
            href="/enroll"
            className="rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-white shadow-[0_8px_18px_rgba(84,41,208,0.3)] transition-transform hover:scale-[1.04] active:scale-95"
          >
            Enroll now
          </Link>
        </div>

        <button
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
            })}
            <Link
              href="/enroll"
              className="mt-3 rounded-full bg-brand px-5 py-3 text-center text-base font-semibold text-white"
            >
              Enroll now
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
