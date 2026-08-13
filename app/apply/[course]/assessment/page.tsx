import { redirect } from "next/navigation";

import AssessmentRunner from "@/components/apply/AssessmentRunner";
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

  const { data: assessment } = await sb
    .from("assessments")
    .select("*")
    .eq("id", attempt.assessment_id)
    .maybeSingle();
  if (!assessment) redirect(`/apply/${course}`);

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
