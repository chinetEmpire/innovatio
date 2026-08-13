import Link from "next/link";
import { CheckCircle2, Clock, XCircle, Wallet } from "lucide-react";

import { formatNairaKobo } from "@/data/paymentOptions";
import { formatDate, formatDateTime } from "@/lib/format";
import { requireAdmin } from "@/lib/admin";
import { serviceClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

const STATUSES = ["all", "paid", "pending", "failed"] as const;
type StatusFilter = (typeof STATUSES)[number];

function parseStatus(raw: string | undefined): StatusFilter {
  return STATUSES.includes(raw as StatusFilter) ? (raw as StatusFilter) : "all";
}

const statusMeta: Record<Exclude<StatusFilter, "all">, { label: string; tone: string; icon: typeof Clock }> = {
  paid: { label: "Paid", tone: "bg-green-50 text-green-700", icon: CheckCircle2 },
  pending: { label: "Pending", tone: "bg-amber-50 text-amber-700", icon: Clock },
  failed: { label: "Failed", tone: "bg-red-50 text-red-600", icon: XCircle },
};

function planLabel(planKey: string | null): string {
  if (planKey === "upfront") return "Upfront";
  if (planKey === "instalments") return "2 instalments";
  return "—";
}

export default async function PaymentsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status: rawStatus } = await searchParams;
  const status = parseStatus(rawStatus);
  await requireAdmin();
  const sb = serviceClient();

  const enrollmentsSelect =
    "id, payment_status, plan_key, amount_kobo, payment_reference, paid_at, created_at, applicants(id, full_name, email), courses(title)";

  const rowsQuery = sb.from("enrollments").select(enrollmentsSelect);
  if (status !== "all") rowsQuery.eq("payment_status", status);
  rowsQuery.order("created_at", { ascending: false });

  const [{ data: allStatuses }, { data: enrollments }] = await Promise.all([
    sb.from("enrollments").select("payment_status"),
    rowsQuery,
  ]);

  const counts = {
    all: allStatuses?.length ?? 0,
    paid: (allStatuses ?? []).filter((e) => e.payment_status === "paid").length,
    pending: (allStatuses ?? []).filter((e) => e.payment_status === "pending").length,
    failed: (allStatuses ?? []).filter((e) => e.payment_status === "failed").length,
  };

  const cards: { key: StatusFilter; label: string; value: number; icon: typeof Wallet }[] = [
    { key: "all", label: "All payments", value: counts.all, icon: Wallet },
    { key: "paid", label: "Paid", value: counts.paid, icon: CheckCircle2 },
    { key: "pending", label: "Pending", value: counts.pending, icon: Clock },
    { key: "failed", label: "Failed", value: counts.failed, icon: XCircle },
  ];

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Payments</h1>
        <p className="mt-2 text-base text-[#5f5b65]">Monitor tuition payments for every student.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map(({ key, label, value, icon: Icon }) => {
          const active = status === key;
          return (
            <Link
              key={key}
              href={`/admin/payments${key === "all" ? "" : `?status=${key}`}`}
              className={`rounded-2xl border p-5 transition-colors ${
                active ? "border-brand bg-brand/[0.04]" : "border-[#e9e2f5] bg-white hover:border-brand/40"
              }`}
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand/10 text-brand">
                <Icon size={18} />
              </span>
              <p className="mt-4 text-2xl font-bold tracking-tight">{value}</p>
              <p className={`mt-1 text-sm ${active ? "font-semibold text-brand" : "text-[#5f5b65]"}`}>{label}</p>
            </Link>
          );
        })}
      </div>

      <div className="overflow-x-auto rounded-2xl border border-[#e9e2f5] bg-white">
        <table className="w-full min-w-[860px] text-left text-sm">
          <thead className="border-b border-[#f0ecf6] bg-[#faf7ff] text-xs uppercase tracking-wide text-[#8a8493]">
            <tr>
              <th className="px-5 py-3 font-semibold">Student</th>
              <th className="px-5 py-3 font-semibold">Course</th>
              <th className="px-5 py-3 font-semibold">Plan</th>
              <th className="px-5 py-3 font-semibold">Amount</th>
              <th className="px-5 py-3 font-semibold">Status</th>
              <th className="px-5 py-3 font-semibold">Reference</th>
              <th className="px-5 py-3 font-semibold">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#f0ecf6]">
            {(enrollments ?? []).map((enrollment) => {
              const applicant = enrollment.applicants as unknown as { id: string; full_name: string; email: string } | null;
              const course = enrollment.courses as unknown as { title: string } | null;
              const meta = statusMeta[enrollment.payment_status as Exclude<StatusFilter, "all">];
              const StatusIcon = meta.icon;
              return (
                <tr key={enrollment.id} className="transition-colors hover:bg-[#faf7ff]">
                  <td className="px-5 py-3">
                    {applicant ? (
                      <Link href={`/admin/applicants/${applicant.id}`} className="font-semibold text-ink hover:text-brand">
                        {applicant.full_name}
                      </Link>
                    ) : (
                      <span className="font-semibold text-ink">Unknown</span>
                    )}
                    <p className="text-xs text-[#8a8493]">{applicant?.email ?? "—"}</p>
                  </td>
                  <td className="px-5 py-3 text-[#5f5b65]">{course?.title ?? "—"}</td>
                  <td className="px-5 py-3 text-[#5f5b65]">{planLabel(enrollment.plan_key)}</td>
                  <td className="px-5 py-3 font-semibold text-ink">
                    {enrollment.amount_kobo != null ? formatNairaKobo(enrollment.amount_kobo) : "—"}
                  </td>
                  <td className="px-5 py-3">
                    <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold ${meta.tone}`}>
                      <StatusIcon size={12} /> {meta.label}
                    </span>
                  </td>
                  <td className="px-5 py-3 font-mono text-xs text-[#8a8493]">{enrollment.payment_reference ?? "—"}</td>
                  <td className="px-5 py-3 text-[#8a8493]">
                    {enrollment.payment_status === "paid" && enrollment.paid_at
                      ? `Paid ${formatDateTime(enrollment.paid_at)}`
                      : `Created ${formatDate(enrollment.created_at)}`}
                  </td>
                </tr>
              );
            })}
            {(enrollments ?? []).length === 0 && (
              <tr>
                <td colSpan={7} className="px-5 py-10 text-center text-[#8a8493]">
                  {status === "all"
                    ? "No payments yet. Registrations will appear here."
                    : `No ${status} payments.`}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
