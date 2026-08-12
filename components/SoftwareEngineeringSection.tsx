import Image from "next/image";
import flowerImage from "@/app/images/flower.png";

export default function SoftwareEngineeringSection() {
  return <section className="mx-auto grid max-w-[800px] items-center gap-6 px-5 py-8 md:grid-cols-2">
    <Image src={flowerImage} alt="Innovatio Academy student" className="h-auto w-full max-w-[260px]" />
    <div>
      <h2 className="text-[20px] font-bold leading-tight">What is Software<br/>Engineering?</h2>
      <p className="mt-4 text-[9px] leading-[1.4] text-[#4d4752]">Today&apos;s software engineers do more than write code, they build complex digital products from the frontend to the backend, connecting user experiences with powerful server-side systems and databases.</p>
      <p className="mt-3 text-[9px] leading-[1.4] text-[#4d4752]">At Innovatio Academy, you&apos;ll learn the fundamentals of full-stack software engineering while also discovering how modern developers use AI tools to research, debug, automate repetitive tasks, and work more efficiently.</p>
    </div>
  </section>;
}
