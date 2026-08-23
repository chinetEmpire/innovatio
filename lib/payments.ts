import type { PaystackTransactionStatus } from "@/lib/paystack";
import { serviceClient } from "@/lib/supabase/admin";

export type RecordedOutcome = "success" | "failed" | "abandoned" | "pending" | "amount_mismatch";

export type TransactionSnapshot = {
  reference: string;
  status: PaystackTransactionStatus;
  amount: number;
  currency?: string;
  paid_at?: string | null;
  channel?: string;
  gateway_response?: string;
  fees?: number;
};

function outcomeForTxn(status: PaystackTransactionStatus): RecordedOutcome {
  if (status === "success") return "success";
  if (status === "failed") return "failed";
  if (status === "abandoned") return "abandoned";
  return "pending";
}

export async function recordTransactionUpdate(txn: TransactionSnapshot): Promise<RecordedOutcome> {
  const sb = serviceClient();
  const next = outcomeForTxn(txn.status);

  const { data: payment } = await sb
    .from("payments")
    .select("id, amount_kobo")
    .eq("reference", txn.reference)
    .maybeSingle();

  if (!payment) return next;

  const patch: Record<string, unknown> = {
    channel: txn.channel ?? null,
    gateway_response: txn.gateway_response ?? null,
    fees_kobo: typeof txn.fees === "number" ? Math.round(txn.fees) : null,
    paystack_paid_at: txn.paid_at ?? null,
    updated_at: new Date().toISOString(),
  };

  if (next === "success") {
    if (txn.amount !== payment.amount_kobo) {
      await sb
        .from("payments")
        .update({
          ...patch,
          status: "amount_mismatch",
          gateway_response:
            txn.gateway_response ?? `Amount mismatch: expected ${payment.amount_kobo}, received ${txn.amount}`,
        })
        .eq("id", payment.id);
      return "amount_mismatch";
    }
    await sb.from("payments").update({ ...patch, status: "success" }).eq("id", payment.id);
    return "success";
  }

  if (next !== "pending") {
    await sb.from("payments").update({ ...patch, status: next }).eq("id", payment.id);
    return next;
  }

  return "pending";
}
