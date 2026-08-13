import { NextResponse } from "next/server";

import { verifyWebhookSignature } from "@/lib/paystack";
import { serviceClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const rawBody = await req.text();
  const signature = req.headers.get("x-paystack-signature");

  if (!verifyWebhookSignature(rawBody, signature)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  let event: { event?: string; data?: { reference?: string } };
  try {
    event = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  if (event.event === "charge.success" && event.data?.reference) {
    const sb = serviceClient();
    const { data: enrollment } = await sb
      .from("enrollments")
      .select("id, payment_status")
      .eq("payment_reference", event.data.reference)
      .maybeSingle();

    if (enrollment && enrollment.payment_status !== "paid") {
      await sb
        .from("enrollments")
        .update({ payment_status: "paid", paid_at: new Date().toISOString() })
        .eq("id", enrollment.id);
    }
  }

  return NextResponse.json({ received: true });
}
