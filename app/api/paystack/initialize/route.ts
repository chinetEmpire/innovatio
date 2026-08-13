import { randomUUID } from "crypto";
import { NextResponse } from "next/server";

import { initializeTransaction } from "@/lib/paystack";
import { coursePriceBySlug, paymentPlans } from "@/data/paymentOptions";
import { serviceClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  let body: { enrollmentId?: string; planKey?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const enrollmentId = body.enrollmentId?.trim() ?? "";
  const planKey = body.planKey ?? "";

  if (!enrollmentId) return NextResponse.json({ error: "Enrollment is required." }, { status: 400 });

  const plan = paymentPlans.find((p) => p.key === planKey);
  if (!plan) return NextResponse.json({ error: "Invalid payment plan." }, { status: 400 });

  const sb = serviceClient();

  const { data: enrollment } = await sb
    .from("enrollments")
    .select("id, payment_status, applicants(email, full_name, course_id, courses(slug, title))")
    .eq("id", enrollmentId)
    .maybeSingle();

  if (!enrollment) {
    return NextResponse.json({ error: "Enrollment not found." }, { status: 404 });
  }
  if (enrollment.payment_status === "paid") {
    return NextResponse.json({ error: "This enrollment is already paid." }, { status: 409 });
  }

  const applicant = (enrollment.applicants as unknown as {
    email: string;
    full_name: string;
    course_id: string;
    courses: { slug: string; title: string } | null;
  }) ?? null;

  if (!applicant?.email) {
    return NextResponse.json({ error: "Applicant email is missing." }, { status: 400 });
  }

  const course = applicant.courses;
  const coursePrice = course ? coursePriceBySlug(course.slug) : undefined;
  if (!coursePrice) {
    return NextResponse.json({ error: "No pricing configured for this course." }, { status: 400 });
  }

  const reference = `INV-${enrollmentId.slice(0, 8)}-${randomUUID().slice(0, 8)}`;
  const callbackUrl = new URL(
    `/payment/verify?reference=${encodeURIComponent(reference)}&enrollment=${encodeURIComponent(enrollmentId)}`,
    req.url
  ).toString();

  const { error: refError } = await sb
    .from("enrollments")
    .update({
      plan_key: plan.key,
      amount_kobo: plan.amountKobo,
      payment_reference: reference,
    })
    .eq("id", enrollmentId);
  if (refError) {
    return NextResponse.json({ error: "Could not prepare payment. Please try again." }, { status: 500 });
  }

  try {
    const data = await initializeTransaction({
      email: applicant.email,
      amountKobo: plan.amountKobo,
      reference,
      callbackUrl,
      metadata: { enrollmentId, applicantName: applicant.full_name, courseSlug: course?.slug },
    });
    return NextResponse.json({ authorization_url: data.authorization_url, reference });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Could not initialize payment.";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
