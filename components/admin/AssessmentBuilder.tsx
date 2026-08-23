"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";

import ActionForm from "@/components/admin/ActionForm";
import { createAssessmentWithQuestionsAction } from "@/app/admin/actions";

type BuilderQuestion = {
  text: string;
  points: number;
  choices: { text: string }[];
  correctIndex: number;
};

const MAX_CHOICES = 6;

function emptyQuestion(): BuilderQuestion {
  return { text: "", points: 1, choices: [{ text: "" }, { text: "" }], correctIndex: 0 };
}

export default function AssessmentBuilder({ courses }: { courses: { id: string; title: string }[] }) {
  const [questions, setQuestions] = useState<BuilderQuestion[]>([emptyQuestion()]);

  const updateChoiceText = (qi: number, ci: number, text: string) =>
    setQuestions((prev) =>
      prev.map((q, i) => (i === qi ? { ...q, choices: q.choices.map((c, j) => (j === ci ? { text } : c)) } : q))
    );

  const addChoice = (qi: number) =>
    setQuestions((prev) =>
      prev.map((q, i) =>
        i === qi && q.choices.length < MAX_CHOICES ? { ...q, choices: [...q.choices, { text: "" }] } : q
      )
    );

  const removeChoice = (qi: number, ci: number) =>
    setQuestions((prev) =>
      prev.map((q, i) => {
        if (i !== qi || q.choices.length <= 2) return q;
        const choices = q.choices.filter((_, j) => j !== ci);
        let correctIndex = q.correctIndex;
        if (correctIndex === ci) correctIndex = 0;
        else if (correctIndex > ci) correctIndex -= 1;
        correctIndex = Math.min(Math.max(correctIndex, 0), choices.length - 1);
        return { ...q, choices, correctIndex };
      })
    );

  const removeQuestion = (qi: number) => setQuestions((prev) => prev.filter((_, i) => i !== qi));

  const payload = JSON.stringify(
    questions.map((q) => ({
      text: q.text,
      points: q.points,
      choices: q.choices.map((c, i) => ({ text: c.text, isCorrect: i === q.correctIndex })),
    }))
  );

  const inputClass =
    "w-full rounded-xl border border-[#e2d9f2] bg-white px-3 py-2.5 text-sm outline-none focus:border-brand";

  return (
    <ActionForm
      action={createAssessmentWithQuestionsAction}
      successMessage="Assessment created successfully. It is inactive until you activate it."
      resetOnSuccess
      onSuccess={() => setQuestions([emptyQuestion()])}
      className="mt-5 space-y-8"
    >
      <input type="hidden" name="questions" value={payload} />

      <div>
        <h3 className="text-sm font-bold uppercase tracking-wide text-[#8a8493]">Assessment settings</h3>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <label className="text-sm font-semibold text-ink" htmlFor="new-course">Course</label>
            <select id="new-course" name="courseId" required className={`mt-2 ${inputClass}`}>
              <option value="">Select course</option>
              {courses.map((course) => (
                <option key={course.id} value={course.id}>{course.title}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm font-semibold text-ink" htmlFor="new-title">Title</label>
            <input id="new-title" name="title" required placeholder="Pre-course assessment" className={`mt-2 ${inputClass}`} />
          </div>
          <div>
            <label className="text-sm font-semibold text-ink" htmlFor="new-pass">Pass mark (%)</label>
            <input id="new-pass" name="passMark" type="number" min={1} max={100} defaultValue={50} className={`mt-2 ${inputClass}`} />
          </div>
          <div>
            <label className="text-sm font-semibold text-ink" htmlFor="new-duration">Duration (min)</label>
            <input id="new-duration" name="durationMinutes" type="number" min={1} defaultValue={30} className={`mt-2 ${inputClass}`} />
          </div>
          <div>
            <label className="text-sm font-semibold text-ink" htmlFor="new-max">Max attempts</label>
            <input id="new-max" name="maxAttempts" type="number" min={1} placeholder="Unlimited" className={`mt-2 ${inputClass}`} />
          </div>
          <div>
            <label className="text-sm font-semibold text-ink" htmlFor="new-cooldown">Retake cooldown (hrs)</label>
            <input id="new-cooldown" name="retakeCooldownHours" type="number" min={0} defaultValue={24} className={`mt-2 ${inputClass}`} />
          </div>
          <div className="flex items-end pb-1">
            <label className="flex items-center gap-2 text-sm font-medium text-ink">
              <input type="checkbox" name="shuffleQuestions" defaultChecked className="h-4 w-4 accent-brand" />
              Shuffle questions
            </label>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-bold uppercase tracking-wide text-[#8a8493]">
          Questions ({questions.length})
        </h3>

        <div className="mt-4 space-y-4">
          {questions.map((question, qi) => (
            <div key={qi} className="rounded-2xl border border-[#e9e2f5] bg-white p-5">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-bold text-ink">Question {qi + 1}</p>
                <button
                  type="button"
                  data-control
                  onClick={() => removeQuestion(qi)}
                  className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold text-red-600 transition-colors hover:bg-red-50"
                >
                  <Trash2 size={13} /> Remove
                </button>
              </div>

              <textarea
                value={question.text}
                onChange={(event) =>
                  setQuestions((prev) =>
                    prev.map((q, i) => (i === qi ? { ...q, text: event.target.value } : q))
                  )
                }
                required
                rows={2}
                placeholder={`Enter question ${qi + 1}`}
                className={`mt-4 ${inputClass}`}
              />

              <div className="mt-4 grid gap-4 sm:grid-cols-[1fr_120px]">
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-ink">Choices (select the correct answer)</p>
                  {question.choices.map((choice, ci) => (
                    <div key={ci} className="flex items-center gap-2">
                      <input
                        type="radio"
                        name={`correct-${qi}`}
                        checked={question.correctIndex === ci}
                        onChange={() =>
                          setQuestions((prev) =>
                            prev.map((q, i) => (i === qi ? { ...q, correctIndex: ci } : q))
                          )
                        }
                        className="h-4 w-4 shrink-0 accent-brand"
                      />
                      <input
                        value={choice.text}
                        onChange={(event) => updateChoiceText(qi, ci, event.target.value)}
                        required
                        placeholder={`Choice ${ci + 1}`}
                        className={inputClass}
                      />
                      {question.choices.length > 2 && (
                        <button
                          type="button"
                          data-control
                          aria-label={`Remove choice ${ci + 1}`}
                          onClick={() => removeChoice(qi, ci)}
                          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-red-500 transition-colors hover:bg-red-50"
                        >
                          <Trash2 size={13} />
                        </button>
                      )}
                    </div>
                  ))}
                  {question.choices.length < MAX_CHOICES && (
                    <button
                      type="button"
                      data-control
                      onClick={() => addChoice(qi)}
                      className="inline-flex items-center gap-1.5 rounded-full border border-dashed border-[#cbbee6] px-3 py-1.5 text-xs font-semibold text-[#8a8493] transition-colors hover:border-brand hover:text-brand"
                    >
                      <Plus size={12} /> Add choice
                    </button>
                  )}
                </div>
                <div>
                  <label className="text-sm font-semibold text-ink" htmlFor={`points-${qi}`}>Points</label>
                  <input
                    id={`points-${qi}`}
                    value={question.points}
                    onChange={(event) =>
                      setQuestions((prev) =>
                        prev.map((q, i) => (i === qi ? { ...q, points: Number(event.target.value) || 0 } : q))
                      )
                    }
                    type="number"
                    min={1}
                    max={1000}
                    className={`mt-2 ${inputClass}`}
                  />
                </div>
              </div>
            </div>
          ))}
          {questions.length === 0 && (
            <p className="rounded-2xl border border-dashed border-[#e9e2f5] bg-white px-5 py-10 text-center text-sm text-[#8a8493]">
              No questions yet. Click “Add question” to build the assessment.
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between gap-3">
        <button
          type="button"
          data-control
          onClick={() => setQuestions((prev) => [...prev, emptyQuestion()])}
          className="inline-flex items-center gap-1.5 rounded-full border border-[#e2d9f2] px-4 py-2 text-sm font-semibold text-brand transition-colors hover:border-brand"
        >
          <Plus size={14} /> Add question
        </button>
        <button
          type="submit"
          data-control="true"
          disabled={questions.length === 0}
          className="rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-white transition-transform hover:scale-[1.02] active:scale-95 disabled:pointer-events-none disabled:opacity-40"
        >
          Create assessment
        </button>
      </div>
      <p className="text-xs text-[#8a8493]">
        The assessment is created only after you submit — and starts inactive until you activate it.
      </p>
    </ActionForm>
  );
}