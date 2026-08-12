import { testimonials } from "@/data/testimonials";

export default function Testimonials() {
  return (
    <section className="dot-bg py-14 text-center sm:py-16">
      <h2 className="font-bold">See Why Learners Trust Us</h2>
      <div className="mx-auto mt-8 grid max-w-[980px] gap-4 px-5 sm:mt-10 sm:px-8 md:grid-cols-3 md:px-6">
        {[0, 1, 2].map((i) => (
          <article key={i} className={`rounded-xl border-[6px] border-[#eee9f5] bg-white p-5 text-left shadow-sm ${i !== 1 ? "hidden md:block" : ""}`}>
            <p className="text-[#5f5b65]">{testimonials.quote}</p>
            <b className="mt-5 block">{testimonials.name}</b>
            <span className="text-[#777]">{testimonials.role}</span>
          </article>
        ))}
      </div>
      <div className="mt-6 text-brand">━ ● ━</div>
    </section>
  );
}
