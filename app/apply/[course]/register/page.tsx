import type { Metadata } from "next";

import RegisterForm from "@/components/apply/RegisterForm";
import { serviceClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "Registration — Innovatio Academy" };

export default async function RegisterPage({
  params,
}: {
  params: Promise<{ course: string }>;
}) {
  const { course } = await params;
  const sb = serviceClient();

  const { data: courseRow } = await sb.from("courses").select("id, slug, title").eq("slug", course).maybeSingle();
  if (!courseRow) {
    return (
      <main className="mx-auto max-w-2xl px-5 py-20 text-center">
        <p className="text-base text-[#5f5b65]">Course not found.</p>
      </main>
    );
  }

  return (
    <main>
      <section className="mx-auto max-w-2xl px-5 py-14 sm:px-8 sm:py-20">
        <div className="text-center">
          <span className="inline-block rounded-full border border-brand/20 bg-brand/5 px-3.5 py-1.5 text-xs font-semibold text-brand">
            You passed!
          </span>
          <h1 className="mt-5 text-3xl font-bold tracking-tight sm:text-4xl">Register for {courseRow.title}</h1>
          <p className="mx-auto mt-4 max-w-lg text-base text-[#5f5b65]">
            Enter the email you used for the assessment to confirm your registration and secure your spot.
          </p>
        </div>
        <div className="mt-10">
          <RegisterForm courseSlug={courseRow.slug} courseTitle={courseRow.title} />
        </div>
      </section>
    </main>
  );
}
