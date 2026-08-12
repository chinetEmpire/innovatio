import { paymentPlans } from "@/data/paymentOptions";

export default function PaymentOptions() {
  return (
    <section className="dot-bg py-11">
      <div className="mx-auto max-w-[800px] px-5">
        <h2 className="text-[18px] font-bold leading-tight">Flexible payment options for<br />every budget</h2>
        <div className="mt-7 grid gap-4 md:grid-cols-2">
          {paymentPlans.map((plan) => (
            <article key={plan.title} className="rounded-lg border-[5px] border-[#eee8f8] bg-white p-4 shadow-sm">
              <span className="rounded bg-[#f4f4ef] px-2 py-1 text-[7px] font-bold">{plan.badge}</span>
              <h3 className="mt-4 text-[12px] font-bold">{plan.title}</h3>
              <p className="mt-4 min-h-10 text-[8px] leading-[1.4] text-[#4d4752]">{plan.description}</p>
              <p className="mt-6 text-[8px]">{plan.label}</p>
              <p className="mt-2 text-[13px] font-bold">
                <span className="rounded-full bg-[#fae3c7] px-3 py-2">{plan.price}</span>{" "}
                <del className="text-[8px] font-normal text-[#777]">{plan.wasPrice}</del>
              </p>
              <p className="mt-7 border-t pt-4 text-[9px] text-[#5c5661]">{plan.total}</p>
            </article>
          ))}
        </div>
        <p className="mt-8 text-center text-[8px] text-[#706a75]">Our financial partner for tuition financing: <b>▣ paystack</b></p>
      </div>
    </section>
  );
}
