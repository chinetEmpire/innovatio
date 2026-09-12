import type { StaticImageData } from "next/image";

import cybImage from "@/app/images/cyb.png";
import engImage from "@/app/images/eng.png";

export type Track = { title: string; description: string; image: StaticImageData; href: string };

export const tracks: Track[] = [
  {
    title: "Software Engineering",
    description: "Master modern software engineering with AI-powered workflows that prepare you for real jobs.",
    image: engImage,
    href: "/courses/software-engineering",
  },
  {
    title: "Cybersecurity",
    description: "Learn Javascript design patterns and how to develop web apps using React.",
    image: cybImage,
    href: "/courses/cybersecurity",
  },
];