import Header from "@/components/Header";
import Hero from "@/components/Hero";
import ProgramOverview from "@/components/ProgramOverview";
import SoftwareEngineeringSection from "@/components/SoftwareEngineeringSection";
import CareerPaths from "@/components/CareerPaths";
import LearningPath from "@/components/LearningPath";
import CompaniesSection from "@/components/CompaniesSection";
import PaymentOptions from "@/components/PaymentOptions";
import NextCohort from "@/components/NextCohort";
import Footer from "@/components/Footer";

export default function CoursesPage() {
  return (
    <main>
      <Header />
      <Hero />
      <ProgramOverview />
      <SoftwareEngineeringSection />
      <CareerPaths />
      <LearningPath />
      <CompaniesSection />
      <PaymentOptions />
      <NextCohort />
      <Footer />
    </main>
  );
}
