import Image from "next/image";
import Link from "next/link";

import logo from "@/app/images/logo.png";

export default function EnrollNowPage() {
  return (
    <main className="min-h-screen bg-[#f5f5f5]">
      <div className="mx-auto max-w-[1200px] px-5 pt-6 sm:px-8">
        <header className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-[6px] bg-[#4d2bd9] shadow-[0_8px_18px_rgba(77,43,217,0.35)]">
              <span className="text-lg font-black text-white">◢</span>
            </div>
            <div className="leading-[0.9]">
              <div className="text-[11px] font-black uppercase tracking-[0.12em] text-[#161616]">Innovatio</div>
              <div className="text-[9px] font-black uppercase tracking-[0.12em] text-[#161616]/75">Academy</div>
            </div>
          </div>

          <nav className="hidden items-center gap-8 text-[13px] font-medium text-[#171717] md:flex">
            <Link href="/" className="transition-opacity hover:opacity-80">Home</Link>
            <Link href="/courses" className="transition-opacity hover:opacity-80">Courses</Link>
            <Link href="#cohort" className="transition-opacity hover:opacity-80">Contact us</Link>
            <Link href="#faq" className="transition-opacity hover:opacity-80">FAQs</Link>
          </nav>
        </header>

        <section className="mx-auto mt-10 max-w-[760px] rounded-[18px] border border-[#eaeaea] bg-[#f3f3f3] px-5 py-8 sm:px-8 md:px-10 md:py-10">
          <div className="flex items-center justify-center">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#f2ebff] text-[#5a2bd6]">
              <Image src={logo} alt="Innovatio Academy" className="h-5 w-5 object-contain" />
            </div>
          </div>

          <h1 className="mt-7 text-center text-[clamp(2rem,3vw,2.8rem)] font-black tracking-[-0.05em] text-[#171717]">
            Ready to Get Started?
          </h1>

          <div className="mx-auto mt-6 max-w-[640px] text-center text-[15px] leading-relaxed text-[#4a4a4a]">
            <p>Before securing your spot, you&apos;ll complete a short assessment to help us understand your current skill level.</p>
            <p className="mt-5">If you don&apos;t pass on your first attempt, don&apos;t worry. You can retake the assessment up to three times, giving you multiple opportunities to qualify for enrollment.</p>
          </div>

          <div className="mt-8 max-w-[620px] mx-auto">
            <h2 className="text-[18px] font-black tracking-[-0.04em] text-[#171717]">What to expect</h2>
            <ul className="mt-4 space-y-3 text-[15px] leading-relaxed text-[#3f3f3f]">
              <li className="flex items-center gap-3"><span className="inline-block h-2 w-2 rounded-full bg-[#3d3d3d]" />Takes about 10–15 minutes</li>
              <li className="flex items-center gap-3"><span className="inline-block h-2 w-2 rounded-full bg-[#3d3d3d]" />Multiple-choice questions</li>
              <li className="flex items-center gap-3"><span className="inline-block h-2 w-2 rounded-full bg-[#3d3d3d]" />No payment required yet</li>
              <li className="flex items-center gap-3"><span className="inline-block h-2 w-2 rounded-full bg-[#3d3d3d]" />You&apos;ll receive your result immediately</li>
              <li className="flex items-center gap-3"><span className="inline-block h-2 w-2 rounded-full bg-[#3d3d3d]" />Up to 3 assessment attempts</li>
            </ul>

            <div className="mt-8 flex justify-center">
              <Link
                href="/apply"
                className="inline-flex items-center justify-center rounded-[14px] bg-[#4e2cda] px-10 py-3 text-[15px] font-bold text-white shadow-[0_12px_20px_rgba(78,44,218,0.28)] transition-transform hover:translate-y-[-1px]"
              >
                Start assessment
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
