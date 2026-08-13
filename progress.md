# Innovatio Academy — Project Progress

## Project Overview
Assessment & course eligibility system for Innovatio Academy, built on Next.js 15 + Supabase.

- Repo: `https://github.com/chinetEmpire/innovatio` (branch `main`)
- Stack: Next.js 15.1.11, `@supabase/ssr ^0.12.4`, `@supabase/supabase-js ^2.112.3`, `tsx` (dev), Tailwind, lucide-react
- Supabase project ref: `kpyhtjuyawudkhlnnrrl` (URL `https://kpyhtjuyawudkhlnnrrl.supabase.co`)

---

## Environment & Credentials
- Env vars (in `.env.local`, now gitignored):
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `SUPABASE_SERVICE_ROLE_KEY`
  - `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `ADMIN_NAME`
  - `PAYSTACK_SECRET_KEY` (test or live — user supplies)
- Admin login: `admin@innocatio.com` / `Admin@123#`

---

## What We Have Done

### 1. Applicant Flow (public)
- `app/apply/page.tsx` — application start page (name, email, WhatsApp, age bracket, course selection) → posts to `/api/apply/start`.
- `app/apply/[course]/assessment/page.tsx` — assessment runner with:
  - countdown timer (assessment duration),
  - optional question shuffling,
  - max-attempts + retake-cooldown enforcement,
  - answers auto-saved/auto-submitted.
- `app/apply/[course]/register/page.tsx` — registration/collection step after passing.
- `app/apply/[course]/result/page.tsx` — result page (pass/fail), links to register or retry.
- API routes: `/api/apply/start`, `/api/apply/submit`, `/api/apply/register`.
- All applicant data flows through the **service-role client** (`lib/supabase/admin.ts`), bypassing RLS by design.
- Client components: `components/apply/ApplyForm.tsx`, `AssessmentRunner.tsx`, `RegisterForm.tsx`.

### 2. Admin Console
- Route structure (guarded pages live inside a route group to avoid a redirect loop with `requireAdmin`):
  - `app/admin/login/page.tsx` — public login (force-dynamic).
  - `app/admin/(shell)/layout.tsx`, `page.tsx` — layout/nav + dashboard.
  - `app/admin/(shell)/assessments/page.tsx` + `[id]/page.tsx` — assessments CRUD, question bank.
  - `app/admin/(shell)/applicants/page.tsx` + `[id]/page.tsx` — applicants list + detail with "Mark as paid".
- Auth: `lib/admin.ts` (`getAdminSession`/`requireAdmin`), `middleware.ts` guards `/admin/:path*`.
- Server actions: `app/admin/actions.ts` (assessment/question/enrollment mutations, logout).
- `components/admin/ConfirmSubmit.tsx` — confirm-on-delete form wrapper.
- `components/admin/LoginForm.tsx` — sign-in form (redesigned UI).
- `lib/format.ts` — `formatDate` / `formatDateTime` (en-NG locale).
- Dashboard: stat cards (total applicants, assessments submitted, pass rate, eligible for payment), performance-by-course table, recent assessments table.
- **Responsive on mobile**: tables scroll horizontally; detail rows stack; mobile nav wraps.

### 3. Homepage CTA Routing
- All "Enroll now" / "Apply now" buttons (Header ×2, HomeHero, WhatSetsUsApart, NextCohort) now route to `/apply`.

### 4. Payment (Paystack) — wired into the apply flow
- Config source of truth: `data/paymentOptions.ts` — `paymentPlans` (keys `upfront`/`instalments` + `amountKobo`) and `coursePrices` (slug → ₦). Both courses ₦350,000; upfront plan ₦350k, instalments first payment ₦212,500.
- `lib/paystack.ts` — Paystack client: `initializeTransaction`, `verifyTransaction`, `verifyWebhookSignature` (SHA512 HMAC). Reads `PAYSTACK_SECRET_KEY`; never exposed client-side.
- API routes:
  - `POST /api/paystack/initialize` — takes `{ enrollmentId, planKey }`, validates enrollment is `pending`, stores `plan_key`/`amount_kobo`/`payment_reference`, returns Paystack `authorization_url`.
  - `POST /api/paystack/webhook` — HMAC-verified; `charge.success` → `paid` + `paid_at`; `charge.failed` → `failed` (idempotent).
  - `GET /api/paystack/verify` — fallback verify by reference (used by the verify page); persists `paid` or `failed`/`abandoned`.
- `app/payment/page.tsx` — async server page keyed by `?enrollment=<id>`: no/invalid id → redirect `/apply`; already paid → success panel; else renders client `PaymentPage`.
- `components/PaymentPage.tsx` — stateful client UI: course **locked to the enrolled course**, plan cards drive the "Due now" summary, "Proceed to payment" → initialize → redirect to Paystack.
- `app/payment/verify/page.tsx` — success / "not confirmed" / processing panels after return from Paystack; server-side verifies and updates the row.
- `components/apply/RegisterForm.tsx` — success screen now has a **"Proceed to payment"** button → `/payment?enrollment=<id>`.
- Admin **Payments tab** (`/admin/payments`) — stat cards + allowlist-filter tabs (`?status=all|paid|pending|failed`, server-side query) + mobile-scrollable table: student → applicant detail, course, plan, amount due, status badge (green/amber/red), Paystack reference, dates.
- Admin applicant detail — shows plan, amount due now, Paystack reference, paid-at, and who marked it paid (`paid_by`); red **Failed** badge; manual "Mark as paid" shown for pending AND failed (one-way → paid, audited with `paid_at` + `paid_by`).
- Homepage `/courses` section: `PaymentOptions` + `data/paymentOptions.ts` (static branding cards).

### 5. Database & Seeding
- `supabase/schema.sql` — source of truth: tables + RLS + enrollment payment columns (`plan_key`, `amount_kobo`, `currency`, `payment_reference`, `paid_at`, `paid_by`) + `payment_status` check allows `('pending','paid','failed')`.
- RLS: enabled on all tables; only policy is `"Admins can view their own row"` (self-select by JWT email). Applicant/assessment data goes through service role, so no policies needed for it.
- `scripts/seed.ts` (`npm run seed`) — idempotent: creates courses (`software-engineering`, `cybersecurity`), 2 assessments × 5 MCQs, admin auth user + `admins` row (id aligned to auth user id).

### 6. Fixes / Root Causes Resolved
- Admin redirect loop → moved guarded pages into `app/admin/(shell)/` so `/admin/login` is not wrapped by `requireAdmin()`.
- Admin "fetched page but not loading" → **RLS with zero policies denies everything**. `getAdminSession`'s `admins` lookup returned `null`. Fixed by adding the admins self-select RLS policy to `schema.sql`. **Still needs applying to the live Supabase DB.**
- `.env.local` formatting normalized; `.gitignore` updated to exclude `.env`/`.env.*` (keep `.env.example`).
- Build fixes: cached service-client variable, supabase type-inference casts, `position` on choices, register route `courseSlug`, flat `StartResponse` union, `force-dynamic` login page.
- Stale `.next` cache causing "Cannot find module for page: /admin/applicants/[id]" → fixed by clearing `.next` and rebuilding.

### 7. Git History (main, all pushed)
- `a4848f6` Add assessment system and admin console
- `f27bec9` Add seed script, protect env secrets, wire seed npm script
- `7075382` Fix admin redirect loop (route group)
- `413d339` Add admins RLS policy + id alignment
- `aea2fdf` Route Enroll/Apply CTAs to the apply flow
- `e402a17` Make admin console responsive on mobile
- `a725400` Redesign admin login page

---

## Current State / Blockers
- **Live DB still needs two SQL steps in the Supabase editor** (see below): the admins RLS policy AND the new enrollment payment columns.
- Everything else builds (`npm run build` passes) and is pushed.

### Run in Supabase SQL editor (in order):
```sql
-- 1) Admins self-select RLS policy (required for /admin after login)
drop policy if exists "Admins can view their own row" on public.admins;
create policy "Admins can view their own row"
  on public.admins
  for select
  using (auth.jwt() ->> 'email' = email);

-- 2) Enrollment payment columns (idempotent)
alter table public.enrollments
  add column if not exists plan_key text,
  add column if not exists amount_kobo int,
  add column if not exists currency text not null default 'NGN',
  add column if not exists payment_reference text,
  add column if not exists paid_at timestamptz,
  add column if not exists paid_by text;

-- 3) Allow 'failed' payment status (idempotent)
alter table public.enrollments
  drop constraint if exists enrollments_payment_status_check;
alter table public.enrollments
  add constraint enrollments_payment_status_check
    check (payment_status in ('pending', 'paid', 'failed'));
```

### Then to finish wiring payments:
1. Add `PAYSTACK_SECRET_KEY` (test key for now) to `.env.local`, restart `npm run dev`.
2. Test end-to-end with Paystack test card `4084 0840 8408 4081`, CVV `408`, any future expiry. Use a failing card / expired date to confirm the **Failed** state appears in `/admin/payments`.
3. **Production webhook**: in the Paystack dashboard, set the webhook URL to `https://innovatio-silk.vercel.app/api/paystack/webhook` (site is already deployed to Vercel). For local testing use `ngrok` against `http://localhost:3000/api/paystack/webhook` — in local dev the verify-on-return page covers the flow without a webhook.
4. Deploy is already live at `https://innovatio-silk.vercel.app`; `main` pushes auto-deploy via Vercel.

---

## Next Phase (Roadmap)
1. **Apply the SQL steps above to the live DB** (RLS policy + enrollment columns) and verify admin login end-to-end (blocker).
2. **Add PAYSTACK_SECRET_KEY to `.env.local`** and test a real Paystack checkout end-to-end (test card `4084 0840 8408 4081`); verify enrollment flips to `paid` in admin.
3. **Configure the Paystack webhook URL** (`/api/paystack/webhook`) once deployed.
4. **Switch to live Paystack keys** and set a max-amount sanity check per plan when ready to take real payments.
5. **Email notifications** — notify applicant of pass/fail and payment confirmation, notify admin of new applications.
6. **Applicant filtering/search** — filter by course, status, age bracket; pagination on the applicants table.
7. **Assessment analytics** — per-question difficulty/answer breakdown on the dashboard.
8. **Public site polish** — real cohort dates, testimonials/counts wired to real data, course detail pages.
9. **Deployment** — Vercel deploy, env vars in production, custom domain.
10. **Tests** — add unit/integration tests for API routes, admin actions, and Paystack webhook signature handling.
