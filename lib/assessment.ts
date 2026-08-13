import type { Assessment, Attempt, Choice, Question } from "@/lib/types";

export type QuestionWithChoices = Question & { choices: Choice[] };

export type ScoreResult = {
  score: number;
  total: number;
  percent: number;
  passed: boolean;
  results: { questionId: string; selected: string | null; correct: boolean; points: number }[];
};

export function computeScore(
  answers: { questionId: string; choiceId: string }[],
  questions: QuestionWithChoices[],
  passMark: number
): ScoreResult {
  let score = 0;
  let total = 0;
  const results: ScoreResult["results"] = [];

  for (const question of questions) {
    total += question.points;
    const selected = answers.find((a) => a.questionId === question.id)?.choiceId ?? null;
    const selectedChoice = question.choices.find((c) => c.id === selected);
    const correct = selectedChoice?.is_correct === true;
    if (correct) score += question.points;
    results.push({ questionId: question.id, selected, correct, points: question.points });
  }

  const percent = total > 0 ? Math.round((score / total) * 100) : 0;
  return { score, total, percent, passed: percent >= passMark, results };
}

export type EligibilityResult =
  | { action: "proceed"; redirect: string }
  | { action: "blocked"; message: string }
  | { action: "cooldown"; message: string; retryAfterMs: number }
  | { action: "resume"; attemptId: string; redirect: string }
  | { action: "start" };

export function evaluateEligibility(opts: {
  attempts: Attempt[];
  assessment: Pick<Assessment, "max_attempts" | "retake_cooldown_hours">;
  courseSlug: string;
  now?: number;
}): EligibilityResult {
  const { attempts, assessment, courseSlug } = opts;
  const now = opts.now ?? Date.now();

  const submitted = attempts.filter((a) => a.status === "submitted");

  const passed = submitted.find((a) => a.passed === true);
  if (passed) {
    return { action: "proceed", redirect: `/apply/${courseSlug}/register` };
  }

  const inProgress = attempts.find((a) => a.status === "in_progress");
  if (inProgress) {
    return { action: "resume", attemptId: inProgress.id, redirect: `/apply/${courseSlug}/assessment?attempt=${inProgress.id}` };
  }

  if (assessment.max_attempts !== null && submitted.length >= assessment.max_attempts) {
    return {
      action: "blocked",
      message: `You have used all ${assessment.max_attempts} allowed attempt${assessment.max_attempts === 1 ? "" : "s"}. Please contact the academy.`,
    };
  }

  if (assessment.retake_cooldown_hours > 0) {
    const lastSubmitted = submitted.reduce(
      (latest, a) => (a.submitted_at && (!latest || a.submitted_at > latest) ? a.submitted_at : latest),
      null as string | null
    );
    if (lastSubmitted) {
      const elapsed = now - new Date(lastSubmitted).getTime();
      const cooldownMs = assessment.retake_cooldown_hours * 60 * 60 * 1000;
      if (elapsed < cooldownMs) {
        const retryAfterMs = cooldownMs - elapsed;
        const hours = Math.ceil(retryAfterMs / (60 * 60 * 1000));
        return {
          action: "cooldown",
          message: `You can retake this assessment in about ${hours} hour${hours === 1 ? "" : "s"}.`,
          retryAfterMs,
        };
      }
    }
  }

  return { action: "start" };
}

export function shuffle<T>(items: T[]): T[] {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export function toSafeQuestions(questions: QuestionWithChoices[]): {
  id: string;
  text: string;
  points: number;
  position: number;
  choices: { id: string; text: string; position: number }[];
}[] {
  return questions.map((q) => ({
    id: q.id,
    text: q.text,
    points: q.points,
    position: q.position,
    choices: q.choices
      .sort((a, b) => a.position - b.position)
      .map((c) => ({ id: c.id, text: c.text, position: c.position })),
  }));
}
