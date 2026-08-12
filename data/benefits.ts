import { BriefcaseBusiness, GraduationCap, Star } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type Benefit = { Icon: LucideIcon; first: string; second: string };

export const benefits: Benefit[] = [
  { Icon: BriefcaseBusiness, first: "Qualify for in-demand job roles", second: "as a Software Engineer" },
  { Icon: GraduationCap, first: "No IT or STEM", second: "background needed" },
  { Icon: Star, first: "4.8/5 rating across", second: "2.5k+ reviews" },
];
