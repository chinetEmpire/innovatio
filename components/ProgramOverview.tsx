import { BriefcaseBusiness, GraduationCap, Star } from "lucide-react";

const benefits = [
  { Icon: BriefcaseBusiness, first: "Qualify for in-demand job roles", second: "as a Software Engineer" },
  { Icon: GraduationCap, first: "No IT or STEM", second: "background needed" },
  { Icon: Star, first: "4.8/5 rating across", second: "2.5k+ reviews" },
];

export default function ProgramOverview() {
  return <section className="mx-auto max-w-[800px] px-5 pb-12 pt-32 text-center sm:pt-28">
    <h2 className="font-bold leading-tight">Become a Software Engineer<br/>with Innovatio Academy</h2>
    <div className="mt-10 grid gap-7 sm:mt-12 sm:grid-cols-3 sm:gap-4">{benefits.map(({ Icon, first, second }) => <div key={first} className="text-center"><span className="benefit-icon mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-[#f0eaff] text-brand"><Icon size={18} strokeWidth={1.8}/></span><p>{first}<br/>{second}</p></div>)}</div>
  </section>;
}
