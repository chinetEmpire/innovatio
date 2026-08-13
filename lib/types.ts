export type Course = {
  id: string;
  slug: string;
  title: string;
  description: string;
  created_at: string;
};

export type Assessment = {
  id: string;
  course_id: string;
  title: string;
  description: string;
  pass_mark: number;
  duration_minutes: number;
  max_attempts: number | null;
  retake_cooldown_hours: number;
  shuffle_questions: boolean;
  active: boolean;
  created_at: string;
  updated_at: string;
};

export type Question = {
  id: string;
  assessment_id: string;
  text: string;
  points: number;
  position: number;
  created_at: string;
};

export type Choice = {
  id: string;
  question_id: string;
  text: string;
  is_correct: boolean;
  position: number;
  created_at: string;
};

export type Applicant = {
  id: string;
  email: string;
  full_name: string;
  whatsapp: string;
  age_bracket: string;
  course_id: string;
  agreed_to_terms: boolean;
  created_at: string;
};

export type Attempt = {
  id: string;
  applicant_id: string;
  assessment_id: string;
  status: "in_progress" | "submitted";
  started_at: string;
  submitted_at: string | null;
  score: number | null;
  passed: boolean | null;
  answers: { questionId: string; choiceId: string }[];
  created_at: string;
};

export type SafeQuestion = {
  id: string;
  text: string;
  points: number;
  position: number;
  choices: { id: string; text: string; position: number }[];
};

export type Enrollment = {
  id: string;
  applicant_id: string;
  course_id: string;
  attempt_id: string | null;
  payment_status: "pending" | "paid" | "failed";
  created_at: string;
};

export const AGE_BRACKETS = ["Under 18", "18-24", "25-34", "35-44", "45+"] as const;
