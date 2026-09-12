import { redirect } from "next/navigation";

import AssessmentRunner from "@/components/apply/AssessmentRunner";
import { grantedAttempts, grantAttemptOwnership } from "@/lib/attempts";
import { shuffle, toSafeQuestions, type QuestionWithChoices } from "@/lib/assessment";
import { serviceClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

export default async function AssessmentPage({
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

  const { data: courseRow } = await sb.from("courses").select("id, slug, title").eq("slug", course).maybeSingle();
  if (!courseRow) redirect("/apply");

  const { data: attempt } = await sb.from("attempts").select("*").eq("id", attemptId).maybeSingle();
  if (!attempt || attempt.status !== "in_progress") redirect(`/apply/${course}`);
  if (!(await grantedAttempts()).includes(attempt.id)) redirect(`/apply/${course}`);

  const { data: assessment } = await sb
    .from("assessments")
    .select("*")
    .eq("id", attempt.assessment_id)
    .maybeSingle();
  if (!assessment) redirect(`/apply/${course}`);

  const deadlineMs = new Date(attempt.started_at).getTime() + assessment.duration_minutes * 60 * 1000;
  if (Date.now() > deadlineMs + 30_000) {
    const { data: fresh, error: freshError } = await sb
      .from("attempts")
      .insert({ applicant_id: attempt.applicant_id, assessment_id: attempt.assessment_id })
      .select("id")
      .single();
    if (freshError || !fresh) redirect(`/apply/${course}`);
    await grantAttemptOwnership(fresh.id);
    redirect(`/apply/${course}/assessment?attempt=${fresh.id}`);
  }

  let questions: QuestionWithChoices[] = [];
  const { data } = await sb
    .from("questions")
    .select("*, choices(id, text, is_correct, position)")
    .eq("assessment_id", assessment.id)
    .order("position", { ascending: true });
  if (data) questions = data;

  if (assessment.shuffle_questions) {
    questions = shuffle(questions).map((q) => ({ ...q, choices: shuffle(q.choices) }));
  }

  const startedAt = attempt.started_at;

  return (
    <main>
      <AssessmentRunner
        attemptId={attempt.id}
        courseSlug={courseRow.slug}
        assessmentTitle={assessment.title}
        questions={toSafeQuestions(questions)}
        durationMinutes={assessment.duration_minutes}
        startedAt={startedAt}
      />
    </main>
  );
}
