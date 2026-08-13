import { readFileSync, existsSync } from "node:fs";
import path from "node:path";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

function loadEnvFile(file: string) {
  if (!existsSync(file)) return;
  const content = readFileSync(file, "utf8");
  for (const line of content.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    if (!(key in process.env)) process.env[key] = value;
  }
}

loadEnvFile(path.join(process.cwd(), ".env.local"));

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const adminEmail = process.env.ADMIN_EMAIL;
const adminPassword = process.env.ADMIN_PASSWORD;
const adminName = process.env.ADMIN_NAME ?? "Admin";

if (!url || !serviceKey || !adminEmail || !adminPassword) {
  console.error(
    "Missing env vars. Required in .env.local: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, ADMIN_EMAIL, ADMIN_PASSWORD"
  );
  process.exit(1);
}

const cfg = {
  url,
  serviceKey,
  adminEmail,
  adminPassword,
  adminName: adminName ?? "Admin",
};

const sb = createClient(cfg.url, cfg.serviceKey, { auth: { persistSession: false } });

type ChoiceSeed = { text: string; correct?: boolean };
type QuestionSeed = { text: string; points?: number; choices: ChoiceSeed[] };

type AssessmentSeed = {
  courseSlug: string;
  title: string;
  description: string;
  passMark: number;
  durationMinutes: number;
  maxAttempts: number | null;
  retakeCooldownHours: number;
  shuffleQuestions: boolean;
  questions: QuestionSeed[];
};

const courseSeeds = [
  {
    slug: "software-engineering",
    title: "Software Engineering",
    description: "Learn to build full-stack applications with modern tools.",
  },
  {
    slug: "cybersecurity",
    title: "Cyber Security",
    description: "Learn to protect systems, networks, and data from threats.",
  },
];

const assessmentSeeds: AssessmentSeed[] = [
  {
    courseSlug: "software-engineering",
    title: "Software Engineering Readiness Assessment",
    description: "A short assessment to gauge your readiness for the Software Engineering program.",
    passMark: 50,
    durationMinutes: 30,
    maxAttempts: 3,
    retakeCooldownHours: 24,
    shuffleQuestions: true,
    questions: [
      {
        text: "Which language is primarily used to add interactivity to web pages?",
        choices: [
          { text: "Java" },
          { text: "JavaScript", correct: true },
          { text: "Python" },
          { text: "C++" },
        ],
      },
      {
        text: "What does HTML stand for?",
        choices: [
          { text: "HyperText Markup Language", correct: true },
          { text: "HighText Machine Language" },
          { text: "Hyperlinks and Text Markup Language" },
          { text: "Home Tool Markup Language" },
        ],
      },
      {
        text: "Which of the following is a frontend JavaScript library?",
        choices: [
          { text: "React", correct: true },
          { text: "Node.js" },
          { text: "Express" },
          { text: "MongoDB" },
        ],
      },
      {
        text: "What does REST stand for in REST API?",
        choices: [
          { text: "Representational State Transfer", correct: true },
          { text: "Remote Execution Standard Transfer" },
          { text: "Random Access State Transfer" },
          { text: "Resource Endpoint Service Tool" },
        ],
      },
      {
        text: "Which SQL statement is used to retrieve data from a database?",
        choices: [
          { text: "SELECT", correct: true },
          { text: "INSERT" },
          { text: "DELETE" },
          { text: "UPDATE" },
        ],
      },
    ],
  },
  {
    courseSlug: "cybersecurity",
    title: "Cyber Security Readiness Assessment",
    description: "A short assessment to gauge your readiness for the Cyber Security program.",
    passMark: 50,
    durationMinutes: 30,
    maxAttempts: 3,
    retakeCooldownHours: 24,
    shuffleQuestions: true,
    questions: [
      {
        text: "Which of these is a strong password practice?",
        choices: [
          { text: "Using the same password for every account" },
          { text: "Sharing passwords with colleagues" },
          { text: "Using a unique long passphrase", correct: true },
          { text: "Writing passwords on sticky notes" },
        ],
      },
      {
        text: "What is phishing?",
        choices: [
          { text: "A type of malware that encrypts files" },
          { text: "An attempt to trick users into revealing sensitive information", correct: true },
          { text: "A network scanning tool" },
          { text: "A firewall configuration" },
        ],
      },
      {
        text: "Which protocol secures web traffic?",
        choices: [
          { text: "HTTP" },
          { text: "FTP" },
          { text: "HTTPS", correct: true },
          { text: "SMTP" },
        ],
      },
      {
        text: "What is the purpose of a firewall?",
        choices: [
          { text: "To speed up the internet connection" },
          { text: "To filter incoming and outgoing network traffic", correct: true },
          { text: "To encrypt all files on a computer" },
          { text: "To block all email messages" },
        ],
      },
      {
        text: "What does 2FA stand for?",
        choices: [
          { text: "Two-Factor Authentication", correct: true },
          { text: "Two-File Access" },
          { text: "Terminal Firewall Application" },
          { text: "Trusted File Archive" },
        ],
      },
    ],
  },
];

async function main() {
  const courseIdBySlug = new Map<string, string>();

  for (const course of courseSeeds) {
    const { data: existing } = await sb.from("courses").select("id").eq("slug", course.slug).maybeSingle();
    let id = existing?.id;
    if (!id) {
      const { data, error } = await sb
        .from("courses")
        .insert({ slug: course.slug, title: course.title, description: course.description })
        .select("id")
        .single();
      if (error) throw new Error(`Could not create course ${course.slug}: ${error.message}`);
      id = data.id;
      console.log(`Created course: ${course.title}`);
    }
    courseIdBySlug.set(course.slug, id);
  }

  for (const seed of assessmentSeeds) {
    const courseId = courseIdBySlug.get(seed.courseSlug)!;

    const { data: assessment } = await sb
      .from("assessments")
      .select("id")
      .eq("course_id", courseId)
      .eq("title", seed.title)
      .maybeSingle();

    let assessmentId: string;
    if (!assessment) {
      const { data, error } = await sb
        .from("assessments")
        .insert({
          course_id: courseId,
          title: seed.title,
          description: seed.description,
          pass_mark: seed.passMark,
          duration_minutes: seed.durationMinutes,
          max_attempts: seed.maxAttempts,
          retake_cooldown_hours: seed.retakeCooldownHours,
          shuffle_questions: seed.shuffleQuestions,
          active: true,
        })
        .select("id")
        .single();
      if (error) throw new Error(`Could not create assessment ${seed.title}: ${error.message}`);
      assessmentId = data.id;
      console.log(`Created assessment: ${seed.title}`);
    } else {
      assessmentId = assessment.id;
    }

    const { count } = await sb
      .from("questions")
      .select("id", { count: "exact", head: true })
      .eq("assessment_id", assessmentId);

    if ((count ?? 0) === 0) {
      let position = 1;
      for (const question of seed.questions) {
        const { data: q, error: qError } = await sb
          .from("questions")
          .insert({ assessment_id: assessmentId, text: question.text, points: question.points ?? 1, position })
          .select("id")
          .single();
        if (qError) throw new Error(`Could not create question: ${qError.message}`);

        const choices = question.choices.map((c, i) => ({
          question_id: q.id,
          text: c.text,
          is_correct: c.correct === true,
          position: i + 1,
        }));
        const { error: cError } = await sb.from("choices").insert(choices);
        if (cError) throw new Error(`Could not create choices: ${cError.message}`);
        position += 1;
      }
      console.log(`Seeded ${seed.questions.length} questions for ${seed.title}`);
    } else {
      console.log(`Questions already exist for ${seed.title} (${count} found)`);
    }
  }

  const { data: existingUsers } = await sb.auth.admin.listUsers();
  let adminUserId: string | undefined = existingUsers.users.find(
    (u) => u.email === cfg.adminEmail.toLowerCase()
  )?.id;
  if (!adminUserId) {
    const { data: created, error } = await sb.auth.admin.createUser({
      email: cfg.adminEmail,
      password: cfg.adminPassword,
      email_confirm: true,
    });
    if (error) throw new Error(`Could not create admin user: ${error.message}`);
    adminUserId = created?.user?.id;
    console.log(`Created admin user: ${cfg.adminEmail}`);
  } else {
    console.log(`Admin user already exists: ${cfg.adminEmail}`);
  }

  if (!adminUserId) throw new Error("Could not resolve admin user id.");

  const { error: upsertError } = await sb
    .from("admins")
    .upsert({ id: adminUserId, email: cfg.adminEmail.toLowerCase(), name: cfg.adminName }, { onConflict: "email" });
  if (upsertError) throw new Error(`Could not add admin row: ${upsertError.message}`);
  console.log(`Admin ready: ${cfg.adminEmail}`);

  console.log("\nSeed complete.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
