# Innovatio Academy — Project Progress

## Project Overview
Assessment & course eligibility system for Innovatio Academy, built on Next.js 15 + Supabase.

- Repo: `https://github.com/chinetEmpire/innovatio` (branch `main`)
- Stack: **Next.js 16.3.0** (Turbopack, upgraded from 15.1.11), `@supabase/ssr ^0.12.4`, `@supabase/supabase-js ^2.112.3`, `tsx` (dev), Tailwind, lucide-react, `sharp`
- Supabase project ref: `kpyhtjuyawudkhlnnrrl` (URL `https://kpyhtjuyawudkhlnnrrl.supabase.co`)
- Live deployment: `https://innovatio-silk.vercel.app` (Vercel, auto-deploys from `main` pushes)

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
- Auth: `lib/admin.ts` (`getAdminSession`/`requireAdmin`), `proxy.ts` (Next 16's middleware replacement) refreshes Supabase sessions and guards `/admin/:path*`.
- Server actions: `app/admin/actions.ts` (assessment/question/enrollment mutations, logout).
- `components/admin/ConfirmSubmit.tsx` — confirm-on-delete form wrapper.
- `components/admin/LoginForm.tsx` — sign-in form (redesigned UI).
- `lib/format.ts` — `formatDate` / `formatDateTime` (en-NG locale).
- Dashboard: stat cards (total applicants, assessments submitted, pass rate, eligible for payment), performance-by-course table, recent assessments table.
- **Responsive on mobile**: tables scroll horizontally; detail rows stack; mobile nav wraps.

### 3. Enroll Landing Page + CTA Routing
- `app/enroll/page.tsx` + `components/EnrollNowPage.tsx` — public "Ready to Get Started?" landing page: explains the assessment (10–30 min, MCQ, no payment yet, unlimited attempts within 1hr interval), links to `/apply` to start.
- All "Enroll now" / "Apply now" CTAs (Header ×2, HomeHero, WhatSetsUsApart, NextCohort) route to `/enroll` → which leads into `/apply` → assessment → register → `/payment`.

### 3b. Framework / UI Fixes
- **Next.js 16.3.0 upgrade** (build verified green): `next` ^16.3.0, `postcss` ^8.5.26, added `sharp`, expanded `tsconfig.json` (`jsx: react-jsx`, `.next/dev/types`). Note: Next 16 deprecates the `middleware.ts` convention → `proxy` (admin guard still works; migration is a future cleanup via `npx @next/codemod@canary middleware-to-proxy`).
- **Official logo fix**: `/enroll` and `/payment` headers now render the real `logo.png` image (was a ◢ text glyph) and link home, matching the main site header.
- **Footer links are clickable** (`components/Footer.tsx` + `data/site.ts`): FAQs → `/#faq`, Contact us → `mailto:info@innovatio.com`, socials → external placeholder URLs (open in new tab, `noopener noreferrer`). Social handles are placeholders — update in `data/site.ts`.

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
- `e841e16` Wire Paystack payments into the apply flow
- `2a65f42` Swap site font to Lato and tighten hero headline weight
- `b591165` Add admin Payments tab with paid/pending/failed monitoring
- `01a0232` Add enroll landing page and route CTAs to /enroll; upgrade to Next.js 16
- `aa723c4` Update enroll page assessment expectations
- `3be103f` Use official Innovatio logo on enroll and payment page headers
- `439a2f5` Make footer links clickable
- `f8086bd` Use innovate image on About section and save progress notes
- `17a7fc4` Update components and rename middleware to proxy
- `b852d4d` Restore normal button sizes on admin assessments page
- `594bf09` Add testimonials carousel and polish learning tracks and cohort steps
- `b80a499` Add cybersecurity course page, courses nav dropdown, and course picker modal
- `2681971` Add admin action feedback, applicant management, and active nav state
- `2712ed3` Add single-flow assessment builder, confirm dialogs, and compact admin buttons
- `87eae62` Harden attempt ownership, payment verification, and security headers

### 8. Site imagery
- Homepage About section image swapped from `use.png` → `innovate.png` (old file deleted; `components/About.tsx` import updated).

### 9. Admin UX pass — action feedback, applicant management, active nav (commit `2681971`)
- **Toast system** (`components/admin/Toasts.tsx` + `ActionForm.tsx` + `ConfirmDialog.tsx`): success/error toasts (auto-dismiss ~4.5s, manual dismiss, pending dimming) mounted in the admin shell layout. Every admin action now reports its outcome:
  - Assessments page: create, edit settings (converted from raw server-action form), activate/deactivate (state-aware message), delete.
  - Assessment detail: add question (form resets), update question, delete question.
  - Applicant detail: mark-as-paid → "Enrollment marked as paid successfully."
  - Server actions (`app/admin/actions.ts`) now check Supabase `{ error }` everywhere and throw, so failed DB writes show an error toast instead of a false success.
- **Applicant row actions** (`components/admin/ApplicantRowActions.tsx` + new column on `/admin/applicants`): View (→ detail page), Edit (modal dialog updating name/email/WhatsApp/age bracket/course via new `updateApplicantAction`), Delete (confirm dialog warns attempts/enrollments cascade; new `deleteApplicantAction`). Courses fetched server-side for the edit dropdown. `ActionForm` gained an optional `onSuccess` callback so dialogs close themselves after a successful save.
- **Active nav state**: `components/admin/AdminNav.tsx` (client, `usePathname`) renders desktop tabs with brand color + 2px underline sitting on the header border, and a mobile row variant with brand color + underline. `/admin` matches exactly; other sections match by prefix so sub-pages keep their tab highlighted. `aria-current="page"` set on the active link.
- **Results privacy fix** (`app/apply/[course]/result/page.tsx`): removed the "Review your answers" block entirely — students now see only pass/fail banner, score/percentage/pass mark, and next-step actions. The page query fetches only `points` (no question text or choices are sent). During the test itself answers were already protected (`toSafeQuestions` strips `is_correct`).
- Repo hygiene: `.opencode/` (local tooling state incl. node_modules) added to `.gitignore`.
- Ops note: running `npm run build` while `npm run dev` is serving corrupts the shared `.next` dir and breaks the dev server — fixed by killing the dev process, deleting `.next`, and restarting `npm run dev`.

### 10. Assessment builder, admin UX polish, security hardening (commits `2712ed3` + `87eae62`)
- **Single-flow assessment creation** (`components/admin/AssessmentBuilder.tsx`): replaced "create assessment then add questions later" with one form on `/admin/assessments` — settings grid (course, title, pass mark, duration, max attempts, cooldown, shuffle) plus a dynamic question builder (add/remove questions; 2–6 choices each with radio for the correct answer; per-question points). Nothing is saved until submit: new `createAssessmentWithQuestionsAction` validates everything first (≥1 question, ≥2 non-empty choices each, exactly one correct), inserts assessment → questions → choices, and best-effort deletes the assessment if any insert fails. New assessments are created **inactive** (activate via the list page). Form resets to a fresh state after success. `/admin/assessments/[id]` unchanged for managing questions after creation.
- **Confirm-before-action dialogs**: "Mark as paid" now always opens a styled confirmation popup before running. `ActionForm` gained optional `confirmTitle` / `confirmMessage` / `confirmLabel` props — when set it intercepts submit and shows a portal modal (backdrop click, Escape, and X all close) that reuses the existing action + toast flow. Reusable for other destructive admin actions.
- **Compact admin buttons**: site-wide hero-pill CSS (`globals.css`) was inflating buttons without `data-control`. Added a scoped `.admin-shell button:not([data-control])` override (root class added in `(shell)/layout.tsx`) restoring default compact sizing (auto height, no min-width, 16px/10px padding, 14px font) across every admin page.
- **Assessment runner padding** reduced for choice options, Previous/Next, and Submit; "Add question" moved next to "Create assessment" at the bottom of the builder.
- **Security hardening** (commit `87eae62`):
  - Attempt ownership: `/api/apply/start` grants an HttpOnly cookie (`lib/attempts.ts`) on start/resume; `/api/apply/submit` rejects attempts not granted to the browser (403), enforces the deadline server-side (`started_at + duration_minutes` + 30s grace — previously timer was client-only), and revokes the grant after submission. The assessment page also redirects non-owners instead of serving them questions.
  - Paystack verify: `GET /api/paystack/verify` now requires the reference to match `enrollments.payment_reference` (403 otherwise) — prevents confirming/failing one person's enrollment using another's payment reference. Webhook already looked up by reference and was safe.
  - Profile hijack fix: applicant upsert switched to `ignoreDuplicates: true` so re-submitting the apply form can no longer overwrite an existing application (name/WhatsApp/age) or consume their attempts.
  - PII trim: `/api/apply/register` response no longer returns WhatsApp number or age bracket (`RegisterForm` updated to match).
  - Security headers via new `next.config.ts`: HSTS (2y, includeSubDomains, preload), `X-Content-Type-Options`, `X-Frame-Options: DENY`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy`.
  - Review notes: `.env` files untracked, `npm audit` clean, webhook signature HMAC-verified against raw body, payment amounts checked against ledger, all admin actions call `requireAdmin()`. Deferred: rate limiting/captcha on public endpoints (needs Redis/Upstash or similar).

---

## Current State / Blockers
- **Live Supabase DB still needs the SQL steps below** (admins RLS policy + enrollment payment columns + `failed` status constraint). Until run: `/admin` login fails (RLS denies the `admins` lookup) and Paystack payments can't record plan/amount/`failed` status.
- Everything else builds (`npm run build` passes) and is pushed/deployed.
- `PAYSTACK_SECRET_KEY` not yet added to `.env.local` (user action).

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
1. **Apply the SQL steps above to the live Supabase DB** and verify admin login + payments end-to-end (blocker — highest priority).
2. **Add `PAYSTACK_SECRET_KEY` to `.env.local`** (and Vercel env for prod) and test a real Paystack checkout (test card `4084 0840 8408 4081`); confirm enrollment flips to `paid` and shows in `/admin/payments`.
3. **Configure the Paystack webhook URL** → `https://innovatio-silk.vercel.app/api/paystack/webhook` (required for reliable paid/failed capture in production).
4. **Rate limiting / captcha** on public endpoints (`/api/apply/start`, `/register`, admin login) — needs a store (Redis/Upstash) added to the stack first.
5. **Real social media URLs** in `data/site.ts` footer.
6. **Switch to live Paystack keys** and add a max-amount sanity check per plan when ready to take real payments.
7. **Email notifications** — notify applicant of pass/fail and payment confirmation, notify admin of new applications.
8. **Applicant filtering/search** — filter by course, status, age bracket; pagination on the applicants table.
9. **Assessment analytics** — per-question difficulty/answer breakdown on the dashboard.
10. **Public site polish** — real cohort dates, testimonials/counts wired to real data, course detail pages.
11. **Tests** — unit/integration tests for API routes, admin actions, and Paystack webhook signature handling.
