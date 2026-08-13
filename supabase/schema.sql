-- Innovatio Assessment & Course Eligibility System
-- Run this in the Supabase SQL editor (or `supabase db push`).

create extension if not exists "pgcrypto";

create table if not exists public.courses (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  description text not null default '',
  created_at timestamptz not null default now()
);

create table if not exists public.admins (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  name text not null default '',
  created_at timestamptz not null default now()
);

create table if not exists public.assessments (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses(id) on delete cascade,
  title text not null,
  description text not null default '',
  pass_mark int not null default 50,
  duration_minutes int not null default 30,
  max_attempts int, -- NULL = unlimited
  retake_cooldown_hours int not null default 24,
  shuffle_questions boolean not null default true,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.questions (
  id uuid primary key default gen_random_uuid(),
  assessment_id uuid not null references public.assessments(id) on delete cascade,
  text text not null,
  points int not null default 1,
  position int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.choices (
  id uuid primary key default gen_random_uuid(),
  question_id uuid not null references public.questions(id) on delete cascade,
  text text not null,
  is_correct boolean not null default false,
  position int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.applicants (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  full_name text not null,
  whatsapp text not null default '',
  age_bracket text not null default '',
  course_id uuid not null references public.courses(id),
  agreed_to_terms boolean not null default false,
  created_at timestamptz not null default now(),
  unique (email, course_id)
);

create table if not exists public.attempts (
  id uuid primary key default gen_random_uuid(),
  applicant_id uuid not null references public.applicants(id) on delete cascade,
  assessment_id uuid not null references public.assessments(id) on delete cascade,
  status text not null default 'in_progress' check (status in ('in_progress', 'submitted')),
  started_at timestamptz not null default now(),
  submitted_at timestamptz,
  score int,
  passed boolean,
  answers jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists attempts_applicant_idx on public.attempts (applicant_id);
create index if not exists attempts_assessment_idx on public.attempts (assessment_id);
create index if not exists attempts_applicant_assessment_idx on public.attempts (applicant_id, assessment_id);

create table if not exists public.enrollments (
  id uuid primary key default gen_random_uuid(),
  applicant_id uuid not null references public.applicants(id) on delete cascade,
  course_id uuid not null references public.courses(id),
  attempt_id uuid references public.attempts(id) on delete set null,
  payment_status text not null default 'pending' check (payment_status in ('pending', 'paid')),
  created_at timestamptz not null default now(),
  unique (applicant_id, course_id)
);

alter table public.courses enable row level security;
alter table public.admins enable row level security;
alter table public.assessments enable row level security;
alter table public.questions enable row level security;
alter table public.choices enable row level security;
alter table public.applicants enable row level security;
alter table public.attempts enable row level security;
alter table public.enrollments enable row level security;

-- Admins can read their own row (matched by JWT email). Required so the
-- /admin console can verify the signed-in user against the admins table.
-- Applicant-facing data access goes through the service role, which bypasses RLS.
drop policy if exists "Admins can view their own row" on public.admins;
create policy "Admins can view their own row"
  on public.admins
  for select
  using (auth.jwt() ->> 'email' = email);
