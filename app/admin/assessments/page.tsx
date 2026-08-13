import Link from "next/link";

import ConfirmSubmit from "@/components/admin/ConfirmSubmit";
import {
  createAssessmentAction,
  deleteAssessmentAction,
  toggleAssessmentActiveAction,
  updateAssessmentAction,
} from "../actions";
import { requireAdmin } from "@/lib/admin";
import { serviceClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

export default async function AssessmentsPage() {
  await requireAdmin();
  const sb = serviceClient();

  const [{ data: assessments }, { data: courses }] = await Promise.all([
    sb.from("assessments").select("*, courses(slug, title)").order("created_at", { ascending: false }),
    sb.from("courses").select("id, title").order("title"),
  ]);

  return (
    <div className="space-y-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Assessments</h1>
          <p className="mt-2 text-base text-[#5f5b65]">Create and configure assessments for each course.</p>
        </div>
      </div>

      <div className="rounded-2xl border border-[#e9e2f5] bg-white p-6">
        <h2 className="text-lg font-bold">Create a new assessment</h2>
        <form action={createAssessmentAction} className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <label className="text-sm font-semibold text-ink" htmlFor="new-course">Course</label>
            <select id="new-course" name="courseId" required className="mt-2 w-full rounded-xl border border-[#e2d9f2] bg-white px-3 py-2.5 text-sm outline-none focus:border-brand">
              <option value="">Select course</option>
              {(courses ?? []).map((course) => (
                <option key={course.id} value={course.id}>{course.title}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm font-semibold text-ink" htmlFor="new-title">Title</label>
            <input id="new-title" name="title" required placeholder="Pre-course assessment" className="mt-2 w-full rounded-xl border border-[#e2d9f2] bg-white px-3 py-2.5 text-sm outline-none focus:border-brand" />
          </div>
          <div>
            <label className="text-sm font-semibold text-ink" htmlFor="new-pass">Pass mark (%)</label>
            <input id="new-pass" name="passMark" type="number" min={1} max={100} defaultValue={50} className="mt-2 w-full rounded-xl border border-[#e2d9f2] bg-white px-3 py-2.5 text-sm outline-none focus:border-brand" />
          </div>
          <div>
            <label className="text-sm font-semibold text-ink" htmlFor="new-duration">Duration (min)</label>
            <input id="new-duration" name="durationMinutes" type="number" min={1} defaultValue={30} className="mt-2 w-full rounded-xl border border-[#e2d9f2] bg-white px-3 py-2.5 text-sm outline-none focus:border-brand" />
          </div>
          <div>
            <label className="text-sm font-semibold text-ink" htmlFor="new-max">Max attempts</label>
            <input id="new-max" name="maxAttempts" type="number" min={1} placeholder="Unlimited" className="mt-2 w-full rounded-xl border border-[#e2d9f2] bg-white px-3 py-2.5 text-sm outline-none focus:border-brand" />
          </div>
          <div>
            <label className="text-sm font-semibold text-ink" htmlFor="new-cooldown">Retake cooldown (hrs)</label>
            <input id="new-cooldown" name="retakeCooldownHours" type="number" min={0} defaultValue={24} className="mt-2 w-full rounded-xl border border-[#e2d9f2] bg-white px-3 py-2.5 text-sm outline-none focus:border-brand" />
          </div>
          <div className="flex items-end pb-1">
            <label className="flex items-center gap-2 text-sm font-medium text-ink">
              <input type="checkbox" name="shuffleQuestions" defaultChecked className="h-4 w-4 accent-brand" />
              Shuffle questions
            </label>
          </div>
          <div className="flex items-end">
            <button type="submit" className="w-full rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-white transition-transform hover:scale-[1.02] active:scale-95">
              Create
            </button>
          </div>
        </form>
      </div>

      <div className="space-y-4">
        {(assessments ?? []).map((assessment) => {
          const course = assessment.courses as unknown as { slug: string; title: string } | null;
          return (
            <div key={assessment.id} className="rounded-2xl border border-[#e9e2f5] bg-white p-6">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-lg font-bold">{assessment.title}</h2>
                    <span className="rounded-full bg-brand/10 px-2.5 py-0.5 text-xs font-bold text-brand">{course?.title ?? "—"}</span>
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${assessment.active ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                      {assessment.active ? "Active" : "Inactive"}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-[#5f5b65]">
                    Pass mark {assessment.pass_mark}% · {assessment.duration_minutes} min · Max attempts: {assessment.max_attempts ?? "Unlimited"} · Cooldown: {assessment.retake_cooldown_hours}h · {assessment.shuffle_questions ? "Shuffled" : "Fixed order"}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <form action={toggleAssessmentActiveAction}>
                    <input type="hidden" name="id" value={assessment.id} />
                    <input type="hidden" name="active" value={assessment.active ? "false" : "true"} />
                    <button type="submit" className="rounded-full border border-[#e2d9f2] px-4 py-2 text-sm font-semibold text-ink transition-colors hover:border-brand hover:text-brand">
                      {assessment.active ? "Deactivate" : "Activate"}
                    </button>
                  </form>
                  <ConfirmSubmit
                    action={deleteAssessmentAction}
                    confirmMessage="Delete this assessment and all its questions and attempts?"
                    fields={{ id: assessment.id }}
                    buttonClassName="rounded-full border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 transition-colors hover:bg-red-50"
                  >
                    Delete
                  </ConfirmSubmit>
                </div>
              </div>

              <details className="mt-5 rounded-xl border border-[#f0ecf6] bg-[#faf7ff]">
                <summary className="cursor-pointer px-5 py-4 text-sm font-semibold text-brand">Edit settings</summary>
                <form action={updateAssessmentAction} className="grid gap-4 border-t border-[#f0ecf6] p-5 sm:grid-cols-2 lg:grid-cols-4">
                  <input type="hidden" name="id" value={assessment.id} />
                  <div>
                    <label className="text-sm font-semibold text-ink">Title</label>
                    <input name="title" defaultValue={assessment.title} className="mt-2 w-full rounded-xl border border-[#e2d9f2] bg-white px-3 py-2.5 text-sm outline-none focus:border-brand" />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-ink">Description</label>
                    <input name="description" defaultValue={assessment.description} className="mt-2 w-full rounded-xl border border-[#e2d9f2] bg-white px-3 py-2.5 text-sm outline-none focus:border-brand" />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-ink">Pass mark (%)</label>
                    <input name="passMark" type="number" min={1} max={100} defaultValue={assessment.pass_mark} className="mt-2 w-full rounded-xl border border-[#e2d9f2] bg-white px-3 py-2.5 text-sm outline-none focus:border-brand" />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-ink">Duration (min)</label>
                    <input name="durationMinutes" type="number" min={1} defaultValue={assessment.duration_minutes} className="mt-2 w-full rounded-xl border border-[#e2d9f2] bg-white px-3 py-2.5 text-sm outline-none focus:border-brand" />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-ink">Max attempts (blank = unlimited)</label>
                    <input name="maxAttempts" type="number" min={1} defaultValue={assessment.max_attempts ?? ""} placeholder="Unlimited" className="mt-2 w-full rounded-xl border border-[#e2d9f2] bg-white px-3 py-2.5 text-sm outline-none focus:border-brand" />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-ink">Retake cooldown (hrs)</label>
                    <input name="retakeCooldownHours" type="number" min={0} defaultValue={assessment.retake_cooldown_hours} className="mt-2 w-full rounded-xl border border-[#e2d9f2] bg-white px-3 py-2.5 text-sm outline-none focus:border-brand" />
                  </div>
                  <div className="flex items-end pb-1">
                    <label className="flex items-center gap-2 text-sm font-medium text-ink">
                      <input type="checkbox" name="shuffleQuestions" defaultChecked={assessment.shuffle_questions} className="h-4 w-4 accent-brand" />
                      Shuffle questions
                    </label>
                  </div>
                  <div className="flex items-end">
                    <button type="submit" className="w-full rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-white transition-transform hover:scale-[1.02] active:scale-95">
                      Save settings
                    </button>
                  </div>
                </form>
              </details>

              <Link href={`/admin/assessments/${assessment.id}`} className="mt-4 inline-flex text-sm font-semibold text-brand hover:underline">
                Manage questions →
              </Link>
            </div>
          );
        })}
        {(assessments ?? []).length === 0 && (
          <p className="rounded-2xl border border-dashed border-[#e9e2f5] bg-white px-5 py-10 text-center text-sm text-[#8a8493]">
            No assessments yet. Create one above.
          </p>
        )}
      </div>
    </div>
  );
}
