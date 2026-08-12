import Image from "next/image";
import useImage from "@/app/images/use.png";

export default function About() {
  return (
    <section id="about" className="mx-auto grid max-w-[980px] items-center gap-10 px-5 py-14 sm:px-8 sm:py-16 md:grid-cols-2 md:px-6 md:py-20">
      <div className="mx-auto w-full max-w-[390px]">
        <div className="relative h-[250px] w-full sm:h-[285px] lg:h-[320px]">
          <div className="absolute inset-0 overflow-hidden  bg-[#f5f5f5] shadow-[0_24px_34px_rgba(0,0,0,0.08)]">
            <Image
              src={useImage}
              alt="Innovatio learners"
              className="h-full w-full object-contain object-center"
              priority
            />
          </div>
        </div>
      </div>

      <div>
        <h2 className="font-bold">About Innovatio</h2>
        <p className="mt-5 text-[#5f5b65]">Great careers aren&apos;t built on certificates alone, they&apos;re built on knowledge, experience, and the ability to solve real-world challenges.</p>
        <p className="mt-4 text-[#5f5b65]">That&apos;s the philosophy behind Innovatio Academy.</p>
        <p className="mt-4 text-[#5f5b65]">Our mission is to train, mentor, and empower the next generation of software engineers and cybersecurity professionals through practical, project-based learning that reflects the realities of the modern tech industry.</p>
      </div>
    </section>
  );
}
