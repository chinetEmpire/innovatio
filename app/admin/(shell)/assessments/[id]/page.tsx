import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import ConfirmSubmit from "@/components/admin/ConfirmSubmit";
import {
  addQuestionAction,
  deleteQuestionAction,
  updateQuestionAction,
} from "../../../actions";
import { requireAdmin } from "@/lib/admin";
import { serviceClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

type Question = {
  id: string;
  text: string;
  points: number;
  position: number;
  choices: { id: string; text: string; is_correct: boolean; position: number }[];
};

export default async function AssessmentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  await requireAdmin();
  const sb = serviceClient();

  const [{ data: assessment }, { data: questions }] = await Promise.all([
    sb.from("assessments").select("*, courses(slug, title)").eq("id", id).maybeSingle(),
    sb.from("questions").select("id, text, points, position, choices(id, text, is_correct, position)").eq("assessment_id", id).order("position", { ascending: true }),
  ]);

  if (!assessment) {
    return (
      <div className="rounded-2xl border border-dashed border-[#e9e2f5] bg-white px-5 py-12 text-center">
        <p className="text-base text-[#5f5b65]">Assessment not found.</p>
        <Link href="/admin/assessments" className="mt-3 inline-block text-sm font-semibold text-brand hover:underline">
          Back to assessments
        </Link>
      </div>
    );
  }

  const course = assessment.courses as unknown as { slug: string; title: string } | null;
  const questionsList = (questions ?? []) as Question[];

  return (
    <div className="space-y-10">
      <div>
        <Link href="/admin/assessments" className="inline-flex items-center gap-2 text-sm font-semibold text-[#8a8493] transition-colors hover:text-brand">
          <ArrowLeft size={16} /> Back to assessments
        </Link>
        <h1 className="mt-2 text-3xl font-bold tracking-tight">{assessment.title}</h1>
        <p className="mt-2 text-base text-[#5f5b65]">
          {course?.title ?? "—"} · Pass mark {assessment.pass_mark}% · {assessment.duration_minutes} min · {questionsList.length} questions
        </p>
      </div>

      <div className="rounded-2xl border border-[#e9e2f5] bg-white p-6">
        <h2 className="text-lg font-bold">Add a question</h2>
        <form action={addQuestionAction} className="mt-5 space-y-4">
          <input type="hidden" name="assessmentId" value={assessment.id} />
          <div>
            <label className="text-sm font-semibold text-ink" htmlFor="q-text">Question</label>
            <textarea id="q-text" name="text" required rows={2} placeholder="Enter the question text" className="mt-2 w-full rounded-xl border border-[#e2d9f2] bg-white px-3 py-2.5 text-sm outline-none focus:border-brand" />
          </div>
          <div className="grid gap-4 sm:grid-cols-[1fr_120px]">
            <div className="space-y-2">
              <p className="text-sm font-semibold text-ink">Choices (select the correct answer)</p>
              {[0, 1, 2, 3].map((index) => (
                <div key={index} className="flex items-center gap-2">
                  <input type="radio" name="correctChoice" value={index} defaultChecked={index === 0} className="h-4 w-4 accent-brand" />
                  <input name="choice" required={index < 2} placeholder={`Choice ${index + 1}`} className="w-full rounded-xl border border-[#e2d9f2] bg-white px-3 py-2.5 text-sm outline-none focus:border-brand" />
                </div>
              ))}
            </div>
            <div>
              <label className="text-sm font-semibold text-ink" htmlFor="q-points">Points</label>
              <input id="q-points" name="points" type="number" min={1} defaultValue={1} className="mt-2 w-full rounded-xl border border-[#e2d9f2] bg-white px-3 py-2.5 text-sm outline-none focus:border-brand" />
            </div>
          </div>
          <button type="submit" className="rounded-full bg-brand px-6 py-2.5 text-sm font-semibold text-white transition-transform hover:scale-[1.02] active:scale-95">
            Add question
          </button>
        </form>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-bold tracking-tight">Question bank ({questionsList.length})</h2>
        {questionsList.map((question, index) => {
          const choices = question.choices.slice().sort((a, b) => a.position - b.position);
          return (
            <form key={question.id} action={updateQuestionAction} className="rounded-2xl border border-[#e9e2f5] bg-white p-6">
              <input type="hidden" name="id" value={question.id} />
              <input type="hidden" name="assessmentId" value={assessment.id} />
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-sm font-semibold text-[#8a8493]">Question {index + 1}</p>
                <ConfirmSubmit
                  action={deleteQuestionAction}
                  confirmMessage="Delete this question and its choices?"
                  fields={{ id: question.id, assessmentId: assessment.id }}
                  buttonClassName="text-sm font-semibold text-red-600 transition-colors hover:text-red-700"
                >
                  Delete
                </ConfirmSubmit>
              </div>
              <div className="mt-4 grid gap-4 sm:grid-cols-[1fr_120px]">
                <input name="text" defaultValue={question.text} required className="w-full rounded-xl border border-[#e2d9f2] bg-white px-3 py-2.5 text-sm outline-none focus:border-brand" />
                <input name="points" type="number" min={1} defaultValue={question.points} className="w-full rounded-xl border border-[#e2d9f2] bg-white px-3 py-2.5 text-sm outline-none focus:border-brand" />
              </div>
              <div className="mt-4 space-y-2">
                {choices.map((choice, choiceIndex) => (
                  <div key={choice.id} className="flex items-center gap-2">
                    <input type="radio" name="correctChoice" value={choiceIndex} defaultChecked={choice.is_correct} className="h-4 w-4 accent-brand" />
                    <input name="choice" defaultValue={choice.text} required className="w-full rounded-xl border border-[#e2d9f2] bg-white px-3 py-2.5 text-sm outline-none focus:border-brand" />
                  </div>
                ))}
              </div>
              <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                <p className="text-xs text-[#8a8493]">Mark the radio button next to the correct choice.</p>
                <button type="submit" className="rounded-full bg-brand px-5 py-2 text-sm font-semibold text-white transition-transform hover:scale-[1.02] active:scale-95">
                  Save changes
                </button>
              </div>
            </form>
          );
        })}
        {questionsList.length === 0 && (
          <p className="rounded-2xl border border-dashed border-[#e9e2f5] bg-white px-5 py-10 text-center text-sm text-[#8a8493]">
            No questions yet. Add the first one above.
          </p>
        )}
      </div>
    </div>
  );
}
