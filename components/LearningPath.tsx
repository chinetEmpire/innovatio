"use client";

import { useState } from "react";
import { CheckCircle2 } from "lucide-react";

import type { LearningContent } from "@/data/courses";

type LearningPathProps = {
  tabs: string[];
  content: LearningContent;
};

export default function LearningPath({ tabs, content }: LearningPathProps) {
  const [activeTab, setActiveTab] = useState(0);
  const activeLabel = tabs[activeTab];
  const items = content[activeLabel] ?? [];

  return (
    <section id="learn" className="px-5 py-16 sm:px-8 sm:py-20 lg:px-[4.2%]">
      <div className="text-center">
        <h2 className="pb-6 text-3xl font-bold tracking-tight sm:text-4xl">Explore your learning path</h2>
        <div className="mt-9 mb-9 inline-flex w-full max-w-3xl flex-wrap justify-center gap-1 rounded-full bg-white px-1 py-3 shadow-[0_4px_20px_rgba(0,0,0,0.18)] sm:px-1.5 sm:py-4">
          {tabs.map((tab, index) => (
            <button
              data-control
              key={tab}
              onClick={() => setActiveTab(index)}
              className={`whitespace-nowrap rounded-full px-5 py-3 text-base font-medium transition-colors ${
                index === activeTab ? "bg-brand text-white shadow" : "text-ink/70 hover:text-brand"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div
        key={activeLabel}
        className="animate-fade-up mx-auto mt-10 max-w-5xl rounded-2xl border-[20px] border-gray-200 bg-white p-6 shadow-[0_16px_32px_rgba(47,31,101,0.08)] sm:p-8"
      >
        <ul className="divide-y divide-[#f0ecf6]">
          {items.map(({ title, text }) => (
            <li key={title} className="flex gap-3 py-4 first:pt-0 last:pb-0">
              <CheckCircle2 className="mt-0.5 shrink-0 text-brand" size={20} />
              <p className="text-lg leading-relaxed text-[#4d4752] sm:text-xl">
                <b className="font-semibold text-ink">{title}</b> {text}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
