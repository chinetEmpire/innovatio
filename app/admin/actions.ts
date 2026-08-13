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

export async function createAssessmentAction(formData: FormData) {
  await requireAdmin();
  const courseId = parseId(formData.get("courseId"));
  const title = String(formData.get("title") ?? "").trim();
  if (!title || !courseId) throw new Error("Title and course are required.");

  await serviceClient().from("assessments").insert({
    course_id: courseId,
    title,
    description: String(formData.get("description") ?? "").trim(),
    pass_mark: parseIntField(formData.get("passMark"), 50, 1, 100),
    duration_minutes: parseIntField(formData.get("durationMinutes"), 30, 1, 600),
    max_attempts: parseOptionalInt(formData.get("maxAttempts")),
    retake_cooldown_hours: parseIntField(formData.get("retakeCooldownHours"), 24, 0, 8760),
    shuffle_questions: parseBool(formData.get("shuffleQuestions")),
    active: true,
  });

  revalidatePath("/admin/assessments");
}

export async function updateAssessmentAction(formData: FormData) {
  await requireAdmin();
  const id = parseId(formData.get("id"));

  await serviceClient()
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

  revalidatePath("/admin/assessments");
  revalidatePath(`/admin/assessments/${id}`);
}

export async function toggleAssessmentActiveAction(formData: FormData) {
  await requireAdmin();
  const id = parseId(formData.get("id"));
  const active = parseBool(formData.get("active"));

  await serviceClient().from("assessments").update({ active }).eq("id", id);

  revalidatePath("/admin/assessments");
}

export async function deleteAssessmentAction(formData: FormData) {
  await requireAdmin();
  const id = parseId(formData.get("id"));

  await serviceClient().from("assessments").delete().eq("id", id);

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
  await sb.from("questions").update({ text, points }).eq("id", id);
  await sb.from("choices").delete().eq("question_id", id);

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

  await serviceClient().from("questions").delete().eq("id", id);

  revalidatePath(`/admin/assessments/${assessmentId}`);
}

export async function markEnrollmentPaidAction(formData: FormData) {
  await requireAdmin();
  const id = parseId(formData.get("id"));

  await serviceClient().from("enrollments").update({ payment_status: "paid" }).eq("id", id);

  revalidatePath("/admin/applicants");
}
