import { NextResponse } from "next/server";

import { verifyWebhookSignature } from "@/lib/paystack";
import { recordTransactionUpdate, type TransactionSnapshot } from "@/lib/payments";
import { serviceClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const rawBody = await req.text();
  const signature = req.headers.get("x-paystack-signature");

  if (!verifyWebhookSignature(rawBody, signature)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  let event: { event?: string; data?: Partial<TransactionSnapshot> & { reference?: string } };
  try {
    event = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const reference = event.data?.reference;

  if (
    reference &&
    event.data &&
    (event.event === "charge.success" || event.event === "charge.failed")
  ) {
    const outcome = await recordTransactionUpdate({
      reference,
      status: event.data.status ?? (event.event === "charge.success" ? "success" : "failed"),
      amount: typeof event.data.amount === "number" ? event.data.amount : -1,
      currency: event.data.currency,
      paid_at: event.data.paid_at ?? null,
      channel: event.data.channel,
      gateway_response: event.data.gateway_response,
      fees: event.data.fees,
    });

    const sb = serviceClient();
    if (outcome === "success") {
      const { data: enrollment } = await sb
        .from("enrollments")
        .select("id, payment_status")
        .eq("payment_reference", reference)
        .maybeSingle();
      if (enrollment && enrollment.payment_status !== "paid") {
        await sb
          .from("enrollments")
          .update({ payment_status: "paid", paid_at: new Date().toISOString() })
          .eq("id", enrollment.id);
      }
    } else if (outcome === "failed" || outcome === "abandoned") {
      await sb.from("enrollments").update({ payment_status: "failed" }).eq("payment_reference", reference);
    }
  }

  return NextResponse.json({ received: true });
}
