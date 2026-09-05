import Image from "next/image";
import { paymentPlans } from "@/data/paymentOptions";
import paystackLogo from "@/app/images/brands/paystack.png";
import Reveal from "./Reveal";

export default function PaymentOptions() {
  return (
    <section
      className="bg-[#faf7ff] py-16 sm:py-20"
      style={{
        backgroundImage: "url('/sw.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="px-5 sm:px-8 lg:px-[4.2%]">
        <Reveal className="max-w-2xl">
          <h2 className="text-4xl font-black tracking-tight sm:text-5xl">
            Flexible payment options for<br />every budget
          </h2>
        </Reveal>
        <div className="mt-10 grid grid-cols-1 gap-10 sm:grid-cols-2 sm:gap-[60px]">
          {paymentPlans.map((plan, index) => {
            const frameColors = ["#FFF3ED", "#F0F9E8"]; // peach for first, lime for second
            const priceColors = ["#FFE7D2", "#F4FFAF"]; // peach for first, yellow-green for second
            return (
              <Reveal key={plan.title} delay={index * 120}>
                <article
                  className="h-full rounded-2xl bg-white p-8 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,0,0,0.1)]"
                  style={{
                    boxShadow: `0 0 0 16px ${frameColors[index]}, 0 0 0 17px #EEEBEB, 0 0 0 21px white`,
                  }}
                >
                  <span className="inline-block rounded-full bg-brand/10 px-3 py-1 text-xs font-bold uppercase tracking-wide text-brand">
                    {plan.badge}
                  </span>
                  <h3 className="mt-5 text-2xl font-bold">{plan.title}</h3>
                  <p className="mt-3 text-base leading-relaxed text-[#4d4752]">{plan.description}</p>
                  <p className="mt-8 text-sm text-[#8a8493]">{plan.label}</p>
                  <div className="mt-2 flex items-center gap-3">
                    <span className="inline-block rounded-full px-3 py-2 text-4xl font-bold tracking-tight text-ink" style={{ backgroundColor: priceColors[index] }}>
                      {plan.price}
                    </span>
                    <del className="text-base" style={{ color: "#626262" }}>{plan.wasPrice}</del>
                  </div>
                  <p className="mt-8 text-sm font-medium text-[#5c5661]">{plan.total}</p>
                </article>
              </Reveal>
            );
          })}
        </div>
        <Reveal delay={240}>
          <div className="mt-8 text-center" style={{ fontSize: "24px", color: "#8a8493" }}>
            Our financial partner for tuition financing:{" "}
            <Image
              src={paystackLogo}
              alt="Paystack"
              className="ml-2 inline-block h-20 w-auto"
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
