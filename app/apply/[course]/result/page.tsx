import { redirect } from "next/navigation";

import Header from "@/components/Header";
import RetakeAssessmentAction from "@/components/apply/RetakeAssessmentAction";
import { evaluateEligibility } from "@/lib/assessment";
import { serviceClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

export default async function ResultPage({
  params,
  searchParams,
}: {
  params: Promise<{ course: string }>;
  searchParams: Promise<{ attempt?: string }>;
}) {
  const { course } = await params;
  const { attempt: attemptId } = await searchParams;
  if (!attemptId) redirect(`/apply/${course}`);

  const sb = serviceClient();
  const [{ data: courseRow }, { data: attempt }] = await Promise.all([
    sb.from("courses").select("id, slug").eq("slug", course).maybeSingle(),
    sb.from("attempts").select("*").eq("id", attemptId).maybeSingle(),
  ]);
  if (!courseRow || !attempt || attempt.status !== "submitted") redirect(`/apply/${course}`);

  const { data: assessment } = await sb
    .from("assessments")
    .select("*")
    .eq("id", attempt.assessment_id)
    .maybeSingle();
  if (!assessment) redirect(`/apply/${course}`);

  if (attempt.passed) {
    const { data: existing } = await sb
      .from("enrollments")
      .select("id")
      .eq("applicant_id", attempt.applicant_id)
      .eq("course_id", courseRow.id)
      .maybeSingle();

    let enrollmentId = existing?.id ?? null;
    if (!enrollmentId) {
      const { data: created, error: insertError } = await sb
        .from("enrollments")
        .insert({
          applicant_id: attempt.applicant_id,
          course_id: courseRow.id,
          attempt_id: attempt.id,
          payment_status: "pending",
        })
        .select("id")
        .single();
      if (!insertError && created) enrollmentId = created.id;
    }

    if (enrollmentId) redirect(`/payment?enrollment=${enrollmentId}`);
  }

  const { data: allAttempts } = await sb
    .from("attempts")
    .select("*")
    .eq("applicant_id", attempt.applicant_id)
    .eq("assessment_id", assessment.id)
    .order("created_at", { ascending: true });

  const submittedAttempts = (allAttempts ?? []).filter((item) => item.status === "submitted");
  const eligibility = evaluateEligibility({
    attempts: submittedAttempts,
    assessment,
    courseSlug: courseRow.slug,
  });
  const attemptsUsed = submittedAttempts.length;
  const maxAttemptsReached = assessment.max_attempts !== null && attemptsUsed >= assessment.max_attempts;
  const remainingAttempts = assessment.max_attempts === null ? null : Math.max(0, assessment.max_attempts - attemptsUsed);
  const cooldownMs = eligibility.action === "cooldown" ? eligibility.retryAfterMs : 0;

  return (
    <>
      <Header showEnroll={false} />
      <main className="min-h-[calc(100vh-76px)] bg-[#fdfcff]">
        <section className="mx-auto max-w-[1000px] px-5 py-16 sm:px-8 sm:py-24 lg:py-28">
          <div className="bg-white px-6 py-12 shadow-[0_14px_38px_rgba(47,31,101,0.035)] sm:px-12 sm:py-16 lg:px-[68px] lg:py-[72px]">
            <h1 className="text-3xl font-bold tracking-tight text-ink sm:text-[34px]">You&apos;re Almost There!</h1>
            <p className="mt-11 text-[20px] leading-relaxed text-ink sm:text-[24px]">
              Thank you for completing the assessment.
            </p>
            <p className="mt-6 max-w-[790px] text-[20px] leading-[1.4] text-ink sm:text-[24px]">
              You didn&apos;t meet the passing score this time, but you still have{" "}
              {remainingAttempts === null ? "additional" : <strong>{remainingAttempts}</strong>}{" "}
              attempt{remainingAttempts === 1 ? "" : "s"} remaining. Review the questions carefully and try again when you&apos;re ready.
            </p>
            <RetakeAssessmentAction href="/apply" cooldownMs={cooldownMs} maxAttemptsReached={maxAttemptsReached} />
          </div>
        </section>
      </main>
    </>
  );
}
