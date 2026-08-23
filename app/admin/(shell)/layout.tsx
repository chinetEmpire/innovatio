import Link from "next/link";

import AdminNav from "@/components/admin/AdminNav";
import ToastProvider from "@/components/admin/Toasts";
import { logoutAction } from "../actions";
import { requireAdmin } from "@/lib/admin";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const admin = await requireAdmin();

  return (
    <div className="admin-shell min-h-screen bg-[#faf7ff]">
      <ToastProvider>
        <header className="sticky top-0 z-50 border-b border-[#ece6f6] bg-white/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-8">
          <div className="flex items-center gap-6">
            <Link href="/admin" className="text-base font-bold tracking-tight">
              Innovatio <span className="text-brand">Admin</span>
            </Link>
            <AdminNav variant="desktop" />
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden text-sm text-[#8a8493] sm:block">{admin.email}</span>
            <form action={logoutAction}>
              <button
                type="submit"
                data-control
                className="rounded-full border border-[#e2d9f2] px-4 py-2 text-sm font-semibold text-ink transition-colors hover:border-brand hover:text-brand"
              >
                Sign out
              </button>
            </form>
          </div>
        </div>
        <AdminNav variant="mobile" />
      </header>
        <main className="mx-auto max-w-6xl px-5 py-10 sm:px-8">{children}</main>
      </ToastProvider>
    </div>
  );
}
