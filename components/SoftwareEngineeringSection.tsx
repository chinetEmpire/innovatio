import Image from "next/image";

import flowerImage from "@/app/images/flower.png";
import Reveal from "./Reveal";

export default function SoftwareEngineeringSection() {
  return (
    <section className="mx-auto max-w-6xl px-5 pb-16 sm:px-8">
      <div className="grid items-center gap-10 md:grid-cols-2">
        <Reveal>
          <Image
            src={flowerImage}
            alt="Innovatio Academy student"
            className="mx-auto h-auto w-full max-w-sm rounded-2xl object-cover shadow-[0_24px_48px_rgba(47,31,101,0.12)]"
          />
        </Reveal>
        <Reveal delay={150}>
          <div>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">What is Software Engineering?</h2>
            <p className="mt-5 text-base leading-relaxed text-[#4d4752]">
              Today&apos;s software engineers do more than write code — they build complex digital products from the
              frontend to the backend, connecting user experiences with powerful server-side systems and databases.
            </p>
            <p className="mt-4 text-base leading-relaxed text-[#4d4752]">
              At Innovatio Academy, you&apos;ll learn the fundamentals of full-stack software engineering while also
              discovering how modern developers use AI tools to research, debug, automate repetitive tasks, and work
              more efficiently.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
