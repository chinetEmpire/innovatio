"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ArrowRight, Loader2, Lock, Sparkles } from "lucide-react";

import logo from "@/app/images/logo.png";
import { formatNaira, formatNairaKobo, paymentPlans, type PaymentPlanKey } from "@/data/paymentOptions";

export type PaymentCourse = {
  slug: string;
  name: string;
  duration: string;
  priceNgn: number;
};

export default function PaymentPage({
  enrollmentId,
  course,
  applicantName,
  planKey: initialPlanKey,
}: {
  enrollmentId: string;
  course: PaymentCourse;
  applicantName: string;
  planKey: string | null;
}) {
  const [planKey, setPlanKey] = useState<PaymentPlanKey>(
    paymentPlans.some((p) => p.key === initialPlanKey) ? (initialPlanKey as PaymentPlanKey) : "instalments"
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const plan = paymentPlans.find((p) => p.key === planKey)!;
  const dueNowKobo = plan.amountKobo;

  async function handleProceed() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/paystack/initialize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ enrollmentId, planKey }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Could not start payment. Please try again.");
      window.location.href = data.authorization_url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not start payment. Please try again.");
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#f2f2f2]">
      <div className="mx-auto max-w-[960px] px-5 pt-8 sm:px-8">
        <header className="flex items-center justify-between">
          <Link href="/" aria-label="Innovatio Academy home" className="transition-opacity hover:opacity-80">
            <Image src={logo} alt="Innovatio Academy" className="h-auto w-[140px]" />
          </Link>

          <nav className="hidden items-center gap-8 text-[12px] font-medium text-[#202020] md:flex">
            <a href="/" className="transition-opacity hover:opacity-80">Home</a>
            <a href="/courses" className="transition-opacity hover:opacity-80">Courses</a>
          </nav>
        </header>

        <section className="mx-auto mt-8 max-w-[760px] rounded-[18px] border border-[#e9e9e9] bg-[#f3f3f3] px-4 py-8 sm:px-8 md:px-10">
          <div className="flex justify-center">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#f2ebff] text-[#5b2ed6]">
              <Sparkles size={16} />
            </div>
          </div>

          <h1 className="mt-6 text-center text-[clamp(2rem,3.1vw,3rem)] font-black tracking-[-0.05em] text-[#151515]">
            Congratulations! You Passed
          </h1>

          <div className="mx-auto mt-6 max-w-[620px] text-center text-[15px] leading-relaxed text-[#4d4d4d]">
            <p>Great job{applicantName ? `, ${applicantName.split(" ")[0]}` : ""}! You&apos;ve successfully met the requirements to join Innovatio Academy.</p>
            <p className="mt-3">Your spot is almost secured. Pick a payment plan to officially begin your learning journey.</p>
          </div>

          <div className="mt-8">
            <h2 className="text-[15px] font-bold text-[#1d1d1d]">Your course</h2>

            <div className="mt-4 flex items-center justify-between rounded-[14px] border border-[#dedfe2] bg-white px-5 py-4">
              <div className="flex items-center gap-4">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f2ebff] text-[#5b2ed6]">
                  <Lock size={15} />
                </span>
                <div>
                  <div className="text-[18px] font-medium text-[#171717]">{course.name}</div>
                  <div className="mt-1 text-[13px] text-[#696969]">{course.duration} · Selected during assessment</div>
                </div>
              </div>
              <div className="text-[18px] font-bold tracking-tight text-[#1b1b1b]">{formatNaira(course.priceNgn)}</div>
            </div>
          </div>

          <div className="mt-10">
            <h2 className="text-[15px] font-bold text-[#1d1d1d]">Choose a payment plan</h2>

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {paymentPlans.map((p) => {
                const selected = p.key === planKey;
                return (
                  <button
                    key={p.key}
                    type="button"
                    onClick={() => setPlanKey(p.key)}
                    className={`rounded-[14px] border bg-white px-5 py-4 text-left transition-all ${
                      selected
                        ? "border-[#7d5fe8] bg-[#faf8ff] shadow-[0_0_0_1px_rgba(125,95,232,0.12)]"
                        : "border-[#dddfe3] hover:border-[#c9b8f2]"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-[18px] font-bold text-[#171717]">{p.title}</p>
                      {p.key === "upfront" && (
                        <span className="inline-flex items-center rounded-full bg-[#dff7e4] px-2 py-1 text-[10px] font-bold text-[#2d8d47]">
                          Save 5%
                        </span>
                      )}
                    </div>
                    <div className="mt-4 flex items-end gap-2">
                      <p className="text-[25px] font-black tracking-[-0.04em] text-[#171717]">
                        {formatNairaKobo(p.amountKobo)}
                      </p>
                      {p.key === "instalments" && <span className="pb-1 text-[11px] font-medium text-[#676767]">now</span>}
                    </div>
                    <p className="mt-2 text-[12px] leading-relaxed text-[#595959]">
                      {p.key === "instalments" ? `Then ${formatNairaKobo(p.amountKobo)} due at the end of month 2.` : "One time payment, full access from day one."}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-10 border-t border-[#dfe1e5] pt-5">
            <div className="flex items-center justify-between gap-4 text-[16px]">
              <span className="text-[#2a2a2a]">Course</span>
              <span className="font-bold text-[#171717]">{course.name}</span>
            </div>
            <div className="mt-4 flex items-center justify-between gap-4 text-[16px]">
              <span className="text-[#2a2a2a]">Plan</span>
              <span className="font-bold text-[#171717]">{plan.title}</span>
            </div>

            <div className="mt-6 flex items-center justify-between gap-4 border-t border-[#dfe1e5] pt-4">
              <span className="text-[24px] font-black tracking-[-0.04em] text-[#171717]">Due now</span>
              <span className="text-[24px] font-black tracking-[-0.04em] text-[#4b2bd9]">{formatNairaKobo(dueNowKobo)}</span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleProceed}
            disabled={loading}
            className="mt-7 flex w-full items-center justify-center gap-2 rounded-[14px] bg-[#4c2ada] px-5 py-4 text-[18px] font-bold text-white shadow-[0_12px_20px_rgba(76,42,218,0.28)] transition-transform hover:translate-y-[-1px] disabled:opacity-70"
          >
            {loading ? <Loader2 size={20} className="animate-spin" /> : <ArrowRight size={20} />}
            {loading ? "Redirecting to Paystack…" : "Proceed to Payment"}
          </button>

          {error && (
            <p className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-center text-[14px] font-medium text-red-700">
              {error}
            </p>
          )}

          <p className="mt-5 text-center text-[14px] text-[#5d5d5d]">
            You&apos;ll be redirected securely to Paystack to complete your payment.
          </p>
        </section>
      </div>
    </main>
  );
}
