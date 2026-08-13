import Link from "next/link";
import { CheckCircle2, Clock, XCircle } from "lucide-react";

import { requireAdmin } from "@/lib/admin";
import { serviceClient } from "@/lib/supabase/admin";
import { formatDate } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function ApplicantsPage() {
  await requireAdmin();
  const sb = serviceClient();

  const [{ data: applicants }, { data: attempts }, { data: enrollments }] = await Promise.all([
    sb.from("applicants").select("id, full_name, email, whatsapp, age_bracket, course_id, created_at, courses(slug, title)").order("created_at", { ascending: false }),
    sb.from("attempts").select("applicant_id, score, passed, status, submitted_at").eq("status", "submitted"),
    sb.from("enrollments").select("applicant_id, course_id, payment_status"),
  ]);

  const attemptsByApplicant = new Map<string, { passed: boolean; score: number; submittedAt: string | null }>();
  for (const attempt of attempts ?? []) {
    const current = attemptsByApplicant.get(attempt.applicant_id);
    const better =
      !current ||
      (current.submittedAt ?? "") < (attempt.submitted_at ?? "");
    if (better) {
      attemptsByApplicant.set(attempt.applicant_id, {
        passed: attempt.passed === true,
        score: attempt.score ?? 0,
        submittedAt: attempt.submitted_at,
      });
    }
  }

  const paidEnrollments = new Set(
    (enrollments ?? []).filter((e) => e.payment_status === "paid").map((e) => `${e.applicant_id}:${e.course_id}`)
  );

  function statusFor(applicantId: string, courseId: string | null) {
    const attempt = attemptsByApplicant.get(applicantId);
    const isPaid = courseId && paidEnrollments.has(`${applicantId}:${courseId}`);
    if (isPaid) return { label: "Enrolled", tone: "bg-green-50 text-green-700", icon: CheckCircle2 };
    if (attempt?.passed) return { label: "Eligible", tone: "bg-brand/10 text-brand", icon: CheckCircle2 };
    if (attempt) return { label: "Failed", tone: "bg-red-50 text-red-600", icon: XCircle };
    return { label: "Not attempted", tone: "bg-gray-100 text-[#8a8493]", icon: Clock };
  }

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Applicants</h1>
        <p className="mt-2 text-base text-[#5f5b65]">{applicants?.length ?? 0} total applicants</p>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-[#e9e2f5] bg-white">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="border-b border-[#f0ecf6] bg-[#faf7ff] text-xs uppercase tracking-wide text-[#8a8493]">
            <tr>
              <th className="px-5 py-3 font-semibold">Applicant</th>
              <th className="px-5 py-3 font-semibold">Course</th>
              <th className="px-5 py-3 font-semibold">Age</th>
              <th className="px-5 py-3 font-semibold">Latest score</th>
              <th className="px-5 py-3 font-semibold">Status</th>
              <th className="px-5 py-3 font-semibold">Applied</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#f0ecf6]">
            {(applicants ?? []).map((applicant) => {
              const attempt = attemptsByApplicant.get(applicant.id);
              const status = statusFor(applicant.id, applicant.course_id);
              const StatusIcon = status.icon;
              return (
                <tr key={applicant.id} className="transition-colors hover:bg-[#faf7ff]">
                  <td className="px-5 py-3">
                    <Link href={`/admin/applicants/${applicant.id}`} className="font-semibold text-ink hover:text-brand">
                      {applicant.full_name}
                    </Link>
                    <p className="text-xs text-[#8a8493]">{applicant.email}</p>
                  </td>
                  <td className="px-5 py-3 text-[#5f5b65]">
                    {(applicant.courses as unknown as { title: string } | null)?.title ?? "—"}
                  </td>
                  <td className="px-5 py-3 text-[#5f5b65]">{applicant.age_bracket || "—"}</td>
                  <td className="px-5 py-3 text-[#5f5b65]">{attempt ? `${attempt.score}` : "—"}</td>
                  <td className="px-5 py-3">
                    <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold ${status.tone}`}>
                      <StatusIcon size={12} /> {status.label}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-[#8a8493]">{formatDate(applicant.created_at)}</td>
                </tr>
              );
            })}
            {(applicants ?? []).length === 0 && (
              <tr>
                <td colSpan={6} className="px-5 py-10 text-center text-[#8a8493]">
                  No applicants yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
