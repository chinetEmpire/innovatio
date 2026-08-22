"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { Loader2 } from "lucide-react";

import { AGE_BRACKETS } from "@/lib/types";

type CourseOption = { id: string; slug: string; title: string; description: string };

type StartResponse =
  | { error: string }
  | {
      action: "start" | "resume" | "proceed" | "blocked" | "cooldown";
      redirect?: string;
      message?: string;
      retryAfterMs?: number;
    };

export default function ApplyForm({ courses }: { courses: CourseOption[] }) {
  const router = useRouter();
  const [courseSlug, setCourseSlug] = useState(courses[0]?.slug ?? "");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [ageBracket, setAgeBracket] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [status, setStatus] = useState<{ type: "error" | "info" | "success"; text: string } | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus(null);
    setSubmitting(true);

    try {
      const res = await fetch("/api/apply/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, whatsapp, ageBracket, courseSlug, agreed }),
      });
      const data: StartResponse = await res.json();

      if (!res.ok || "error" in data) {
        setStatus({ type: "error", text: "error" in data ? data.error : "Something went wrong. Please try again." });
        return;
      }

      if (data.action === "blocked" || data.action === "cooldown") {
        setStatus({ type: "info", text: data.message ?? "You are not eligible to retake this assessment right now." });
        return;
      }

      if (data.action === "proceed") {
        setStatus({ type: "success", text: "You already passed this assessment. Redirecting to registration…" });
        router.push(data.redirect ?? "/apply");
        return;
      }

      router.push(data.redirect ?? "/apply");
    } catch {
      setStatus({ type: "error", text: "Something went wrong. Please try again." });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <p className="text-sm font-semibold text-ink">Choose your course</p>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          {courses.map((course) => {
            const selected = course.slug === courseSlug;
            return (
              <button
                data-control
                key={course.id}
                type="button"
                onClick={() => setCourseSlug(course.slug)}
                className={`rounded-2xl border p-5 text-left transition-all ${
                  selected
                    ? "border-brand bg-brand/5 shadow-[0_12px_28px_rgba(84,41,208,0.14)]"
                    : "border-[#e9e2f5] bg-white hover:border-brand/40"
                }`}
              >
                <span
                  className={`flex h-5 w-5 items-center justify-center rounded-full border-2 ${
                    selected ? "border-brand bg-brand" : "border-[#cbbee6]"
                  }`}
                >
                  {selected && <span className="h-2 w-2 rounded-full bg-white" />}
                </span>
                <span className="mt-3 block text-base font-semibold text-ink">{course.title}</span>
                <span className="mt-1 block text-sm text-[#5f5b65]">{course.description}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <label htmlFor="name" className="text-sm font-semibold text-ink">
          Full name
        </label>
        <input
          id="name"
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Ada Obi"
          className="mt-2 w-full rounded-xl border border-[#e2d9f2] bg-white px-4 py-3 text-base text-ink outline-none transition-colors placeholder:text-[#b5afbd] focus:border-brand"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="email" className="text-sm font-semibold text-ink">
            Email address
          </label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="mt-2 w-full rounded-xl border border-[#e2d9f2] bg-white px-4 py-3 text-base text-ink outline-none transition-colors placeholder:text-[#b5afbd] focus:border-brand"
          />
        </div>
        <div>
          <label htmlFor="whatsapp" className="text-sm font-semibold text-ink">
            WhatsApp number
          </label>
          <input
            id="whatsapp"
            type="tel"
            value={whatsapp}
            onChange={(e) => setWhatsapp(e.target.value)}
            placeholder="+234 800 000 0000"
            className="mt-2 w-full rounded-xl border border-[#e2d9f2] bg-white px-4 py-3 text-base text-ink outline-none transition-colors placeholder:text-[#b5afbd] focus:border-brand"
          />
        </div>
      </div>

      <div>
        <label htmlFor="ageBracket" className="text-sm font-semibold text-ink">
          Age bracket
        </label>
        <select
          id="ageBracket"
          required
          value={ageBracket}
          onChange={(e) => setAgeBracket(e.target.value)}
          className="mt-2 w-full rounded-xl border border-[#e2d9f2] bg-white px-4 py-3 text-base text-ink outline-none transition-colors focus:border-brand"
        >
          <option value="">Select your age bracket</option>
          {AGE_BRACKETS.map((bracket) => (
            <option key={bracket} value={bracket}>
              {bracket}
            </option>
          ))}
        </select>
      </div>

      <label className="flex cursor-pointer items-start gap-3 text-sm text-[#5f5b65]">
        <input
          type="checkbox"
          checked={agreed}
          onChange={(e) => setAgreed(e.target.checked)}
          className="mt-1 h-4 w-4 accent-brand"
        />
        <span>
          I agree to take the Innovatio Academy pre-course assessment and understand my results will be used to
          determine eligibility for the program.
        </span>
      </label>

      {status && (
        <p
          className={`rounded-xl px-4 py-3 text-sm font-medium ${
            status.type === "error"
              ? "bg-red-50 text-red-700"
              : status.type === "info"
                ? "bg-amber-50 text-amber-800"
                : "bg-green-50 text-green-700"
          }`}
        >
          {status.text}
        </p>
      )}

      <button
        type="submit"
        disabled={submitting || !courseSlug}
        className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-brand px-6 py-3.5 text-base font-semibold text-white shadow-[0_10px_22px_rgba(84,41,208,0.3)] transition-transform hover:scale-[1.02] active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {submitting ? <Loader2 size={18} className="animate-spin" /> : null}
        {submitting ? "Starting…" : "Start assessment"}
      </button>
    </form>
  );
}
