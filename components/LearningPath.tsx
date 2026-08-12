"use client";

import { useState } from "react";
import { Circle } from "lucide-react";
import { learningItems, learningTabs } from "@/data/learningPath";

export default function LearningPath() {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <section id="learn" className="mx-auto max-w-[800px] px-5 py-12 text-center sm:py-14">
      <h2 className="font-bold">Explore Your Learning Path</h2>
      <div className="mt-7 max-w-full overflow-x-auto pb-1">
        <div className="inline-flex rounded-full bg-[#f6f3fa] p-1 text-[8px]">
          {learningTabs.map((tab, index) => (
            <button
              key={tab}
              onClick={() => setActiveTab(index)}
              className={`whitespace-nowrap rounded-full px-3 py-2 ${index === activeTab ? "bg-[#a880ff] text-white shadow" : "text-ink"}`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>
      <div className="mt-6 rounded-lg border-[5px] border-[#f0edf2] bg-white p-4 text-left shadow-sm">
        {learningItems.map(({ title, text }) => (
          <div className="flex gap-2 border-b border-[#eee] py-2 last:border-0" key={title}>
            <Circle className="mt-1 shrink-0 fill-yellow-400 text-yellow-400" size={7} />
            <span className="text-[8px]">
              <b>{title}</b> {text}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
