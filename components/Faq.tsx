import { faqAnswer, faqQuestions } from "@/data/faqs";
import Reveal from "./Reveal";

export default function Faq() {
  return (
    <section id="faq" className="mx-auto max-w-3xl px-5 py-16 sm:px-8 sm:py-20">
      <Reveal>
        <h2 className="text-center text-3xl font-bold tracking-tight sm:text-4xl">Frequently asked questions</h2>
      </Reveal>
      <div className="mt-10 space-y-3">
        {faqQuestions.map((question, index) => (
          <Reveal key={question} delay={index * 60}>
            <details className="group rounded-2xl border border-[#e9e2f5] bg-white px-6 py-5 transition-colors open:border-brand/30 open:bg-[#faf7ff]">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-semibold text-ink transition-colors hover:text-brand sm:text-base">
                {question}
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand/10 text-lg text-brand transition-transform duration-300 group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-[#5f5b65]">{faqAnswer}</p>
            </details>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
