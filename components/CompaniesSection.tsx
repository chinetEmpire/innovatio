import Image from "next/image";
import amazon from "@/app/images/brands/amazon.png";
import dropbox from "@/app/images/brands/dropbox.png";
import ibm from "@/app/images/brands/IBM.png";
import microsoft from "@/app/images/brands/microsoft.png";
import paystack from "@/app/images/brands/paystack.png";
import seplat from "@/app/images/brands/Seplat.png";

const brands = [
  { src: microsoft, alt: "Microsoft" }, { src: dropbox, alt: "Dropbox" }, { src: seplat, alt: "Seplat" },
  { src: ibm, alt: "IBM" }, { src: paystack, alt: "Paystack", className: "max-h-12 max-w-[140px]" }, { src: amazon, alt: "Amazon" },
];

export default function CompaniesSection() {
  return <section className="pb-14 text-center"><p className="leading-tight">Our grads get great jobs with both<br/>startups and industry giants</p><div className="mx-auto mt-8 grid max-w-[760px] grid-cols-2 items-center justify-items-center gap-x-9 gap-y-7 px-5 sm:grid-cols-3 md:grid-cols-6 md:gap-x-6">{brands.map(({ src, alt, className = "" }) => <Image key={alt} src={src} alt={alt} className={`h-auto max-h-10 w-auto max-w-[130px] object-contain grayscale brightness-75 contrast-125 opacity-90 transition hover:opacity-100 ${className}`} />)}</div></section>;
}
