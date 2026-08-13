import type { Metadata } from "next";

import LoginForm from "@/components/admin/LoginForm";

export const metadata: Metadata = { title: "Admin Login — Innovatio Academy" };

export const dynamic = "force-dynamic";

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;
  return (
    <main className="min-h-screen bg-[#f5f1ff] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-6xl overflow-hidden rounded-[28px] border border-[#e7dcff] bg-white shadow-[0_30px_80px_rgba(68,41,133,0.12)] lg:grid-cols-[1.08fr_0.92fr]">
        <section className="relative overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.2),_transparent_38%),linear-gradient(135deg,#2d194d_0%,#5638b9_42%,#7c63ff_100%)] p-8 text-white sm:p-10 lg:p-12">
          <div className="absolute -left-20 top-16 h-56 w-56 rounded-full border border-white/15 bg-white/5" />
          <div className="absolute bottom-10 right-8 h-28 w-28 rounded-full border border-white/15 bg-white/5" />
          <div className="absolute bottom-[-30px] left-1/3 h-40 w-40 rounded-full bg-[#8d7bff]/25 blur-2xl" />

          <div className="relative z-10 flex h-full flex-col justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/8 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/80 backdrop-blur-sm">
                Innovatio Academy
              </div>
              <h1 className="mt-8 max-w-xs text-4xl font-bold leading-tight tracking-[-0.04em] sm:text-5xl">
                Powering better admissions and student outcomes.
              </h1>
              <p className="mt-4 max-w-sm text-sm text-white/80">
                Secure access to applicant reviews, assessments, and cohort management tools.
              </p>
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-sm">
                <p className="text-[10px] uppercase tracking-[0.2em] text-white/65">Applications</p>
                <p className="mt-3 text-2xl font-bold">1.2k</p>
                <p className="mt-1 text-xs text-white/70">This month</p>
              </div>
              <div className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-sm">
                <p className="text-[10px] uppercase tracking-[0.2em] text-white/65">Cohorts</p>
                <p className="mt-3 text-2xl font-bold">08</p>
                <p className="mt-1 text-xs text-white/70">Active tracks</p>
              </div>
            </div>
          </div>
        </section>

        <section className="flex items-center justify-center bg-[#f9f7ff] p-6 sm:p-8 lg:p-12">
          <div className="w-full max-w-md">
            <div className="mb-8">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#6d5fcf]">Welcome back</p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-[#1c1730]">Admin sign in</h2>
              <p className="mt-2 text-sm text-[#5f5b65]">Manage assessments, applicants, and learner operations with confidence.</p>
            </div>
            <LoginForm next={next ?? "/admin"} />
          </div>
        </section>
      </div>
    </main>
  );
}
