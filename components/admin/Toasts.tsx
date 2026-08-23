"use client";

import { createContext, useCallback, useContext, useRef, useState } from "react";
import { CheckCircle2, XCircle } from "lucide-react";

type ToastKind = "success" | "error";

type Toast = { id: number; kind: ToastKind; message: string };

const ToastContext = createContext<(kind: ToastKind, message: string) => void>(() => {});

export function useToast() {
  return useContext(ToastContext);
}

export default function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const nextId = useRef(0);

  const push = useCallback((kind: ToastKind, message: string) => {
    const id = ++nextId.current;
    setToasts((current) => [...current, { id, kind, message }]);
    setTimeout(() => {
      setToasts((current) => current.filter((toast) => toast.id !== id));
    }, 4500);
  }, []);

  const dismiss = useCallback((id: number) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={push}>
      {children}
      <div className="pointer-events-none fixed right-5 top-20 z-[120] flex w-full max-w-sm flex-col gap-3">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            role="status"
            className={`animate-fade-in pointer-events-auto flex items-start gap-3 rounded-2xl border bg-white p-4 shadow-[0_24px_48px_rgba(47,31,101,0.16)] ${
              toast.kind === "success" ? "border-green-200" : "border-red-200"
            }`}
          >
            {toast.kind === "success" ? (
              <CheckCircle2 className="mt-0.5 shrink-0 text-green-600" size={20} />
            ) : (
              <XCircle className="mt-0.5 shrink-0 text-red-500" size={20} />
            )}
            <p className="flex-1 text-sm font-medium leading-relaxed text-ink">{toast.message}</p>
            <button
              type="button"
              data-control="true"
              onClick={() => dismiss(toast.id)}
              className="-m-1 shrink-0 rounded-full p-1 text-sm text-[#8a8493] transition-colors hover:text-ink"
              aria-label="Dismiss notification"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
