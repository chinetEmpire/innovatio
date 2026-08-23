"use client";

import { useState, useTransition } from "react";

import ConfirmDialog from "./ConfirmDialog";
import { useToast } from "./Toasts";

type ConfirmSubmitProps = {
  action: (formData: FormData) => void | Promise<void>;
  confirmMessage: string;
  confirmTitle?: string;
  successMessage?: string;
  fields?: Record<string, string>;
  buttonClassName?: string;
  dataControl?: boolean;
  confirmIf?: boolean;
  tone?: "brand" | "danger";
  children: React.ReactNode;
};

export default function ConfirmSubmit({
  action,
  confirmMessage,
  confirmTitle = "Are you sure?",
  successMessage,
  fields = {},
  buttonClassName,
  dataControl,
  confirmIf = true,
  tone = "danger",
  children,
}: ConfirmSubmitProps) {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const toast = useToast();

  const runAction = () =>
    startTransition(async () => {
      const formData = new FormData();
      Object.entries(fields).forEach(([name, value]) => formData.append(name, value));
      try {
        await action(formData);
        if (successMessage) toast("success", successMessage);
        setOpen(false);
      } catch (err) {
        toast("error", err instanceof Error ? err.message : "Something went wrong. Please try again.");
        setOpen(false);
      }
    });

  const handleClick = () => {
    if (confirmIf) {
      setOpen(true);
    } else {
      runAction();
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        disabled={pending}
        className={`${buttonClassName ?? ""}${pending ? " opacity-60" : ""}`}
        {...(dataControl ? { "data-control": "true" } : {})}
      >
        {children}
      </button>
      <ConfirmDialog
        open={open}
        title={confirmTitle}
        message={confirmMessage}
        confirmLabel="Yes, continue"
        cancelLabel="Cancel"
        tone={tone}
        busy={pending}
        onCancel={() => setOpen(false)}
        onConfirm={runAction}
      />
    </>
  );
}
