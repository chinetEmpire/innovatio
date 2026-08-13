import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { markEnrollmentPaidAction } from "../../../actions";
import { requireAdmin } from "@/lib/admin";
import { serviceClient } from "@/lib/supabase/admin";
import { formatDate, formatDateTime } from "@/lib/format";

export const dynamic = "force-dynamic";

type Attempt = {
  id: string;
  score: number | null;
  passed: boolean | null;
  status: string;
  started_at: string;
  submitted_at: string | null;
};

export default async function ApplicantDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  await requireAdmin();
  const sb = serviceClient();

  const [{ data: applicant }, { data: attempts }, { data: enrollments }] = await Promise.all([
    sb.from("applicants").select("*, courses(slug, title)").eq("id", id).maybeSingle(),
    sb.from("attempts").select("id, score, passed, status, started_at, submitted_at").eq("applicant_id", id).order("started_at", { ascending: false }),
    sb
      .from("enrollments")
      .select("id, payment_status, plan_key, amount_kobo, payment_reference, paid_at, paid_by, created_at")
      .eq("applicant_id", id)
      .order("created_at", { ascending: false }),
  ]);

  if (!applicant) {
    return (
      <div className="rounded-2xl border border-dashed border-[#e9e2f5] bg-white px-5 py-12 text-center">
        <p className="text-base text-[#5f5b65]">Applicant not found.</p>
        <Link href="/admin/applicants" className="mt-3 inline-block text-sm font-semibold text-brand hover:underline">
          Back to applicants
        </Link>
      </div>
    );
  }

  const attemptsList = (attempts ?? []) as Attempt[];
  const submitted = attemptsList.filter((a) => a.status === "submitted");
  const passedCount = submitted.filter((a) => a.passed).length;
  const latestAttempt = submitted[0];

  return (
    <div className="space-y-10">
      <div>
        <Link href="/admin/applicants" className="inline-flex items-center gap-2 text-sm font-semibold text-[#8a8493] transition-colors hover:text-brand">
          <ArrowLeft size={16} /> Back to applicants
        </Link>
        <h1 className="mt-2 text-3xl font-bold tracking-tight">{applicant.full_name}</h1>
        <p className="mt-2 text-base text-[#5f5b65]">
          {(applicant.courses as unknown as { title: string } | null)?.title ?? "No course"} · Applied {formatDate(applicant.created_at)}
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-[#e9e2f5] bg-white p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-[#8a8493]">Email</p>
          <p className="mt-2 break-all text-sm font-semibold text-ink">{applicant.email}</p>
        </div>
        <div className="rounded-2xl border border-[#e9e2f5] bg-white p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-[#8a8493]">WhatsApp</p>
          <p className="mt-2 text-sm font-semibold text-ink">{applicant.whatsapp || "—"}</p>
        </div>
        <div className="rounded-2xl border border-[#e9e2f5] bg-white p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-[#8a8493]">Age bracket</p>
          <p className="mt-2 text-sm font-semibold text-ink">{applicant.age_bracket || "—"}</p>
        </div>
        <div className="rounded-2xl border border-[#e9e2f5] bg-white p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-[#8a8493]">Attempts passed</p>
          <p className="mt-2 text-sm font-semibold text-green-700">{passedCount} / {submitted.length}</p>
        </div>
      </div>

      <div className="rounded-2xl border border-[#e9e2f5] bg-white p-6">
        <h2 className="text-lg font-bold">Assessment history</h2>
        <div className="mt-4 space-y-3">
          {attemptsList.map((attempt, index) => (
            <div key={attempt.id} className="flex flex-col gap-3 rounded-xl border border-[#f0ecf6] bg-[#faf7ff] px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-bold text-ink">Attempt {attemptsList.length - index}</p>
                <p className="mt-1 text-xs text-[#8a8493]">
                  {attempt.status === "submitted"
                    ? `Submitted ${attempt.submitted_at ? formatDateTime(attempt.submitted_at) : "—"}`
                    : `Started ${formatDateTime(attempt.started_at)} · in progress`}
                </p>
              </div>
              <div className="sm:text-right">
                {attempt.status === "submitted" ? (
                  <>
                    <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold ${attempt.passed ? "bg-green-50 text-green-700" : "bg-red-50 text-red-600"}`}>
                      {attempt.passed ? "Pass" : "Fail"}
                    </span>
                    <p className="mt-1 text-sm font-semibold text-ink">Score: {attempt.score ?? 0}</p>
                  </>
                ) : (
                  <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1 text-xs font-bold text-[#8a8493]">In progress</span>
                )}
              </div>
            </div>
          ))}
          {attemptsList.length === 0 && <p className="py-6 text-center text-sm text-[#8a8493]">No attempts recorded.</p>}
        </div>
      </div>

      {latestAttempt?.passed && (
        <div className="rounded-2xl border border-[#e9e2f5] bg-white p-6">
          <h2 className="text-lg font-bold">Enrollment</h2>
          {(enrollments ?? []).map((enrollment) => (
            <div key={enrollment.id} className="mt-4 flex flex-col gap-3 rounded-xl border border-[#f0ecf6] bg-[#faf7ff] px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-bold text-ink">
                  {enrollment.payment_status === "paid"
                    ? "Payment received"
                    : enrollment.payment_status === "failed"
                      ? "Payment failed"
                      : "Payment pending"}
                </p>
                <p className="mt-1 text-xs text-[#8a8493]">
                  Started {formatDateTime(enrollment.created_at)}
                  {enrollment.paid_at && enrollment.payment_status === "paid" && ` · Paid ${formatDateTime(enrollment.paid_at)}`}
                  {enrollment.payment_status === "paid" && enrollment.paid_by && ` by ${enrollment.paid_by}`}
                </p>
                {(enrollment.plan_key || enrollment.amount_kobo != null) && (
                  <p className="mt-1 text-xs text-[#8a8493]">
                    {enrollment.plan_key === "upfront"
                      ? "Pay upfront"
                      : enrollment.plan_key === "instalments"
                        ? "2 instalments"
                        : "Plan"} · ₦{((enrollment.amount_kobo ?? 0) / 100).toLocaleString("en-NG")} due now
                  </p>
                )}
                {enrollment.payment_reference && (
                  <p className="mt-1 break-all text-xs text-[#8a8493]">Ref: {enrollment.payment_reference}</p>
                )}
              </div>
              {enrollment.payment_status !== "paid" && (
                <form action={markEnrollmentPaidAction}>
                  <input type="hidden" name="id" value={enrollment.id} />
                  <button type="submit" className="w-full rounded-full bg-green-600 px-5 py-2 text-sm font-semibold text-white transition-transform hover:scale-[1.02] active:scale-95 sm:w-auto">
                    Mark as paid
                  </button>
                </form>
              )}
            </div>
          ))}
          {(enrollments ?? []).length === 0 && (
            <div className="mt-4 rounded-xl border border-[#f0ecf6] bg-[#faf7ff] px-5 py-4">
              <p className="text-sm font-bold text-ink">Eligible for enrollment</p>
              <p className="mt-1 text-xs text-[#8a8493]">
                Passed the assessment — invite this applicant to register. No enrollment yet.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
