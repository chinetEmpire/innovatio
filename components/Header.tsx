"use client";

import Image from "next/image";
import { useState } from "react";
import { Menu, X } from "lucide-react";

import logo from "@/app/images/logo.png";
import { headerCta, headerMobileNavLinks, headerNavLinks } from "@/data/site";

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 h-[62px] bg-white shadow-sm">
      <nav className="mx-auto flex h-full max-w-[960px] items-center justify-between px-5">
        <a href="#home" aria-label="Innovatio Academy home">
          <Image src={logo} alt="Innovatio Academy" className="h-auto w-[140px]" priority />
        </a>
        <div className="hidden items-center gap-7 text-[9px] md:flex">
          {headerNavLinks.map(({ label, href, active }) => (
            <a key={label} className={active ? "text-brand underline underline-offset-4" : undefined} href={href}>
              {label}
            </a>
          ))}
          <a className="rounded-full bg-brand px-4 py-2 text-white" href={headerCta.href}>{headerCta.label}</a>
        </div>
        <button
          onClick={() => setOpen(!open)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          className="rounded p-1 text-brand focus:outline-none focus:ring-2 focus:ring-brand md:hidden"
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
        {open && (
          <div className="absolute left-0 top-[62px] w-full border-t bg-white p-5 text-sm md:hidden">
            <div className="flex flex-col gap-4">
              {headerMobileNavLinks.map(({ label, href }) => (
                <a key={label} href={href}>{label}</a>
              ))}
              <a className="w-fit rounded-full bg-brand px-4 py-2 text-white" href={headerCta.href}>{headerCta.label}</a>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
