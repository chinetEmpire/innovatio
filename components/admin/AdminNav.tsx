"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  { label: "Dashboard", href: "/admin" },
  { label: "Assessments", href: "/admin/assessments" },
  { label: "Applicants", href: "/admin/applicants" },
  { label: "Payments", href: "/admin/payments" },
];

function isActive(pathname: string, href: string) {
  return href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);
}

export default function AdminNav({ variant }: { variant: "desktop" | "mobile" }) {
  const pathname = usePathname();

  if (variant === "desktop") {
    return (
      <nav className="hidden items-stretch gap-6 text-sm font-medium md:flex">
        {navLinks.map((link) => {
          const active = isActive(pathname, link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              aria-current={active ? "page" : undefined}
              className={`flex h-16 items-center border-b-2 transition-colors ${
                active
                  ? "border-brand font-semibold text-brand"
                  : "border-transparent text-ink/70 hover:text-brand"
              }`}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>
    );
  }

  return (
    <nav className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-5 gap-y-2 px-5 pb-3 pt-1 text-sm font-medium md:hidden">
      {navLinks.map((link) => {
        const active = isActive(pathname, link.href);
        return (
          <Link
            key={link.href}
            href={link.href}
            aria-current={active ? "page" : undefined}
            className={`transition-colors ${
              active
                ? "font-semibold text-brand underline decoration-2 underline-offset-4"
                : "text-ink/70 hover:text-brand"
            }`}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
