"use client";

import { useEffect } from "react";

type ConfirmDialogProps = {
  open: boolean;
  title: string;
  message?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  tone?: "brand" | "danger";
  busy?: boolean;
  busyLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
};

export default function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  tone = "danger",
  busy = false,
  busyLabel = "Working…",
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onCancel();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, onCancel]);

  if (!open) return null;

  return (
    <div
      className="animate-fade-in fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-5 backdrop-blur-sm"
      onClick={() => {
        if (!busy) onCancel();
      }}
      role="presentation"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-dialog-title"
        className="w-full max-w-md rounded-2xl border border-[#e9e2f5] bg-white p-6 shadow-[0_24px_48px_rgba(47,31,101,0.16)]"
        onClick={(event) => event.stopPropagation()}
      >
        <h2 id="confirm-dialog-title" className="text-lg font-bold text-ink">
          {title}
        </h2>
        {message && <p className="mt-2 text-sm leading-relaxed text-[#5f5b65]">{message}</p>}
        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            data-control="true"
            onClick={onCancel}
            disabled={busy}
            className="rounded-full border border-[#e2d9f2] px-4 py-2 text-sm font-semibold text-ink transition-colors hover:border-brand hover:text-brand disabled:opacity-60"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            data-control="true"
            onClick={onConfirm}
            disabled={busy}
            className={`rounded-full px-4 py-2 text-sm font-semibold text-white transition-transform hover:scale-[1.02] active:scale-95 disabled:scale-100 disabled:opacity-70 ${
              tone === "danger" ? "bg-red-600" : "bg-brand"
            }`}
          >
            {busy ? busyLabel : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
