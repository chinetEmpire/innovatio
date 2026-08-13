import { NextResponse } from "next/server";

import { evaluateEligibility } from "@/lib/assessment";
import { serviceClient } from "@/lib/supabase/admin";
import { AGE_BRACKETS } from "@/lib/types";

export const runtime = "nodejs";

export async function POST(req: Request) {
  let body: {
    name?: string;
    email?: string;
    whatsapp?: string;
    ageBracket?: string;
    courseSlug?: string;
    agreed?: boolean;
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const name = body.name?.trim() ?? "";
  const email = body.email?.trim().toLowerCase() ?? "";
  const whatsapp = body.whatsapp?.trim() ?? "";
  const ageBracket = body.ageBracket ?? "";
  const courseSlug = body.courseSlug?.trim() ?? "";

  if (!name || name.length < 2) {
    return NextResponse.json({ error: "Please enter your full name." }, { status: 400 });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
  }
  if (whatsapp && !/^[+()\d\s-]{6,20}$/.test(whatsapp)) {
    return NextResponse.json({ error: "Please enter a valid WhatsApp number." }, { status: 400 });
  }
  if (!(AGE_BRACKETS as readonly string[]).includes(ageBracket)) {
    return NextResponse.json({ error: "Please select your age bracket." }, { status: 400 });
  }
  if (!courseSlug) {
    return NextResponse.json({ error: "Please select a course." }, { status: 400 });
  }
  if (!body.agreed) {
    return NextResponse.json({ error: "You must agree to the terms to continue." }, { status: 400 });
  }

  const sb = serviceClient();

  const { data: course, error: courseError } = await sb
    .from("courses")
    .select("id, slug, title")
    .eq("slug", courseSlug)
    .maybeSingle();
  if (courseError || !course) {
    return NextResponse.json({ error: "Course not found." }, { status: 404 });
  }

  const { data: assessment, error: assessmentError } = await sb
    .from("assessments")
    .select("*")
    .eq("course_id", course.id)
    .eq("active", true)
    .maybeSingle();
  if (assessmentError || !assessment) {
    return NextResponse.json({ error: "No active assessment is available for this course yet." }, { status: 400 });
  }

  const { data: applicant, error: applicantError } = await sb
    .from("applicants")
    .upsert(
      {
        email,
        full_name: name,
        whatsapp,
        age_bracket: ageBracket,
        course_id: course.id,
        agreed_to_terms: true,
      },
      { onConflict: "email,course_id" }
    )
    .select("id, email")
    .single();
  if (applicantError || !applicant) {
    return NextResponse.json({ error: "Could not save your details. Please try again." }, { status: 500 });
  }

  const { data: attempts, error: attemptsError } = await sb
    .from("attempts")
    .select("*")
    .eq("applicant_id", applicant.id)
    .eq("assessment_id", assessment.id)
    .order("created_at", { ascending: true });
  if (attemptsError) {
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }

  const eligibility = evaluateEligibility({
    attempts: attempts ?? [],
    assessment,
    courseSlug: course.slug,
  });

  if (eligibility.action === "start") {
    const { data: attempt, error: attemptError } = await sb
      .from("attempts")
      .insert({ applicant_id: applicant.id, assessment_id: assessment.id })
      .select("id")
      .single();
    if (attemptError || !attempt) {
      return NextResponse.json({ error: "Could not start the assessment. Please try again." }, { status: 500 });
    }
    return NextResponse.json({
      action: "start",
      attemptId: attempt.id,
      redirect: `/apply/${course.slug}/assessment?attempt=${attempt.id}`,
    });
  }

  return NextResponse.json(eligibility);
}
