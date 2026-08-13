import { NextResponse } from "next/server";

import { computeScore, type QuestionWithChoices } from "@/lib/assessment";
import { serviceClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";

export async function POST(req: Request) {
  let body: { attemptId?: string; answers?: { questionId: string; choiceId: string }[] };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const attemptId = body.attemptId?.trim() ?? "";
  const answers = Array.isArray(body.answers) ? body.answers : [];

  if (!attemptId) {
    return NextResponse.json({ error: "Missing attempt id." }, { status: 400 });
  }

  const sb = serviceClient();

  const { data: attempt, error: attemptError } = await sb
    .from("attempts")
    .select("id, applicant_id, assessment_id, status, started_at, answers")
    .eq("id", attemptId)
    .maybeSingle();
  if (attemptError || !attempt) {
    return NextResponse.json({ error: "Attempt not found." }, { status: 404 });
  }
  if (attempt.status !== "in_progress") {
    return NextResponse.json({ error: "This attempt has already been submitted." }, { status: 400 });
  }

  const { data: assessment, error: assessmentError } = await sb
    .from("assessments")
    .select("id, course_id, pass_mark, duration_minutes")
    .eq("id", attempt.assessment_id)
    .maybeSingle();
  if (assessmentError || !assessment) {
    return NextResponse.json({ error: "Assessment not found." }, { status: 404 });
  }

  const { data: course } = await sb.from("courses").select("slug").eq("id", assessment.course_id).maybeSingle();

  const { data: questions, error: questionsError } = await sb
    .from("questions")
    .select("id, text, points, position, choices(id, text, is_correct, position)")
    .eq("assessment_id", assessment.id)
    .order("position", { ascending: true });
  if (questionsError || !questions) {
    return NextResponse.json({ error: "Could not load the assessment." }, { status: 500 });
  }

  const result = computeScore(answers, questions as unknown as QuestionWithChoices[], assessment.pass_mark);

  const { error: updateError } = await sb
    .from("attempts")
    .update({
      status: "submitted",
      submitted_at: new Date().toISOString(),
      score: result.score,
      passed: result.passed,
      answers: answers,
    })
    .eq("id", attempt.id);
  if (updateError) {
    return NextResponse.json({ error: "Could not save your result. Please try again." }, { status: 500 });
  }

  const redirect = `/apply/${course?.slug ?? "course"}/result?attempt=${attempt.id}`;
  return NextResponse.json({
    score: result.score,
    total: result.total,
    percent: result.percent,
    passed: result.passed,
    redirect,
  });
}
