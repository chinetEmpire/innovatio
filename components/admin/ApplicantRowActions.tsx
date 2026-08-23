"use client";

import Link from "next/link";
import { useState } from "react";
import { Eye, Pencil, Trash2, X } from "lucide-react";

import ActionForm from "./ActionForm";
import ConfirmSubmit from "./ConfirmSubmit";
import { deleteApplicantAction, updateApplicantAction } from "@/app/admin/actions";
import { AGE_BRACKETS } from "@/lib/types";

type ApplicantRowActionsProps = {
  applicant: {
    id: string;
    full_name: string;
    email: string;
    whatsapp: string | null;
    age_bracket: string | null;
    course_id: string | null;
  };
  courses: { id: string; title: string }[];
};

const iconButtonClass =
  "inline-flex h-8 w-8 items-center justify-center rounded-full border border-[#e2d9f2] text-[#5f5b65] transition-colors hover:border-brand hover:text-brand";

export default function ApplicantRowActions({ applicant, courses }: ApplicantRowActionsProps) {
  const [editOpen, setEditOpen] = useState(false);

  return (
    <>
      <div className="flex items-center gap-1.5">
        <Link
          href={`/admin/applicants/${applicant.id}`}
          aria-label={`View ${applicant.full_name}`}
          title="View details"
          data-control
          className={iconButtonClass}
        >
          <Eye size={15} />
        </Link>
        <button
          type="button"
          aria-label={`Edit ${applicant.full_name}`}
          title="Edit"
          data-control
          onClick={() => setEditOpen(true)}
          className={iconButtonClass}
        >
          <Pencil size={15} />
        </button>
        <ConfirmSubmit
          action={deleteApplicantAction}
          successMessage="Applicant deleted successfully."
          confirmTitle="Delete applicant"
          confirmMessage={`Delete "${applicant.full_name}"? Their attempts and enrollments will be removed too. This cannot be undone.`}
          fields={{ id: applicant.id }}
          dataControl
          buttonClassName="inline-flex h-8 w-8 items-center justify-center rounded-full border border-red-200 text-red-600 transition-colors hover:bg-red-50"
        >
          <Trash2 size={15} />
        </ConfirmSubmit>
      </div>

      {editOpen && (
        <div
          className="animate-fade-in fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-5 backdrop-blur-sm"
          onClick={() => setEditOpen(false)}
          role="presentation"
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="edit-applicant-title"
            className="w-full max-w-lg rounded-2xl border border-[#e9e2f5] bg-white p-6 shadow-[0_24px_48px_rgba(47,31,101,0.16)]"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between">
              <div>
                <h2 id="edit-applicant-title" className="text-lg font-bold text-ink">
                  Edit applicant
                </h2>
                <p className="mt-1 text-sm text-[#5f5b65]">Update this applicant&apos;s details.</p>
              </div>
              <button
                type="button"
                data-control
                onClick={() => setEditOpen(false)}
                aria-label="Close"
                className="-m-1 rounded-full p-1 text-[#8a8493] transition-colors hover:text-ink"
              >
                <X size={18} />
              </button>
            </div>

            <ActionForm
              action={updateApplicantAction}
              successMessage="Applicant updated successfully."
              onSuccess={() => setEditOpen(false)}
              className="mt-6 space-y-4"
            >
              <input type="hidden" name="id" value={applicant.id} />
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-sm font-semibold text-ink" htmlFor="edit-full-name">Full name</label>
                  <input
                    id="edit-full-name"
                    name="fullName"
                    required
                    defaultValue={applicant.full_name}
                    className="mt-2 w-full rounded-xl border border-[#e2d9f2] bg-white px-3 py-2.5 text-sm outline-none focus:border-brand"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-ink" htmlFor="edit-email">Email</label>
                  <input
                    id="edit-email"
                    name="email"
                    type="email"
                    required
                    defaultValue={applicant.email}
                    className="mt-2 w-full rounded-xl border border-[#e2d9f2] bg-white px-3 py-2.5 text-sm outline-none focus:border-brand"
                  />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-sm font-semibold text-ink" htmlFor="edit-whatsapp">WhatsApp number</label>
                  <input
                    id="edit-whatsapp"
                    name="whatsapp"
                    defaultValue={applicant.whatsapp ?? ""}
                    className="mt-2 w-full rounded-xl border border-[#e2d9f2] bg-white px-3 py-2.5 text-sm outline-none focus:border-brand"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-ink" htmlFor="edit-age">Age bracket</label>
                  <select
                    id="edit-age"
                    name="ageBracket"
                    defaultValue={applicant.age_bracket ?? ""}
                    className="mt-2 w-full rounded-xl border border-[#e2d9f2] bg-white px-3 py-2.5 text-sm outline-none focus:border-brand"
                  >
                    {AGE_BRACKETS.map((bracket) => (
                      <option key={bracket} value={bracket}>{bracket}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="text-sm font-semibold text-ink" htmlFor="edit-course">Course</label>
                <select
                  id="edit-course"
                  name="courseId"
                  required
                  defaultValue={applicant.course_id ?? ""}
                  className="mt-2 w-full rounded-xl border border-[#e2d9f2] bg-white px-3 py-2.5 text-sm outline-none focus:border-brand"
                >
                  <option value="" disabled>Select course</option>
                  {courses.map((course) => (
                    <option key={course.id} value={course.id}>{course.title}</option>
                  ))}
                </select>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  data-control
                  onClick={() => setEditOpen(false)}
                  className="rounded-full border border-[#e2d9f2] px-4 py-2 text-sm font-semibold text-ink transition-colors hover:border-brand hover:text-brand"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  data-control
                  className="rounded-full bg-brand px-5 py-2 text-sm font-semibold text-white transition-transform hover:scale-[1.02] active:scale-95"
                >
                  Save changes
                </button>
              </div>
            </ActionForm>
          </div>
        </div>
      )}
    </>
  );
}
