import type { Metadata } from "next";
import { notFound } from "next/navigation";

import Header from "@/components/Header";
import Hero from "@/components/Hero";
import ProgramOverview from "@/components/ProgramOverview";
import CourseIntroSection from "@/components/CourseIntroSection";
import CareerPaths from "@/components/CareerPaths";
import LearningPath from "@/components/LearningPath";
import CompaniesSection from "@/components/CompaniesSection";
import PaymentOptions from "@/components/PaymentOptions";
import NextCohort from "@/components/NextCohort";
import Footer from "@/components/Footer";
import { courseBySlug, courses } from "@/data/courses";

type CoursePageProps = {
  params: Promise<{ course: string }>;
};

export function generateStaticParams() {
  return Object.keys(courses).map((course) => ({ course }));
}

export async function generateMetadata({ params }: CoursePageProps): Promise<Metadata> {
  const { course } = await params;
  const content = courseBySlug(course);
  if (!content) return { title: "Course — Innovatio Academy" };
  return {
    title: `${content.navLabel} Course — Innovatio Academy`,
    description: content.hero.subtitle,
  };
}

export default async function CoursePage({ params }: CoursePageProps) {
  const { course } = await params;
  const content = courseBySlug(course);
  if (!content) notFound();

  return (
    <main>
      <Header />
      <Hero
        badge={content.hero.badge}
        title={content.hero.title}
        subtitle={content.hero.subtitle}
        facts={content.hero.facts}
      />
      <ProgramOverview heading={content.overviewHeading} />
      <CourseIntroSection heading={content.intro.heading} paragraphs={content.intro.paragraphs} />
      <CareerPaths careers={content.careers} />
      <LearningPath tabs={content.learningTabs} content={content.learningContent} />
      <CompaniesSection />
      <PaymentOptions />
      <NextCohort />
      <Footer />
    </main>
  );
}
