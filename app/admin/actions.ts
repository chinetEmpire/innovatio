"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { requireAdmin } from "@/lib/admin";
import { serviceClient } from "@/lib/supabase/admin";
import { serverClient } from "@/lib/supabase/server";

export async function logoutAction() {
  const sb = await serverClient();
  await sb.auth.signOut();
  redirect("/admin/login");
}

function parseId(value: FormDataEntryValue | null): string {
  const id = typeof value === "string" ? value.trim() : "";
  if (!id) throw new Error("Missing id.");
  return id;
}

function parseIntField(value: FormDataEntryValue | null, fallback: number, min = 0, max = 100000): number {
  const raw = typeof value === "string" ? value.trim() : "";
  if (raw === "") return fallback;
  const n = Number.parseInt(raw, 10);
  if (Number.isNaN(n)) return fallback;
  return Math.min(Math.max(n, min), max);
}

function parseOptionalInt(value: FormDataEntryValue | null): number | null {
  const raw = typeof value === "string" ? value.trim() : "";
  if (raw === "" || raw.toLowerCase() === "unlimited") return null;
  const n = Number.parseInt(raw, 10);
  if (Number.isNaN(n)) return null;
  return Math.max(n, 1);
}

function parseBool(value: FormDataEntryValue | null): boolean {
  return value === "on" || value === "true" || value === "1";
}

type IncomingChoice = { text?: unknown; isCorrect?: unknown };
type IncomingQuestion = { text?: unknown; points?: unknown; choices?: unknown };

export async function createAssessmentWithQuestionsAction(formData: FormData) {
  await requireAdmin();
  const courseId = parseId(formData.get("courseId"));
  const title = String(formData.get("title") ?? "").trim();
  if (!title || !courseId) throw new Error("Title and course are required.");

  let rawQuestions: IncomingQuestion[] = [];
  try {
    const payload = formData.get("questions");
    if (typeof payload === "string" && payload.trim()) {
      const parsed = JSON.parse(payload);
      if (Array.isArray(parsed)) rawQuestions = parsed;
    }
  } catch {
    throw new Error("Could not read the questions you added. Please try again.");
  }

  const questions = rawQuestions.map((q) => ({
    text: String(q?.text ?? "").trim(),
    points: Math.min(Math.max(Math.trunc(Number(q?.points) || 1), 1), 1000),
    choices: (Array.isArray(q?.choices) ? q.choices : []).map((c: IncomingChoice) => ({
      text: String(c?.text ?? "").trim(),
      isCorrect: Boolean(c?.isCorrect),
    })),
  }));

  if (questions.length === 0) throw new Error("Add at least one question before creating the assessment.");
  for (const [index, q] of questions.entries()) {
    const label = `Question ${index + 1}`;
    if (!q.text) throw new Error(`${label}: the question text is required.`);
    const filled = q.choices.filter((c) => c.text !== "");
    if (filled.length < 2) throw new Error(`${label}: add at least two answer choices.`);
    const correctCount = filled.filter((c) => c.isCorrect).length;
    if (correctCount === 0) throw new Error(`${label}: mark one choice as the correct answer.`);
    if (correctCount > 1) throw new Error(`${label}: only one choice can be the correct answer.`);
  }

  const sb = serviceClient();
  const { data: assessment, error: assessmentError } = await sb
    .from("assessments")
    .insert({
      course_id: courseId,
      title,
      description: "",
      pass_mark: parseIntField(formData.get("passMark"), 50, 1, 100),
      duration_minutes: parseIntField(formData.get("durationMinutes"), 30, 1, 600),
      max_attempts: parseOptionalInt(formData.get("maxAttempts")),
      retake_cooldown_hours: parseIntField(formData.get("retakeCooldownHours"), 24, 0, 8760),
      shuffle_questions: parseBool(formData.get("shuffleQuestions")),
      active: false,
    })
    .select("id")
    .single();
  if (assessmentError || !assessment) throw new Error(assessmentError?.message ?? "Could not save the assessment.");

  try {
    for (const [index, q] of questions.entries()) {
      const filledChoices = q.choices.filter((c) => c.text !== "");
      const { data: question, error: questionError } = await sb
        .from("questions")
        .insert({ assessment_id: assessment.id, text: q.text, points: q.points, position: index + 1 })
        .select("id")
        .single();
      if (questionError || !question) throw new Error(questionError?.message ?? "Could not save the questions.");

      const choiceRows = filledChoices.map((c, choiceIndex) => ({
        question_id: question.id,
        text: c.text,
        is_correct: c.isCorrect,
        position: choiceIndex + 1,
      }));
      const { error: choicesError } = await sb.from("choices").insert(choiceRows);
      if (choicesError) throw new Error(choicesError.message);
    }
  } catch (err) {
    await sb.from("assessments").delete().eq("id", assessment.id);
    throw err instanceof Error ? err : new Error("Could not save the questions.");
  }

  revalidatePath("/admin/assessments");
}

export async function updateAssessmentAction(formData: FormData) {
  await requireAdmin();
  const id = parseId(formData.get("id"));

  const { error } = await serviceClient()
    .from("assessments")
    .update({
      title: String(formData.get("title") ?? "").trim(),
      description: String(formData.get("description") ?? "").trim(),
      pass_mark: parseIntField(formData.get("passMark"), 50, 1, 100),
      duration_minutes: parseIntField(formData.get("durationMinutes"), 30, 1, 600),
      max_attempts: parseOptionalInt(formData.get("maxAttempts")),
      retake_cooldown_hours: parseIntField(formData.get("retakeCooldownHours"), 24, 0, 8760),
      shuffle_questions: parseBool(formData.get("shuffleQuestions")),
    })
    .eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/admin/assessments");
  revalidatePath(`/admin/assessments/${id}`);
}

export async function toggleAssessmentActiveAction(formData: FormData) {
  await requireAdmin();
  const id = parseId(formData.get("id"));
  const active = parseBool(formData.get("active"));

  const { error } = await serviceClient().from("assessments").update({ active }).eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/admin/assessments");
}

export async function deleteAssessmentAction(formData: FormData) {
  await requireAdmin();
  const id = parseId(formData.get("id"));

  const { error } = await serviceClient().from("assessments").delete().eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/admin/assessments");
}

export async function addQuestionAction(formData: FormData) {
  await requireAdmin();
  const assessmentId = parseId(formData.get("assessmentId"));
  const text = String(formData.get("text") ?? "").trim();
  const points = parseIntField(formData.get("points"), 1, 1, 1000);
  if (!text) throw new Error("Question text is required.");

  const choiceTexts = formData
    .getAll("choice")
    .map((c) => String(c).trim())
    .filter(Boolean);
  const correctIndex = Number(formData.get("correctChoice"));

  if (choiceTexts.length < 2) throw new Error("Add at least two choices.");
  if (Number.isNaN(correctIndex) || !choiceTexts[correctIndex]) throw new Error("Mark one choice as correct.");

  const { data: existing } = await serviceClient()
    .from("questions")
    .select("position")
    .eq("assessment_id", assessmentId)
    .order("position", { ascending: false })
    .limit(1)
    .maybeSingle();

  const sb = serviceClient();
  const { data: question, error: questionError } = await sb
    .from("questions")
    .insert({ assessment_id: assessmentId, text, points, position: (existing?.position ?? 0) + 1 })
    .select("id")
    .single();
  if (questionError || !question) throw new Error("Could not save the question.");

  const choices = choiceTexts.map((text, index) => ({
    question_id: question.id,
    text,
    is_correct: index === correctIndex,
    position: index + 1,
  }));
  const { error: choicesError } = await sb.from("choices").insert(choices);
  if (choicesError) throw new Error("Could not save the choices.");

  revalidatePath(`/admin/assessments/${assessmentId}`);
}

export async function updateQuestionAction(formData: FormData) {
  await requireAdmin();
  const id = parseId(formData.get("id"));
  const assessmentId = parseId(formData.get("assessmentId"));
  const text = String(formData.get("text") ?? "").trim();
  const points = parseIntField(formData.get("points"), 1, 1, 1000);
  if (!text) throw new Error("Question text is required.");

  const choiceTexts = formData
    .getAll("choice")
    .map((c) => String(c).trim())
    .filter(Boolean);
  const correctIndex = Number(formData.get("correctChoice"));
  if (choiceTexts.length < 2) throw new Error("Add at least two choices.");
  if (Number.isNaN(correctIndex) || !choiceTexts[correctIndex]) throw new Error("Mark one choice as correct.");

  const sb = serviceClient();
  const { error: questionError } = await sb.from("questions").update({ text, points }).eq("id", id);
  if (questionError) throw new Error(questionError.message);
  const { error: deleteChoicesError } = await sb.from("choices").delete().eq("question_id", id);
  if (deleteChoicesError) throw new Error(deleteChoicesError.message);

  const choices = choiceTexts.map((text, index) => ({
    question_id: id,
    text,
    is_correct: index === correctIndex,
    position: index + 1,
  }));
  const { error: choicesError } = await sb.from("choices").insert(choices);
  if (choicesError) throw new Error("Could not save the choices.");

  revalidatePath(`/admin/assessments/${assessmentId}`);
}

export async function deleteQuestionAction(formData: FormData) {
  await requireAdmin();
  const id = parseId(formData.get("id"));
  const assessmentId = parseId(formData.get("assessmentId"));

  const { error } = await serviceClient().from("questions").delete().eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath(`/admin/assessments/${assessmentId}`);
}

export async function updateApplicantAction(formData: FormData) {
  await requireAdmin();
  const id = parseId(formData.get("id"));
  const fullName = String(formData.get("fullName") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const courseId = parseId(formData.get("courseId"));
  if (!fullName || !email || !courseId) throw new Error("Name, email, and course are required.");

  const { error } = await serviceClient()
    .from("applicants")
    .update({
      full_name: fullName,
      email,
      whatsapp: String(formData.get("whatsapp") ?? "").trim(),
      age_bracket: String(formData.get("ageBracket") ?? "").trim(),
      course_id: courseId,
    })
    .eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/admin/applicants");
  revalidatePath(`/admin/applicants/${id}`);
}

export async function deleteApplicantAction(formData: FormData) {
  await requireAdmin();
  const id = parseId(formData.get("id"));

  const { error } = await serviceClient().from("applicants").delete().eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/admin/applicants");
}

export async function markEnrollmentPaidAction(formData: FormData) {
  const admin = await requireAdmin();
  const id = parseId(formData.get("id"));

  const { data: enrollment } = await serviceClient()
    .from("enrollments")
    .select("id, payment_status")
    .eq("id", id)
    .maybeSingle();

  if (enrollment && enrollment.payment_status !== "paid") {
    const { error } = await serviceClient()
      .from("enrollments")
      .update({ payment_status: "paid", paid_at: new Date().toISOString(), paid_by: admin.email })
      .eq("id", id);
    if (error) throw new Error(error.message);
  }

  revalidatePath("/admin/applicants");
}
