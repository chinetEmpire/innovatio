"use client";

import Image from "next/image";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import logo from "@/app/images/logo.png";

export default function Header() {
  const [open, setOpen] = useState(false);
  return <header className="sticky top-0 z-50 h-[62px] bg-white shadow-sm">
    <nav className="mx-auto flex h-full max-w-[960px] items-center justify-between px-5">
      <a href="#home" aria-label="Innovatio Academy home"><Image src={logo} alt="Innovatio Academy" className="h-auto w-[140px]" priority /></a>
      <div className="hidden items-center gap-7 text-[9px] md:flex">
        <a href="/">Home</a><a className="text-brand underline underline-offset-4" href="#courses">Courses</a><a href="#cohort">Contact us</a><a href="#learn">FAQs</a><a className="rounded-full bg-brand px-4 py-2 text-white" href="#cohort">Enroll now</a>
      </div>
      <button onClick={() => setOpen(!open)} aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open} className="rounded p-1 text-brand focus:outline-none focus:ring-2 focus:ring-brand md:hidden">{open ? <X size={24}/> : <Menu size={24}/>}</button>
      {open && <div className="absolute left-0 top-[62px] w-full border-t bg-white p-5 text-sm md:hidden"><div className="flex flex-col gap-4"><a href="#courses">Courses</a><a href="#learn">FAQs</a><a href="#cohort">Contact us</a><a className="w-fit rounded-full bg-brand px-4 py-2 text-white" href="#cohort">Enroll now</a></div></div>}
    </nav>
  </header>;
}
