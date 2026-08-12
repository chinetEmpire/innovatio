import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import miscImage from "@/app/images/misc.png";

export default function WhatSetsUsApart() {
  return (
    <section className="mx-auto grid max-w-[980px] items-center gap-10 px-5 py-14 sm:px-8 sm:py-16 md:grid-cols-2 md:px-6 md:py-20">
      <div>
        <h2 className="font-bold">What Sets Us Apart</h2>
        <div className="mt-9 border-l-2 border-[#d8c6ff] pl-5 sm:pl-6">
          <div className="flex gap-4">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#f0eaff] text-brand">
              <ArrowUpRight size={18} />
            </span>
            <div>
              <h3 className="font-bold">Learn by Building</h3>
              <p className="mt-3 text-[#5f5b65]">We believe real learning happens through practice. From day one, you&apos;ll write code and work with industry-standard tools that strengthen your understanding.</p>
              <a href="#cohort" className="mt-5 inline-block rounded-full bg-brand px-5 py-3 font-semibold text-white">Enroll now</a>
            </div>
          </div>
        </div>
      </div>
      <div className="mx-auto w-full max-w-[420px]">
        <Image src={miscImage} alt="Learners collaborating" className="aspect-square w-full object-cover rounded-[50%]" />
      </div>
    </section>
  );
}
