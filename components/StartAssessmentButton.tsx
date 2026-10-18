"use client";

import Link from "next/link";
import { Loader2 } from "lucide-react";
import { useLinkStatus } from "next/link";

function ButtonLabel() {
  const { pending } = useLinkStatus();

  return (
    <span className="inline-flex items-center gap-2">
      {pending && <Loader2 size={18} className="animate-spin" />}
      {pending ? "Starting…" : "Start assessment"}
    </span>
  );
}

export default function StartAssessmentButton() {
  return (
    <Link
      href="/apply"
      className="inline-flex items-center justify-center rounded-[50px] bg-[#4e2cda] px-10 py-3 text-[15px] font-bold text-white shadow-[0_12px_20px_rgba(78,44,218,0.28)] transition-transform hover:translate-y-[-1px]"
    >
      <ButtonLabel />
    </Link>
  );
}
