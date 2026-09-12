"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Props = {
  href: string;
  cooldownMs: number;
  maxAttemptsReached: boolean;
};

function formatDuration(milliseconds: number) {
  const totalHours = Math.ceil(milliseconds / (60 * 60 * 1000));
  return `${totalHours} hour${totalHours === 1 ? "" : "s"}`;
}

export default function RetakeAssessmentAction({ href, cooldownMs, maxAttemptsReached }: Props) {
  const [availableAt] = useState(() => Date.now() + Math.max(0, cooldownMs));
  const [remaining, setRemaining] = useState(() => Math.max(0, availableAt - Date.now()));

  useEffect(() => {
    if (remaining <= 0) return;
    const timer = window.setInterval(() => setRemaining(Math.max(0, availableAt - Date.now())), 1_000);
    return () => window.clearInterval(timer);
  }, [availableAt, remaining]);

  const isLocked = maxAttemptsReached || remaining > 0;
  const note = maxAttemptsReached
    ? "Note: You have used all available assessment attempts."
    : remaining > 0
      ? `Note: This button will be active after ${formatDuration(remaining)}.`
      : "You can now retake the assessment when you are ready.";

  if (!isLocked) {
    return (
      <div className="mt-10">
        <Link href={href} className="inline-flex rounded-full bg-brand px-8 py-4 text-base font-bold text-white shadow-[0_10px_22px_rgba(84,41,208,0.3)] transition-transform hover:scale-[1.03] active:scale-95 sm:text-lg">
          Retake assessment
        </Link>
        <p className="mt-3 text-sm text-[#6f6878]">{note}</p>
      </div>
    );
  }

  return (
    <div className="mt-10">
      <button type="button" disabled aria-describedby="retake-note" className="cursor-not-allowed rounded-full bg-[#b8a5e7] px-8 py-4 text-base font-bold text-white sm:text-lg">
        Retake assessment
      </button>
      <p id="retake-note" className="mt-3 text-sm text-[#6f6878]">{note}</p>
    </div>
  );
}
