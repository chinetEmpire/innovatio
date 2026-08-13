import type { StaticImageData } from "next/image";
import microsoft from "@/app/images/brands/microsoft.png";
import amazon from "@/app/images/brands/amazon.png";
import dropbox from "@/app/images/brands/dropbox.png";
import seplat from "@/app/images/brands/Seplat.png";
import ibm from "@/app/images/brands/IBM.png";
import paystack from "@/app/images/brands/paystack.png";

export type NavLink = { label: string; href: string; active?: boolean };

export type BrandLogo = { src: StaticImageData | string; alt: string; className?: string };

export const navLinks: NavLink[] = [
  { label: "Home", href: "/" },
  { label: "Courses", href: "/courses" },
  { label: "FAQs", href: "/#faq" },
  { label: "Contact", href: "/#cohort" },
];

export const homeEmployerLogos: BrandLogo[] = [
  { src: microsoft, alt: "Microsoft" },
  { src: amazon, alt: "Amazon" },
  { src: dropbox, alt: "Dropbox" },
  { src: seplat, alt: "Seplat" },
  { src: ibm, alt: "IBM" },
  { src: paystack, alt: "Paystack" },
];

export const companyLogos: BrandLogo[] = [
  { src: microsoft, alt: "Microsoft" },
  { src: dropbox, alt: "Dropbox" },
  { src: seplat, alt: "Seplat" },
  { src: ibm, alt: "IBM" },
  { src: paystack, alt: "Paystack", className: "max-h-9 max-w-[130px]" },
  { src: amazon, alt: "Amazon" },
];

export const footerInfo = {
  email: "info@innovatio.com",
  columns: [
    { heading: "Courses", links: ["FAQs", "Contact us"] },
    { heading: "Follow us", links: ["Facebook", "Instagram", "LinkedIn", "TikTok"] },
  ],
  copyright: "Copyright © 2026 Innovatio Academy",
};
