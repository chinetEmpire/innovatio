import { faqAnswer, faqQuestions } from "@/data/faqs";

export default function Faq() {
  return (
    <section id="faq" className="mx-auto max-w-[780px] px-5 py-14 sm:px-8 sm:py-16 md:px-6 md:py-20">
      <h2 className="text-center font-bold">Frequently Asked Questions</h2>
      <div className="mt-8 rounded-xl border-[6px] border-[#f0edf2] bg-white px-4 shadow-soft sm:mt-9 sm:px-5">
        {faqQuestions.map((question) => (
          <details key={question} className="border-b py-4 last:border-0">
            <summary className="cursor-pointer list-none font-medium leading-snug">
              {question}
              <span className="float-right ml-3 text-brand">+</span>
            </summary>
            <p className="mt-3 text-[#5f5b65]">{faqAnswer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
