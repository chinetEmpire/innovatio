import Image from "next/image";
import { paymentPlans } from "@/data/paymentOptions";
import paystackLogo from "@/app/images/brands/paystack.png";
import swImage from "@/app/images/sw.png";
import Reveal from "./Reveal";

export default function PaymentOptions() {
  return (
    <section className="relative overflow-hidden bg-[#faf7ff] py-16 sm:py-20">
      <div
        aria-hidden
        className="absolute inset-0 opacity-60"
        style={{
          backgroundImage: `url("${swImage.src}")`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
        }}
      />
      <div className="relative px-5 sm:px-8 lg:px-[4.2%]">
        <Reveal className="max-w-2xl">
          <h2 className="pb-16 text-4xl font-black tracking-tight sm:text-5xl">
            Flexible payment options for<br />every budget
          </h2>
        </Reveal>
        <div className="mt-10 grid grid-cols-1 gap-10 sm:grid-cols-[65fr_35fr] sm:gap-[90px]">
          {paymentPlans.map((plan, index) => {
            const frameColors = ["#EEEBEB", "#EEEBEB"];
            const priceColors = ["#FFE7D2", "#F4FFAF"]; // peach for first, yellow-green for second
            return (
              <Reveal key={plan.title} delay={index * 120}>
                <article
                  className="h-full rounded-2xl bg-white p-8 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,0,0,0.1)]"
                  style={{
                    boxShadow: `0 0 0 16px ${frameColors[index]}, 0 0 0 17px #EEEBEB, 0 0 0 21px white`,
                  }}
                >
                  <span className="inline-block rounded-full bg-[#F5F5F5] px-4 py-2 text-xs font-bold uppercase tracking-wide text-black">
                    {plan.badge}
                  </span>
                  <h3 className="mt-5 text-[34px] font-bold">{plan.title}</h3>
                  <p className="mt-3 pb-20 text-[25px] leading-relaxed text-[#4d4752]">{plan.description}</p>
                  <p className="mt-8 text-lg text-[#8a8493]">{plan.label}</p>
                  <div className="mt-2 flex items-center gap-3">
                    <span className="inline-block rounded-full px-3 py-2 text-4xl font-bold tracking-tight text-ink" style={{ backgroundColor: priceColors[index] }}>
                      {plan.price}
                    </span>
                    <del className="text-base" style={{ color: "#626262" }}>{plan.wasPrice}</del>
                  </div>
                  <p className="mt-8 text-lg font-medium text-[#5c5661]">{plan.total}</p>
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
