import { redirect } from "next/navigation";
import { CheckCircle2 } from "lucide-react";

import PaymentPage, { type PaymentCourse } from "@/components/PaymentPage";
import { coursePriceBySlug } from "@/data/paymentOptions";
import { serviceClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Payment — Innovatio Academy",
};

export default async function PaymentRoutePage({
  searchParams,
}: {
  searchParams: Promise<{ enrollment?: string }>;
}) {
  const { enrollment: enrollmentId } = await searchParams;
  if (!enrollmentId) redirect("/apply");

  const sb = serviceClient();

  const { data: enrollment } = await sb
    .from("enrollments")
    .select("id, payment_status, plan_key, applicants(email, full_name, course_id, courses(slug, title))")
    .eq("id", enrollmentId)
    .maybeSingle();

  if (!enrollment) redirect("/apply");

  const applicant = (enrollment.applicants as unknown as {
    email: string;
    full_name: string;
    course_id: string;
    courses: { slug: string; title: string } | null;
  }) ?? null;

  if (!applicant?.email || !applicant.courses) redirect("/apply");

  const courseMeta = coursePriceBySlug(applicant.courses.slug);
  if (!courseMeta) redirect("/apply");

  const course: PaymentCourse = {
    slug: applicant.courses.slug,
    name: courseMeta.name,
    duration: courseMeta.duration,
    priceNgn: courseMeta.priceNgn,
  };

  if (enrollment.payment_status === "paid") {
    return (
      <main className="min-h-screen bg-[#f2f2f2]">
        <div className="mx-auto max-w-[760px] px-5 py-16 sm:px-8">
          <div className="rounded-[18px] border border-green-200 bg-white p-8 text-center sm:p-12">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-100">
              <CheckCircle2 className="text-green-600" size={28} />
            </div>
            <h1 className="mt-6 text-3xl font-black tracking-[-0.04em] text-[#151515]">Payment received</h1>
            <p className="mx-auto mt-4 max-w-md text-[15px] leading-relaxed text-[#4d4d4d]">
              Thank you, <b className="text-[#171717]">{applicant.full_name}</b>! Your tuition for{" "}
              <b className="text-[#171717]">{course.name}</b> has been confirmed. You&apos;ll receive your onboarding
              details shortly.
            </p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <PaymentPage
      enrollmentId={enrollment.id}
      course={course}
      applicantName={applicant.full_name}
      planKey={enrollment.plan_key}
    />
  );
}
