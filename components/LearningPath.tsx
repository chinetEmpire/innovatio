"use client";

import { useState } from "react";
import { CheckCircle2 } from "lucide-react";

import { learningContent, learningTabs } from "@/data/learningPath";

export default function LearningPath() {
  const [activeTab, setActiveTab] = useState(0);
  const activeLabel = learningTabs[activeTab];
  const items = learningContent[activeLabel] ?? [];

  return (
    <section id="learn" className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
      <div className="text-center">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Explore your learning path</h2>
        <div className="mt-8 inline-flex max-w-full flex-wrap justify-center gap-1 rounded-full bg-[#f6f3fa] p-1.5">
          {learningTabs.map((tab, index) => (
            <button
              key={tab}
              onClick={() => setActiveTab(index)}
              className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-colors ${
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
        className="animate-fade-up mx-auto mt-10 max-w-3xl rounded-2xl border border-[#e9e2f5] bg-white p-6 shadow-[0_16px_32px_rgba(47,31,101,0.08)] sm:p-8"
      >
        <ul className="divide-y divide-[#f0ecf6]">
          {items.map(({ title, text }) => (
            <li key={title} className="flex gap-3 py-4 first:pt-0 last:pb-0">
              <CheckCircle2 className="mt-0.5 shrink-0 text-brand" size={20} />
              <p className="text-sm leading-relaxed text-[#4d4752] sm:text-base">
                <b className="font-semibold text-ink">{title}</b> {text}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
