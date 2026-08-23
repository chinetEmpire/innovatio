"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

import { useToast } from "./Toasts";

type ActionFormProps = {
  action: (formData: FormData) => void | Promise<void>;
  successMessage?: string;
  resetOnSuccess?: boolean;
  onSuccess?: () => void;
  className?: string;
  confirmTitle?: string;
  confirmMessage?: string;
  confirmLabel?: string;
  children: React.ReactNode;
};

export default function ActionForm({
  action,
  successMessage,
  resetOnSuccess = false,
  onSuccess,
  className,
  confirmTitle,
  confirmMessage,
  confirmLabel = "Confirm",
  children,
}: ActionFormProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const [pending, startTransition] = useTransition();
  const [confirming, setConfirming] = useState(false);
  const toast = useToast();

  const needsConfirmation = Boolean(confirmTitle || confirmMessage);

  useEffect(() => {
    if (!confirming) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setConfirming(false);
    };
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [confirming]);

  function runAction() {
    const formData = new FormData(formRef.current ?? undefined);
    startTransition(async () => {
      try {
        await action(formData);
        if (successMessage) toast("success", successMessage);
        if (resetOnSuccess) formRef.current?.reset();
        onSuccess?.();
      } catch (err) {
        toast("error", err instanceof Error ? err.message : "Something went wrong. Please try again.");
      }
    });
  }

  return (
    <>
      <form
        ref={formRef}
        className={`${className ?? ""}${pending ? " pointer-events-none opacity-70" : ""}`}
        aria-busy={pending}
        onSubmit={(event) => {
          event.preventDefault();
          if (needsConfirmation) {
            setConfirming(true);
            return;
          }
          runAction();
        }}
      >
        {children}
      </form>

      {confirming &&
        createPortal(
          <div
            className="fixed inset-0 z-[100] flex items-end justify-center px-4 pb-4 sm:items-center sm:p-6"
            role="dialog"
            aria-modal="true"
            aria-label={confirmTitle}
          >
            <div
              className="animate-fade-in absolute inset-0 bg-[#17131f]/60 backdrop-blur-sm"
              onClick={() => setConfirming(false)}
            />
            <div className="animate-modal-in relative z-10 w-full max-w-md rounded-2xl border border-[#ece6f6] bg-white p-6 shadow-[0_24px_48px_rgba(24,10,64,0.3)] sm:p-8">
              <button
                type="button"
                onClick={() => setConfirming(false)}
                aria-label="Close dialog"
                className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full text-ink/60 transition-colors hover:bg-brand/10 hover:text-brand"
              >
                <X size={20} />
              </button>
              <h2 className="pr-8 text-xl font-bold tracking-tight">{confirmTitle}</h2>
              <p className="mt-2 text-sm leading-relaxed text-[#5f5b65]">{confirmMessage}</p>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row-reverse">
                <button
                  type="button"
                  data-control
                  onClick={() => {
                    setConfirming(false);
                    runAction();
                  }}
                  className="w-full rounded-full bg-green-600 px-4 py-1.5 text-xs font-semibold text-white transition-transform hover:scale-[1.02] active:scale-95 disabled:opacity-60 sm:w-auto"
                >
                  {confirmLabel}
                </button>
                <button
                  type="button"
                  data-control
                  onClick={() => setConfirming(false)}
                  className="w-full rounded-full border border-[#e2d9f2] px-4 py-1.5 text-xs font-semibold text-ink transition-colors hover:border-brand hover:text-brand sm:w-auto"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
