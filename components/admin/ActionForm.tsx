"use client";

import { useRef, useTransition } from "react";

import { useToast } from "./Toasts";

type ActionFormProps = {
  action: (formData: FormData) => void | Promise<void>;
  successMessage?: string;
  resetOnSuccess?: boolean;
  onSuccess?: () => void;
  className?: string;
  children: React.ReactNode;
};

export default function ActionForm({
  action,
  successMessage,
  resetOnSuccess = false,
  onSuccess,
  className,
  children,
}: ActionFormProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const [pending, startTransition] = useTransition();
  const toast = useToast();

  return (
    <form
      ref={formRef}
      className={`${className ?? ""}${pending ? " pointer-events-none opacity-70" : ""}`}
      aria-busy={pending}
      onSubmit={(event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
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
      }}
    >
      {children}
    </form>
  );
}
