import Link from "next/link";

import { logoutAction } from "../actions";
import { requireAdmin } from "@/lib/admin";

const navLinks = [
  { label: "Dashboard", href: "/admin" },
  { label: "Assessments", href: "/admin/assessments" },
  { label: "Applicants", href: "/admin/applicants" },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const admin = await requireAdmin();

  return (
    <div className="min-h-screen bg-[#faf7ff]">
      <header className="sticky top-0 z-50 border-b border-[#ece6f6] bg-white/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-8">
          <div className="flex items-center gap-6">
            <Link href="/admin" className="text-base font-bold tracking-tight">
              Innovatio <span className="text-brand">Admin</span>
            </Link>
            <nav className="hidden items-center gap-6 text-sm font-medium md:flex">
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href} className="text-ink/70 transition-colors hover:text-brand">
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden text-sm text-[#8a8493] sm:block">{admin.email}</span>
            <form action={logoutAction}>
              <button
                type="submit"
                className="rounded-full border border-[#e2d9f2] px-4 py-2 text-sm font-semibold text-ink transition-colors hover:border-brand hover:text-brand"
              >
                Sign out
              </button>
            </form>
          </div>
        </div>
        <nav className="mx-auto flex max-w-6xl flex-wrap items-center gap-4 px-5 pb-3 text-sm font-medium md:hidden">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="text-ink/70 transition-colors hover:text-brand">
              {link.label}
            </Link>
          ))}
        </nav>
      </header>
      <main className="mx-auto max-w-6xl px-5 py-10 sm:px-8">{children}</main>
    </div>
  );
}
