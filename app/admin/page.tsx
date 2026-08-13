import Link from "next/link";
import { CheckCircle2, ClipboardList, TrendingUp, Users, XCircle } from "lucide-react";

import { requireAdmin } from "@/lib/admin";
import { serviceClient } from "@/lib/supabase/admin";
import { formatDate } from "@/lib/format";

export const dynamic = "force-dynamic";

type Submission = {
  id: string;
  applicant_id: string;
  assessment_id: string;
  score: number | null;
  passed: boolean | null;
  submitted_at: string | null;
  applicants: { id: string; full_name: string; email: string; course_id: string } | null;
};

export default async function AdminDashboard() {
  await requireAdmin();
  const sb = serviceClient();

  const [{ data: applicants }, { data: attemptsData }, { data: enrollments }, { data: courses }] = await Promise.all([
    sb.from("applicants").select("id, course_id").order("created_at", { ascending: false }),
    sb
      .from("attempts")
      .select("id, applicant_id, assessment_id, score, passed, submitted_at, applicants(id, full_name, email, course_id)")
      .eq("status", "submitted")
      .order("submitted_at", { ascending: false })
      .limit(500),
    sb.from("enrollments").select("applicant_id, course_id, payment_status"),
    sb.from("courses").select("id, slug, title"),
  ]);

  const attempts = (attemptsData ?? []) as unknown as Submission[];
  const courseById = new Map((courses ?? []).map((c) => [c.id, c]));

  const submitted = attempts.filter((a) => a.passed !== null);
  const passed = submitted.filter((a) => a.passed);
  const failed = submitted.filter((a) => !a.passed);
  const passRate = submitted.length ? Math.round((passed.length / submitted.length) * 100) : 0;

  const paidEnrollments = new Set(
    (enrollments ?? []).filter((e) => e.payment_status === "paid").map((e) => `${e.applicant_id}:${e.course_id}`)
  );
  const passedApplicants = new Map<string, { courseId: string; applicantId: string }>();
  for (const a of passed) {
    if (a.applicants && !passedApplicants.has(a.applicants.id)) {
      passedApplicants.set(a.applicants.id, { courseId: a.applicants.course_id, applicantId: a.applicants.id });
    }
  }
  const eligibleForPayment = [...passedApplicants.values()].filter(
    (p) => !paidEnrollments.has(`${p.applicantId}:${p.courseId}`)
  ).length;

  const byCourse = new Map<string, { submitted: number; passed: number }>();
  for (const a of submitted) {
    const courseId = a.applicants?.course_id ?? "";
    const entry = byCourse.get(courseId) ?? { submitted: 0, passed: 0 };
    entry.submitted += 1;
    if (a.passed) entry.passed += 1;
    byCourse.set(courseId, entry);
  }

  const stats = [
    { label: "Total applicants", value: (applicants ?? []).length, icon: Users },
    { label: "Assessments submitted", value: submitted.length, icon: ClipboardList },
    { label: "Pass rate", value: `${passRate}%`, icon: TrendingUp },
    { label: "Eligible for payment", value: eligibleForPayment, icon: CheckCircle2 },
  ];

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="mt-2 text-base text-[#5f5b65]">Overview of applicants and assessment performance.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map(({ label, value, icon: Icon }) => (
          <div key={label} className="rounded-2xl border border-[#e9e2f5] bg-white p-5">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand/10 text-brand">
              <Icon size={18} />
            </span>
            <p className="mt-4 text-2xl font-bold tracking-tight">{value}</p>
            <p className="mt-1 text-sm text-[#5f5b65]">{label}</p>
          </div>
        ))}
      </div>

      <div>
        <h2 className="text-xl font-bold tracking-tight">Performance by course</h2>
        <div className="mt-4 overflow-hidden rounded-2xl border border-[#e9e2f5] bg-white">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-[#f0ecf6] bg-[#faf7ff] text-xs uppercase tracking-wide text-[#8a8493]">
              <tr>
                <th className="px-5 py-3 font-semibold">Course</th>
                <th className="px-5 py-3 font-semibold">Submitted</th>
                <th className="px-5 py-3 font-semibold">Passed</th>
                <th className="px-5 py-3 font-semibold">Pass rate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f0ecf6]">
              {(courses ?? []).map((course) => {
                const entry = byCourse.get(course.id) ?? { submitted: 0, passed: 0 };
                const rate = entry.submitted ? Math.round((entry.passed / entry.submitted) * 100) : 0;
                return (
                  <tr key={course.id}>
                    <td className="px-5 py-3 font-semibold text-ink">{course.title}</td>
                    <td className="px-5 py-3 text-[#5f5b65]">{entry.submitted}</td>
                    <td className="px-5 py-3 text-[#5f5b65]">{entry.passed}</td>
                    <td className="px-5 py-3">
                      <span className="inline-block rounded-full bg-brand/10 px-3 py-1 text-xs font-bold text-brand">
                        {rate}%
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold tracking-tight">Recent assessments</h2>
          <Link href="/admin/applicants" className="text-sm font-semibold text-brand hover:underline">
            View all applicants
          </Link>
        </div>
        <div className="mt-4 overflow-hidden rounded-2xl border border-[#e9e2f5] bg-white">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-[#f0ecf6] bg-[#faf7ff] text-xs uppercase tracking-wide text-[#8a8493]">
              <tr>
                <th className="px-5 py-3 font-semibold">Applicant</th>
                <th className="px-5 py-3 font-semibold">Course</th>
                <th className="px-5 py-3 font-semibold">Score</th>
                <th className="px-5 py-3 font-semibold">Result</th>
                <th className="px-5 py-3 font-semibold">Taken</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f0ecf6]">
              {attempts.slice(0, 10).map((a) => {
                const course = courseById.get(a.applicants?.course_id ?? "");
                return (
                  <tr key={a.id}>
                    <td className="px-5 py-3">
                      <Link href={`/admin/applicants/${a.applicants?.id}`} className="font-semibold text-ink hover:text-brand">
                        {a.applicants?.full_name ?? "Unknown"}
                      </Link>
                    </td>
                    <td className="px-5 py-3 text-[#5f5b65]">{course?.title ?? "—"}</td>
                    <td className="px-5 py-3 text-[#5f5b65]">{a.score ?? "—"}</td>
                    <td className="px-5 py-3">
                      {a.passed ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-3 py-1 text-xs font-bold text-green-700">
                          <CheckCircle2 size={12} /> Pass
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-3 py-1 text-xs font-bold text-red-600">
                          <XCircle size={12} /> Fail
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-3 text-[#8a8493]">{a.submitted_at ? formatDate(a.submitted_at) : "—"}</td>
                  </tr>
                );
              })}
              {attempts.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-5 py-8 text-center text-[#8a8493]">
                    No assessments submitted yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
