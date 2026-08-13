import Link from "next/link";
import { redirect } from "next/navigation";
import { CheckCircle2, Clock, XCircle } from "lucide-react";

import { verifyTransaction } from "@/lib/paystack";
import { serviceClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Payment status — Innovatio Academy",
};

export default async function PaymentVerifyPage({
  searchParams,
}: {
  searchParams: Promise<{ reference?: string; enrollment?: string }>;
}) {
  const { reference, enrollment: enrollmentId } = await searchParams;
  if (!reference || !enrollmentId) redirect("/apply");

  const sb = serviceClient();

  const { data: enrollment } = await sb
    .from("enrollments")
    .select("id, payment_status, applicants(full_name), courses(title)")
    .eq("id", enrollmentId)
    .maybeSingle();

  if (!enrollment) redirect("/apply");

  const applicant = (enrollment.applicants as unknown as { full_name: string } | null) ?? null;
  const course = (enrollment.courses as unknown as { title: string } | null) ?? null;

  let status: "success" | "failed" | "pending" =
    enrollment.payment_status === "paid" ? "success" : "pending";

  if (status === "pending") {
    try {
      const txn = await verifyTransaction(reference);
      if (txn.status === "success") {
        await sb
          .from("enrollments")
          .update({ payment_status: "paid", paid_at: new Date().toISOString() })
          .eq("id", enrollment.id);
        status = "success";
      } else if (txn.status === "failed" || txn.status === "abandoned") {
        status = "failed";
      }
    } catch {
      status = "failed";
    }
  }

  const isSuccess = status === "success";

  return (
    <main className="min-h-screen bg-[#f2f2f2]">
      <div className="mx-auto max-w-[760px] px-5 py-16 sm:px-8">
        <div
          className={`rounded-[18px] border bg-white p-8 text-center sm:p-12 ${
            isSuccess ? "border-green-200" : "border-[#e9e9e9]"
          }`}
        >
          <div
            className={`mx-auto flex h-14 w-14 items-center justify-center rounded-full ${
              isSuccess ? "bg-green-100" : status === "failed" ? "bg-red-100" : "bg-[#f2ebff]"
            }`}
          >
            {isSuccess ? (
              <CheckCircle2 className="text-green-600" size={28} />
            ) : status === "failed" ? (
              <XCircle className="text-red-500" size={28} />
            ) : (
              <Clock className="text-[#5b2ed6]" size={28} />
            )}
          </div>

          <h1 className="mt-6 text-3xl font-black tracking-[-0.04em] text-[#151515]">
            {isSuccess
              ? "Payment received"
              : status === "failed"
                ? "Payment not confirmed"
                : "Confirming payment…"}
          </h1>

          <p className="mx-auto mt-4 max-w-md text-[15px] leading-relaxed text-[#4d4d4d]">
            {isSuccess ? (
              <>
                Thank you{applicant ? `, ${applicant.full_name.split(" ")[0]}` : ""}! Your tuition for{" "}
                <b className="text-[#171717]">{course?.title ?? "your course"}</b> has been confirmed. You&apos;ll
                receive your onboarding details shortly.
              </>
            ) : status === "failed" ? (
              <>
                We couldn&apos;t confirm your payment. If your bank was debited, please contact our admissions team — or
                try again below.
              </>
            ) : (
              <>Your payment is still being processed. Check back shortly — we&apos;ll update your status automatically.</>
            )}
          </p>

          {!isSuccess && (
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href={`/payment?enrollment=${encodeURIComponent(enrollment.id)}`}
                className="inline-flex items-center rounded-[14px] bg-[#4c2ada] px-6 py-3.5 text-[15px] font-bold text-white shadow-[0_12px_20px_rgba(76,42,218,0.28)] transition-transform hover:translate-y-[-1px]"
              >
                Try payment again
              </Link>
              <Link
                href="/apply"
                className="inline-flex items-center rounded-[14px] border border-[#dedfe2] bg-white px-6 py-3.5 text-[15px] font-bold text-[#171717] transition-colors hover:border-[#4c2ada] hover:text-[#4c2ada]"
              >
                Back to apply
              </Link>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
