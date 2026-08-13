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
    <main className="flex min-h-screen items-center justify-center bg-[#faf7ff] px-5">
      <div className="w-full max-w-sm">
        <div className="rounded-2xl border border-[#e9e2f5] bg-white p-8 shadow-[0_16px_40px_rgba(47,31,101,0.1)]">
          <h1 className="text-2xl font-bold tracking-tight">Admin sign in</h1>
          <p className="mt-2 text-sm text-[#5f5b65]">Sign in to manage assessments and applicants.</p>
          <div className="mt-6">
            <LoginForm next={next ?? "/admin"} />
          </div>
        </div>
      </div>
    </main>
  );
}
