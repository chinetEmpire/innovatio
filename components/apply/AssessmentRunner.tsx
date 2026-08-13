"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Clock, Loader2 } from "lucide-react";

type SafeQuestion = {
  id: string;
  text: string;
  points: number;
  position: number;
  choices: { id: string; text: string; position: number }[];
};

type Props = {
  attemptId: string;
  courseSlug: string;
  assessmentTitle: string;
  questions: SafeQuestion[];
  durationMinutes: number;
  startedAt: string;
};

export default function AssessmentRunner({
  attemptId,
  courseSlug,
  assessmentTitle,
  questions,
  durationMinutes,
  startedAt,
}: Props) {
  const router = useRouter();
  const deadline = useMemo(() => new Date(startedAt).getTime() + durationMinutes * 60 * 1000, [startedAt, durationMinutes]);
  const [remaining, setRemaining] = useState(() => Math.max(0, Math.floor((deadline - Date.now()) / 1000)));
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = useCallback(
    async (finalAnswers: Record<string, string>) => {
      if (submitting) return;
      setSubmitting(true);
      setError(null);
      try {
        const payload = Object.entries(finalAnswers).map(([questionId, choiceId]) => ({ questionId, choiceId }));
        const res = await fetch("/api/apply/submit", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ attemptId, answers: payload }),
        });
        const data = await res.json();
        if (!res.ok || data.error) {
          setError(data.error ?? "Could not submit your assessment. Please try again.");
          setSubmitting(false);
          return;
        }
        router.push(data.redirect);
      } catch {
        setError("Could not submit your assessment. Please check your connection and try again.");
        setSubmitting(false);
      }
    },
    [attemptId, router, submitting]
  );

  useEffect(() => {
    if (remaining <= 0) {
      submit(answers);
      return;
    }
    const timer = setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          submit(answers);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [remaining, answers, submit]);

  const totalPoints = questions.reduce((sum, q) => sum + q.points, 0);
  const answeredCount = Object.keys(answers).length;
  const question = questions[current];

  function selectChoice(choiceId: string) {
    setAnswers((prev) => ({ ...prev, [question.id]: choiceId }));
  }

  if (questions.length === 0) {
    return (
      <main className="mx-auto max-w-3xl px-5 py-20 text-center">
        <p className="text-base text-[#5f5b65]">No questions are available for this assessment yet.</p>
      </main>
    );
  }

  const mm = String(Math.floor(remaining / 60)).padStart(2, "0");
  const ss = String(remaining % 60).padStart(2, "0");

  return (
    <main className="mx-auto max-w-3xl px-5 py-10 sm:px-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight sm:text-2xl">{assessmentTitle}</h1>
          <p className="mt-1 text-sm text-[#5f5b65]">
            Question {current + 1} of {questions.length} · {answeredCount} answered
          </p>
        </div>
        <div
          className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold tabular-nums ${
            remaining <= 60 ? "bg-red-50 text-red-600" : "bg-brand/10 text-brand"
          }`}
        >
          <Clock size={16} />
          {mm}:{ss}
        </div>
      </div>

      <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-[#f0ecf6]">
        <div
          className="h-full rounded-full bg-brand transition-all duration-300"
          style={{ width: `${((current + 1) / questions.length) * 100}%` }}
        />
      </div>

      <div className="mt-8 rounded-2xl border border-[#e9e2f5] bg-white p-6 shadow-[0_16px_32px_rgba(47,31,101,0.08)] sm:p-8">
        <p className="text-lg font-semibold leading-relaxed text-ink">{question.text}</p>
        <div className="mt-6 space-y-3">
          {question.choices.map((choice) => {
            const selected = answers[question.id] === choice.id;
            return (
              <button
                key={choice.id}
                type="button"
                onClick={() => selectChoice(choice.id)}
                className={`flex w-full items-start gap-3 rounded-xl border px-4 py-3.5 text-left text-sm leading-relaxed transition-all sm:text-base ${
                  selected
                    ? "border-brand bg-brand/5 text-ink ring-1 ring-brand"
                    : "border-[#e9e2f5] bg-white text-[#4d4752] hover:border-brand/40"
                }`}
              >
                <span
                  className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${
                    selected ? "border-brand bg-brand" : "border-[#cbbee6]"
                  }`}
                >
                  {selected && <span className="h-2 w-2 rounded-full bg-white" />}
                </span>
                {choice.text}
              </button>
            );
          })}
        </div>

        {error && (
          <p className="mt-5 rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">{error}</p>
        )}

        <div className="mt-8 flex items-center justify-between">
          <button
            type="button"
            onClick={() => setCurrent((c) => Math.max(0, c - 1))}
            disabled={current === 0}
            className="inline-flex items-center gap-1.5 rounded-full border border-[#e2d9f2] px-5 py-2.5 text-sm font-semibold text-ink transition-colors hover:border-brand hover:text-brand disabled:opacity-40 disabled:hover:border-[#e2d9f2] disabled:hover:text-ink"
          >
            <ChevronLeft size={16} /> Previous
          </button>

          {current < questions.length - 1 ? (
            <button
              type="button"
              onClick={() => setCurrent((c) => Math.min(questions.length - 1, c + 1))}
              className="inline-flex items-center gap-1.5 rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-white transition-transform hover:scale-[1.03] active:scale-95"
            >
              Next <ChevronRight size={16} />
            </button>
          ) : (
            <button
              type="button"
              onClick={() => submit(answers)}
              disabled={submitting}
              className="inline-flex items-center gap-2 rounded-full bg-brand px-6 py-2.5 text-sm font-semibold text-white shadow-[0_10px_22px_rgba(84,41,208,0.3)] transition-transform hover:scale-[1.03] active:scale-95 disabled:opacity-60"
            >
              {submitting ? <Loader2 size={16} className="animate-spin" /> : null}
              {submitting ? "Submitting…" : `Submit (${totalPoints} pts)`}
            </button>
          )}
        </div>
      </div>

      <p className="mt-4 text-center text-xs text-[#8a8493]">
        Your answers are saved automatically as you select them. The assessment submits automatically when the timer
        ends.
      </p>
    </main>
  );
}
