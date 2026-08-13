import { NextResponse } from "next/server";

import { verifyTransaction } from "@/lib/paystack";
import { serviceClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const reference = url.searchParams.get("reference")?.trim() ?? "";
  const enrollmentId = url.searchParams.get("enrollment")?.trim() ?? "";

  if (!reference || !enrollmentId) {
    return NextResponse.json({ ok: false, error: "Missing reference or enrollment." }, { status: 400 });
  }

  const sb = serviceClient();

  const { data: enrollment } = await sb
    .from("enrollments")
    .select("id, payment_status, payment_reference")
    .eq("id", enrollmentId)
    .maybeSingle();

  if (!enrollment) {
    return NextResponse.json({ ok: false, error: "Enrollment not found." }, { status: 404 });
  }

  if (enrollment.payment_status === "paid") {
    return NextResponse.json({ ok: true, status: "success", enrollmentId });
  }

  let txnStatus: string;
  try {
    const txn = await verifyTransaction(reference);
    txnStatus = txn.status;
  } catch (err) {
    const message = err instanceof Error ? err.message : "Could not verify payment.";
    return NextResponse.json({ ok: false, error: message }, { status: 502 });
  }

  if (txnStatus === "success") {
    const { error } = await sb
      .from("enrollments")
      .update({ payment_status: "paid", paid_at: new Date().toISOString() })
      .eq("id", enrollment.id);
    if (error) {
      return NextResponse.json({ ok: false, error: "Could not confirm payment." }, { status: 500 });
    }
    return NextResponse.json({ ok: true, status: "success", enrollmentId });
  }

  return NextResponse.json({ ok: true, status: txnStatus, enrollmentId });
}
