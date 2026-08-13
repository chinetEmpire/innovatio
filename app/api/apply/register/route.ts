import { NextResponse } from "next/server";

import { serviceClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";

export async function POST(req: Request) {
  let body: { email?: string; courseSlug?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const email = body.email?.trim().toLowerCase() ?? "";
  const courseSlug = body.courseSlug?.trim() ?? "";

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "A valid email is required." }, { status: 400 });
  }
  if (!courseSlug) {
    return NextResponse.json({ error: "Course is required." }, { status: 400 });
  }

  const sb = serviceClient();

  const { data: course } = await sb.from("courses").select("id").eq("slug", courseSlug).maybeSingle();
  if (!course) {
    return NextResponse.json({ error: "Course not found." }, { status: 404 });
  }

  const { data: assessment } = await sb
    .from("assessments")
    .select("id")
    .eq("course_id", course.id)
    .eq("active", true)
    .maybeSingle();
  if (!assessment) {
    return NextResponse.json({ error: "No active assessment for this course." }, { status: 400 });
  }

  const { data: applicant } = await sb
    .from("applicants")
    .select("id, full_name, email, whatsapp, age_bracket")
    .eq("email", email)
    .eq("course_id", course.id)
    .maybeSingle();
  if (!applicant) {
    return NextResponse.json({ error: "No application found for this email and course. Please start an assessment first." }, { status: 400 });
  }

  const { data: passedAttempt } = await sb
    .from("attempts")
    .select("id")
    .eq("applicant_id", applicant.id)
    .eq("assessment_id", assessment.id)
    .eq("status", "submitted")
    .eq("passed", true)
    .order("created_at", { ascending: false })
    .maybeSingle();
  if (!passedAttempt) {
    return NextResponse.json({ error: "You need to pass the assessment before registering." }, { status: 403 });
  }

  const { data: existing, error: existingError } = await sb
    .from("enrollments")
    .select("id, payment_status")
    .eq("applicant_id", applicant.id)
    .eq("course_id", course.id)
    .maybeSingle();
  if (existingError) {
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }

  const { data: courseRow } = await sb.from("courses").select("title").eq("id", course.id).maybeSingle();

  let enrollment: { id: string; payment_status: string } | null = existing ?? null;

  if (!enrollment) {
    const { data: created, error: insertError } = await sb
      .from("enrollments")
      .insert({
        applicant_id: applicant.id,
        course_id: course.id,
        attempt_id: passedAttempt.id,
        payment_status: "pending",
      })
      .select("id, payment_status")
      .single();
    if (insertError || !created) {
      return NextResponse.json({ error: "Could not complete registration. Please try again." }, { status: 500 });
    }
    enrollment = created;
  }

  return NextResponse.json({
    ok: true,
    enrollmentId: enrollment.id,
    paymentStatus: enrollment.payment_status,
    applicant: {
      full_name: applicant.full_name,
      email: applicant.email,
      whatsapp: applicant.whatsapp,
      age_bracket: applicant.age_bracket,
    },
    courseTitle: courseRow?.title ?? courseSlug,
  });
}
