import { footerInfo } from "@/data/site";

export default function Footer() {
  return (
    <footer className="bg-ink text-white">
      <div className="mx-auto max-w-6xl px-5 py-14 sm:px-8">
        <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
          <div className="max-w-xs">
            <p className="text-lg font-semibold">Innovatio Academy</p>
            <p className="mt-3 text-sm leading-relaxed text-white/65">
              Practical, project-based tech training that gets you hired.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-10">
            {footerInfo.columns.map(({ heading, links }) => (
              <div key={heading}>
                <p className="text-sm font-semibold">{heading}</p>
                <ul className="mt-3 space-y-2.5 text-sm text-white/65">
                  {links.map((link) => (
                    <li key={link}>
                      <a href="#" className="transition-colors hover:text-white">
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="max-w-xs">
            <p className="text-sm font-semibold">Get in touch</p>
            <a
              href={`mailto:${footerInfo.email}`}
              className="mt-3 block text-base font-bold text-white transition-colors hover:text-[#c9b6ff]"
            >
              {footerInfo.email}
            </a>
          </div>
        </div>
        <div className="mt-12 border-t border-white/15 pt-6 text-center text-sm text-white/55">
          {footerInfo.copyright}
        </div>
      </div>
    </footer>
  );
}
