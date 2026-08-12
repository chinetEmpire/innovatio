import Image from "next/image";
import heroImage from "@/app/images/hero.jpg";

export default function Hero() {
  return <section id="home" className="relative h-[325px] overflow-visible text-white">
    <Image src={heroImage} alt="Software engineering students" priority fill className="object-cover" />
    <div className="hero-overlay absolute inset-0" aria-hidden="true" />
    <div className="relative z-10 mx-auto max-w-[1100px] px-5 pt-16 text-center">
      <h1 className="hero-title font-bold">Full-stack Software Engineering</h1>
      <div className="hero-info relative z-10 mx-auto mt-16 translate-y-16 grid max-w-[720px] grid-cols-2 gap-y-5 rounded-md bg-white px-8 py-7 text-center text-[13px] text-ink shadow-soft md:grid-cols-4">
        <p><b>Program Fee:</b><br/><span className="mt-2 block">₦350,000</span></p>
        <p><b>Program Duration:</b><br/><span className="mt-2 block">6 Months</span></p>
        <p><b>Start Date</b><br/><span className="mt-2 block">August 31, 2026.</span></p>
        <p><b>Location</b><br/><span className="mt-2 block">Online</span></p>
      </div>
    </div>
  </section>;
}
