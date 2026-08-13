import { paymentPlans } from "@/data/paymentOptions";
import Reveal from "./Reveal";

export default function PaymentOptions() {
  return (
    <section className="bg-[#faf7ff] py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <Reveal className="max-w-2xl">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Flexible payment options for every budget</h2>
        </Reveal>
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {paymentPlans.map((plan, index) => (
            <Reveal key={plan.title} delay={index * 120}>
              <article
                className={`relative h-full rounded-2xl border p-6 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_24px_48px_rgba(47,31,101,0.14)] sm:p-8 ${
                  index === 0 ? "border-brand bg-white shadow-[0_24px_48px_rgba(84,41,208,0.16)]" : "border-[#e9e2f5] bg-white"
                }`}
              >
                {index === 0 && (
                  <span className="absolute -top-3 right-6 rounded-full bg-brand px-3 py-1 text-xs font-bold text-white">
                    Best value
                  </span>
                )}
                <span className="inline-block rounded-full bg-brand/10 px-3 py-1 text-xs font-bold uppercase tracking-wide text-brand">
                  {plan.badge}
                </span>
                <h3 className="mt-5 text-xl font-semibold">{plan.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-[#4d4752]">{plan.description}</p>
                <p className="mt-8 text-sm text-[#8a8493]">{plan.label}</p>
                <div className="mt-2 flex items-end gap-3">
                  <p className="text-3xl font-bold tracking-tight text-ink">{plan.price}</p>
                  <del className="pb-1 text-sm text-[#b5afbd]">{plan.wasPrice}</del>
                </div>
                <p className="mt-6 border-t border-[#f0ecf6] pt-4 text-sm font-medium text-[#5c5661]">{plan.total}</p>
              </article>
            </Reveal>
          ))}
        </div>
        <Reveal delay={240}>
          <p className="mt-8 text-center text-sm text-[#8a8493]">
            Our financial partner for tuition financing: <b className="text-ink">Paystack</b>
          </p>
        </Reveal>
      </div>
    </section>
  );
}
