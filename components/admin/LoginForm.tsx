"use client";

import { ArrowRight, Loader2, LockKeyhole, Mail } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

import { browserClient } from "@/lib/supabase/browser";

export default function LoginForm({ next }: { next: string }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const { error } = await browserClient().auth.signInWithPassword({ email, password });
      if (error) {
        setError(error.message === "Invalid login credentials" ? "Invalid email or password." : error.message);
        return;
      }
      router.push(next);
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-2">
        <label htmlFor="login-email" className="text-sm font-semibold text-[#2b2542]">
          Email address
        </label>
        <div className="relative">
          <Mail className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#7b6aa9]" size={16} />
          <input
            id="login-email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@company.com"
            className="w-full rounded-2xl border border-[#ddd0ff] bg-white px-11 py-3.5 text-base text-[#1d1630] outline-none transition-all placeholder:text-[#8b839f] focus:border-[#5c3ae1] focus:ring-4 focus:ring-[#efe7ff]"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="login-password" className="text-sm font-semibold text-[#2b2542]">
          Password
        </label>
        <div className="relative">
          <LockKeyhole className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#7b6aa9]" size={16} />
          <input
            id="login-password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            className="w-full rounded-2xl border border-[#ddd0ff] bg-white px-11 py-3.5 text-base text-[#1d1630] outline-none transition-all placeholder:text-[#8b839f] focus:border-[#5c3ae1] focus:ring-4 focus:ring-[#efe7ff]"
          />
        </div>
      </div>

      {error && <p className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[linear-gradient(135deg,#4f2ed0_0%,#6a4ae8_100%)] px-6 py-3.5 text-sm font-semibold text-white shadow-[0_16px_28px_rgba(92,58,225,0.28)] transition-all hover:-translate-y-0.5 hover:shadow-[0_18px_30px_rgba(92,58,225,0.34)] active:translate-y-0 disabled:opacity-70"
      >
        {loading ? <Loader2 size={18} className="animate-spin" /> : <ArrowRight size={18} />}
        {loading ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
