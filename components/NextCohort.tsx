import Image from "next/image";
import { CheckCircle2 } from "lucide-react";

import flowerImage from "@/app/images/flower.png";
import nextImage from "@/app/images/next.jpg";
import { cohortSteps } from "@/data/cohortSteps";

export default function NextCohort() {
  return (
    <section id="cohort" className="mx-auto grid max-w-[800px] gap-10 px-5 py-12 md:grid-cols-2">
      <div>
        <h2 className="text-[18px] font-bold">Join Our Next Cohort</h2>
        <p className="mt-4 text-[9px] leading-[1.35] text-[#4d4752]">Next Cohort Starts 21st of September, 2026.<br />Registration starts on 7th of August, 2026 and closes on 7th of September, 2026. Apply now!</p>
        <div className="mt-6 flex justify-center md:justify-start">
          <Image src={flowerImage} alt="Innovatio Academy student" className="h-auto w-full max-w-[260px]" />
        </div>
      </div>
      <div className="border-l border-[#ddd] pl-6">
        {cohortSteps.map(({ title, description }, index) => (
          <div className="relative mb-6 border-b border-[#eee] pb-5 last:border-0" key={title}>
            <CheckCircle2
              className={`absolute -left-[34px] top-0 rounded-full bg-white ${index === 0 ? "fill-yellow-400 text-yellow-400" : "text-[#d9d9d9]"}`}
              size={16}
            />
            <h3 className="text-[11px] font-bold">{title}</h3>
            {index === 0 && (
              <Image
                className="mt-3 h-[191px] w-full rounded-[10px] object-cover"
                src={nextImage}
                alt="Online learning"
              />
            )}
            <p className="mt-2 text-[8px] leading-[1.35] text-[#65606a]">{description}</p>
          </div>
        ))}
        <a href="#home" className="inline-block rounded-full bg-brand px-4 py-2 text-[8px] text-white">Enroll now</a>
      </div>
    </section>
  );
}
