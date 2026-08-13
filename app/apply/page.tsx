import type { Metadata } from "next";

import ApplyForm from "@/components/apply/ApplyForm";
import { serviceClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "Apply — Innovatio Academy" };

export default async function ApplyPage() {
  const sb = serviceClient();

  const [{ data: courses }, { data: assessments }] = await Promise.all([
    sb.from("courses").select("id, slug, title, description").order("title"),
    sb.from("assessments").select("course_id, title, duration_minutes, pass_mark, max_attempts").eq("active", true),
  ]);

  const active = (assessments ?? []).map((a) => a.course_id);
  const availableCourses = (courses ?? []).filter((c) => active.includes(c.id));

  return (
    <main>
      <section className="mx-auto max-w-3xl px-5 py-14 sm:px-8 sm:py-20">
        <div className="text-center">
          <span className="inline-block rounded-full border border-brand/20 bg-brand/5 px-3.5 py-1.5 text-xs font-semibold text-brand">
            Application
          </span>
          <h1 className="mt-5 text-3xl font-bold tracking-tight sm:text-4xl">Apply to Innovatio Academy</h1>
          <p className="mx-auto mt-4 max-w-xl text-base text-[#5f5b65]">
            Choose your course and complete a short assessment. Pass and you&apos;ll be eligible to register and pay for
            your spot. It takes about 10 minutes.
          </p>
        </div>

        <div className="mt-10">
          <ApplyForm courses={availableCourses} />
        </div>
      </section>
    </main>
  );
}
