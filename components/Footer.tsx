import { Fragment } from "react";
import Image from "next/image";

import footImage from "@/app/images/foot.png";
import vectorImage from "@/app/images/Vector.png";
import { footerInfo } from "@/data/site";

export default function Footer() {
  return (
    <>
      <footer className="overflow-hidden bg-brand text-white">
        <div className="relative px-5 pb-0 pt-10 sm:px-8 lg:px-[4.2%]">
          <Image src={footImage} alt="" aria-hidden className="absolute top-8 h-4 w-10 object-contain" />
          <Image src={vectorImage} alt="" aria-hidden className="absolute right-8 top-8 h-32 w-32 object-contain" />
          <p className="pt-16">Discover the potency of<br />Innovatio Academy at</p>
          <a
            className="mt-4 block w-fit break-words border-b border-white pb-1 font-black"
            href={`mailto:${footerInfo.email}`}
            style={{ fontSize: "clamp(28px, 8vw, 60px)" }}
          >
            {footerInfo.email}
          </a>
          <div className="mt-8 flex flex-col gap-7 text-[8px] sm:flex-row sm:justify-between">
            {footerInfo.columns.map(({ heading, links }) => (
              <p key={heading}>
                <b>{heading}</b>
                {links.map((link) => (
                  <Fragment key={link.label}>
                    <br />
                    <a
                      href={link.href}
                      target={link.external ? "_blank" : undefined}
                      rel={link.external ? "noopener noreferrer" : undefined}
                      className="transition-opacity hover:opacity-80 hover:underline"
                    >
                      {link.label}
                    </a>
                  </Fragment>
                ))}
              </p>
            ))}
          </div>
          <svg
            viewBox="0 0 660 152"
            preserveAspectRatio="none"
            aria-hidden="true"
            className="mt-7 block h-auto w-full"
          >
            <text
              x="0"
              y="151"
              fill="currentColor"
              fontSize="152"
              fontWeight="900"
              letterSpacing="-4"
              textLength="660"
              lengthAdjust="spacingAndGlyphs"
            >
              InnovatiO
            </text>
          </svg>
        </div>
      </footer>
      <div className="py-2 text-center text-[7px]">{footerInfo.copyright}</div>
    </>
  );
}
