"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { CheckCircle2, Loader2, Lock } from "lucide-react";

type RegisterResponse =
  | { error: string }
  | {
      ok: boolean;
      enrollmentId: string;
      paymentStatus: string;
      applicant: { full_name: string; email: string; whatsapp: string; age_bracket: string };
      courseTitle: string;
    };

export default function RegisterForm({ courseSlug, courseTitle }: { courseSlug: string; courseTitle: string }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<{ type: "error" | "success"; text: string } | null>(null);
  const [result, setResult] = useState<Extract<RegisterResponse, { ok: boolean }> | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus(null);
    setSubmitting(true);
    try {
      const res = await fetch("/api/apply/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, courseSlug }),
      });
      const data: RegisterResponse = await res.json();
      if (!res.ok || "error" in data) {
        setStatus({ type: "error", text: "error" in data ? data.error : "Something went wrong. Please try again." });
        return;
      }
      setResult(data);
      setStatus({ type: "success", text: "Registration confirmed." });
    } catch {
      setStatus({ type: "error", text: "Something went wrong. Please try again." });
    } finally {
      setSubmitting(false);
    }
  }

  if (result) {
    return (
      <div className="rounded-2xl border border-green-200 bg-green-50 p-6 sm:p-8">
        <CheckCircle2 className="text-green-600" size={40} />
        <h2 className="mt-4 text-2xl font-bold tracking-tight">Registration confirmed</h2>
        <p className="mt-3 text-base text-[#5f5b65]">
          Thank you, <b className="text-ink">{result.applicant.full_name}</b>. Your spot in the <b>{result.courseTitle}</b>{" "}
          program is reserved.
        </p>
        <div className="mt-6 rounded-xl bg-white p-5 text-sm text-[#4d4752]">
          <p><b className="text-ink">Name:</b> {result.applicant.full_name}</p>
          <p className="mt-1"><b className="text-ink">Email:</b> {result.applicant.email}</p>
          <p className="mt-1"><b className="text-ink">WhatsApp:</b> {result.applicant.whatsapp || "—"}</p>
          <p className="mt-1"><b className="text-ink">Age bracket:</b> {result.applicant.age_bracket}</p>
          <p className="mt-1"><b className="text-ink">Status:</b> {result.paymentStatus === "paid" ? "Payment received" : "Awaiting payment"}</p>
        </div>

        <div className="mt-6 flex items-start gap-3 rounded-xl border border-brand/20 bg-white p-5">
          <Lock className="mt-0.5 shrink-0 text-brand" size={20} />
          <div>
            <p className="text-sm font-semibold text-ink">Payment via Paystack</p>
            <p className="mt-1 text-sm text-[#5f5b65]">
              Secure your spot by completing your tuition payment. You&apos;ll be redirected to Paystack to pay securely
              online.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => router.push(`/payment?enrollment=${result.enrollmentId}`)}
          className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-brand px-6 py-3.5 text-base font-semibold text-white shadow-[0_10px_22px_rgba(84,41,208,0.3)] transition-transform hover:scale-[1.02] active:scale-95"
        >
          Proceed to payment
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label htmlFor="register-email" className="text-sm font-semibold text-ink">
          Email used for the assessment
        </label>
        <input
          id="register-email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className="mt-2 w-full rounded-xl border border-[#e2d9f2] bg-white px-4 py-3 text-base text-ink outline-none transition-colors placeholder:text-[#b5afbd] focus:border-brand"
        />
      </div>

      {status && (
        <p
          className={`rounded-xl px-4 py-3 text-sm font-medium ${
            status.type === "error" ? "bg-red-50 text-red-700" : "bg-green-50 text-green-700"
          }`}
        >
          {status.text}
        </p>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-brand px-6 py-3.5 text-base font-semibold text-white shadow-[0_10px_22px_rgba(84,41,208,0.3)] transition-transform hover:scale-[1.02] active:scale-95 disabled:opacity-60"
      >
        {submitting ? <Loader2 size={18} className="animate-spin" /> : null}
        {submitting ? "Confirming…" : "Confirm registration"}
      </button>
    </form>
  );
}
