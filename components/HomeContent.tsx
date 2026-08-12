import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import miscImage from "@/app/images/misc.png";
import useImage from "@/app/images/use.png";

const tracks=[['Software Engineering','Master modern software engineering with AI-powered workflows that prepare you for real jobs.','https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=700&q=80'],['Cybersecurity','Learn Javascript design patterns and how to develop web apps using React.','https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&w=700&q=80']];

export function About(){
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

export function Tracks(){return <section id="tracks" className="dot-bg py-14 sm:py-16"><div className="mx-auto max-w-[980px] px-5 text-center sm:px-8 md:px-6"><h2 className="font-bold">Our Learning Tracks</h2><p className="mx-auto mt-4 max-w-[510px] text-[#5f5b65]">We aim to build an ecosystem for young techies and startup companies that create value and make a difference while being up to date with the new technologies.</p><div className="mt-8 grid gap-5 sm:mt-10 md:grid-cols-2">{tracks.map(([title,text,image])=><article key={title} className="overflow-hidden rounded-xl border-[6px] border-[#eee9f5] bg-white p-3 text-left shadow-soft"><img src={image} alt={title} className="h-48 w-full rounded-lg object-cover sm:h-56"/><h3 className="mt-4 font-bold">{title}</h3><p className="mt-2 min-h-12 text-[#59535f]">{text}</p><a href="#cohort" className="mt-5 block rounded bg-brand px-4 py-3 font-semibold text-white">View curriculum →</a></article>)}</div></div></section>}
export function Apart(){return <section className="mx-auto grid max-w-[980px] items-center gap-10 px-5 py-14 sm:px-8 sm:py-16 md:grid-cols-2 md:px-6 md:py-20"><div><h2 className="font-bold">What Sets Us Apart</h2><div className="mt-9 border-l-2 border-[#d8c6ff] pl-5 sm:pl-6"><div className="flex gap-4"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#f0eaff] text-brand"><ArrowUpRight size={18}/></span><div><h3 className="font-bold">Learn by Building</h3><p className="mt-3 text-[#5f5b65]">We believe real learning happens through practice. From day one, you&apos;ll write code and work with industry-standard tools that strengthen your understanding.</p><a href="#cohort" className="mt-5 inline-block rounded-full bg-brand px-5 py-3 font-semibold text-white">Enroll now</a></div></div></div></div><div className="mx-auto w-full max-w-[420px]"><Image src={miscImage} alt="Learners collaborating" className="aspect-square w-full object-cover rounded-[50%]"/></div></section>}
