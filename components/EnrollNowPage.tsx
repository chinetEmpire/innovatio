import Image from "next/image";
import Link from "next/link";

import logo from "@/app/images/logo.png";
import StartAssessmentButton from "./StartAssessmentButton";

export default function EnrollNowPage() {
  return (
    <main className="min-h-screen bg-white">
      <header className="border-b border-[#ece6f6] bg-white">
        <div className="flex items-center justify-between gap-4 px-5 py-2.5 sm:px-8 lg:px-[4.2%]">
          <Link href="/" aria-label="Innovatio Academy home" className="transition-opacity hover:opacity-80">
            <Image src={logo} alt="Innovatio Academy" className="h-auto w-[150px] sm:w-[200px]" />
          </Link>

          <nav className="hidden items-center gap-8 text-[18px] font-bold text-[#171717] md:flex">
            <Link href="/courses" className="transition-opacity hover:opacity-80">Courses</Link>
            <Link href="#cohort" className="transition-opacity hover:opacity-80">Contact us</Link>
            <Link href="#faq" className="transition-opacity hover:opacity-80">FAQs</Link>
          </nav>
        </div>
      </header>

      <div className="px-5 pt-6 sm:px-8 lg:px-[4.2%]">
        <section className="mx-auto mt-10 max-w-[760px] rounded-[18px] bg-white shadow-[0_8px_30px_rgba(0,0,0,0.12)] px-5 py-8 sm:px-8 md:px-10 md:py-10">
          

          <h1 className="mt-7 lg:ml-5  text-[clamp(2rem,3vw,2.8rem)] font-black tracking-[-0.05em] text-[#171717]">
              Ready to Get Started?
          </h1>

          <div className="mx-auto mt-6 max-w-[640px]  text-[15px] leading-relaxed text-[#4a4a4a]">
            <p>Before securing your spot, you&apos;ll complete a short assessment to help us understand your current skill level.</p>
            <p className="mt-5">If you don&apos;t pass on your first attempt, don&apos;t worry. You can retake the assessment up to three times, giving you multiple opportunities to qualify for enrollment.</p>
          </div>

          <div className="mt-8 max-w-[620px] mx-auto">
            <h2 className="text-[18px] font-black tracking-[-0.04em] text-[#171717]">What to expect</h2>
            <ul className="mt-4 space-y-3 text-[15px] leading-relaxed text-[#3f3f3f]">
              <li className="flex items-center gap-3"><span className="inline-block h-2 w-2 rounded-full bg-[#3d3d3d]" />Takes about 10–30 minutes</li>
              <li className="flex items-center gap-3"><span className="inline-block h-2 w-2 rounded-full bg-[#3d3d3d]" />Multiple-choice questions</li>
              <li className="flex items-center gap-3"><span className="inline-block h-2 w-2 rounded-full bg-[#3d3d3d]" />No payment required yet</li>
              <li className="flex items-center gap-3"><span className="inline-block h-2 w-2 rounded-full bg-[#3d3d3d]" />You&apos;ll receive your result immediately</li>
              <li className="flex items-center gap-3"><span className="inline-block h-2 w-2 rounded-full bg-[#3d3d3d]" />Unlimited attempts, within 1hr interval</li>
            </ul>

            <div className="mt-8 flex">
              <StartAssessmentButton />
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
