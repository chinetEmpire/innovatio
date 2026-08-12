import { Fragment } from "react";
import { Sparkles } from "lucide-react";
import { footerInfo } from "@/data/site";

export default function Footer() {
  return (
    <>
      <footer className="overflow-hidden bg-brand text-white">
        <div className="relative mx-auto max-w-[800px] px-5 pb-4 pt-10">
          <Sparkles className="absolute right-8 top-8 text-yellow-300" size={48} strokeWidth={1.3} />
          <p>Discover the potency of<br />Innovatio Academy at</p>
          <a className="mt-4 block break-words text-[20px] font-bold sm:text-[28px]" href={`mailto:${footerInfo.email}`}>
            {footerInfo.email}
          </a>
          <div className="mt-8 flex flex-col gap-7 text-[8px] sm:flex-row sm:justify-between">
            {footerInfo.columns.map(({ heading, links }) => (
              <p key={heading}>
                <b>{heading}</b>
                {links.map((link) => (
                  <Fragment key={link}>
                    <br />
                    {link}
                  </Fragment>
                ))}
              </p>
            ))}
          </div>
          <p className="mt-7 -mb-7 text-[clamp(92px,22vw,180px)] font-bold leading-none tracking-tighter">Innovatio</p>
        </div>
      </footer>
      <div className="py-2 text-center text-[7px]">{footerInfo.copyright}</div>
    </>
  );
}
