import Link from "next/link";
import { redirect } from "next/navigation";
import { CheckCircle2, XCircle } from "lucide-react";

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
    sb.from("courses").select("id, slug, title").eq("slug", course).maybeSingle(),
    sb.from("attempts").select("*").eq("id", attemptId).maybeSingle(),
  ]);
  if (!courseRow || !attempt) redirect(`/apply/${course}`);
  if (attempt.status !== "submitted") redirect(`/apply/${course}`);

  const { data: applicant } = await sb
    .from("applicants")
    .select("id, email, full_name, whatsapp, age_bracket")
    .eq("id", attempt.applicant_id)
    .maybeSingle();

  const [{ data: assessment }, { data: questions }] = await Promise.all([
    sb.from("assessments").select("*").eq("id", attempt.assessment_id).maybeSingle(),
    sb
      .from("questions")
      .select("*, choices(id, text, is_correct, position)")
      .eq("assessment_id", attempt.assessment_id)
      .order("position", { ascending: true }),
  ]);

  if (!assessment) redirect(`/apply/${course}`);

  type ReviewQuestion = {
    id: string;
    text: string;
    choices: { id: string; text: string; is_correct: boolean }[];
  };
  const reviewQuestions = (questions ?? []) as unknown as ReviewQuestion[];

  const { data: allAttempts } = await sb
    .from("attempts")
    .select("*")
    .eq("applicant_id", attempt.applicant_id)
    .eq("assessment_id", assessment.id)
    .order("created_at", { ascending: true });

  const eligibility = evaluateEligibility({
    attempts: (allAttempts ?? []).filter((a) => a.status === "submitted"),
    assessment,
    courseSlug: courseRow.slug,
  });

  const answerMap = new Map((attempt.answers ?? []).map((a: { questionId: string; choiceId: string }) => [a.questionId, a.choiceId]));

  return (
    <main>
      <section className="mx-auto max-w-3xl px-5 py-14 sm:px-8 sm:py-20">
        <div
          className={`rounded-2xl border p-6 text-center shadow-[0_16px_40px_rgba(47,31,101,0.1)] sm:p-10 ${
            attempt.passed ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"
          }`}
        >
          {attempt.passed ? (
            <CheckCircle2 className="mx-auto text-green-600" size={48} />
          ) : (
            <XCircle className="mx-auto text-red-500" size={48} />
          )}
          <h1 className="mt-4 text-3xl font-bold tracking-tight">
            {attempt.passed ? "Congratulations — you passed!" : "Not this time"}
          </h1>
          {applicant && <p className="mt-2 text-base text-[#5f5b65]">Well done, {applicant.full_name.split(" ")[0]}.</p>}
          <p className="mx-auto mt-6 max-w-md text-base text-[#5f5b65]">
            Your score: <b className="text-ink">{attempt.score} / {questions?.reduce((s, q) => s + q.points, 0) ?? 0} points</b>{" "}
            ({attempt.score !== null && questions ? Math.round((attempt.score / questions.reduce((s, q) => s + q.points, 0)) * 100) : 0}%) · Pass mark: {assessment.pass_mark}%
          </p>

          <div className="mt-8">
            {attempt.passed ? (
              <>
                <p className="text-sm text-[#5f5b65]">You are now eligible to register and secure your spot.</p>
                <Link
                  href={`/apply/${courseRow.slug}/register`}
                  className="mt-5 inline-flex items-center rounded-full bg-brand px-7 py-3 text-sm font-semibold text-white shadow-[0_10px_22px_rgba(84,41,208,0.3)] transition-transform hover:scale-[1.03] active:scale-95"
                >
                  Proceed to registration
                </Link>
              </>
            ) : (
              <>
                <p className="text-sm text-[#5f5b65]">
                  {eligibility.action === "blocked"
                    ? "You have used all your allowed attempts for this assessment."
                    : eligibility.action === "cooldown"
                      ? eligibility.message
                      : "You can retake the assessment to try again."}
                </p>
                {eligibility.action === "start" && (
                  <Link
                    href="/apply"
                    className="mt-5 inline-flex items-center rounded-full bg-brand px-7 py-3 text-sm font-semibold text-white shadow-[0_10px_22px_rgba(84,41,208,0.3)] transition-transform hover:scale-[1.03] active:scale-95"
                  >
                    Retake assessment
                  </Link>
                )}
              </>
            )}
          </div>
        </div>

        {reviewQuestions.length > 0 && (
          <div className="mt-10">
            <h2 className="text-xl font-bold tracking-tight">Review your answers</h2>
            <div className="mt-5 space-y-3">
              {reviewQuestions.map((q) => {
                const selectedId = answerMap.get(q.id);
                const selectedChoice = q.choices.find((c) => c.id === selectedId);
                const correct = selectedChoice?.is_correct === true;
                const correctChoice = q.choices.find((c) => c.is_correct);
                return (
                  <div
                    key={q.id}
                    className={`rounded-xl border bg-white p-5 ${correct ? "border-green-100" : "border-[#e9e2f5]"}`}
                  >
                    <p className="flex items-start gap-2 text-sm font-semibold text-ink sm:text-base">
                      {correct ? (
                        <CheckCircle2 className="mt-0.5 shrink-0 text-green-600" size={18} />
                      ) : (
                        <XCircle className="mt-0.5 shrink-0 text-red-500" size={18} />
                      )}
                      {q.text}
                    </p>
                    <p className="mt-3 text-sm text-[#5f5b65]">
                      Your answer: <b className="text-ink">{selectedChoice?.text ?? "Not answered"}</b>
                    </p>
                    {!correct && (
                      <p className="mt-1 text-sm text-[#5f5b65]">
                        Correct answer: <b className="text-green-700">{correctChoice?.text}</b>
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
