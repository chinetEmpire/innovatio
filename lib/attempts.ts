import { cookies } from "next/headers";

const ATTEMPT_COOKIE = "innovatio_owned_attempts";
const MAX_TRACKED = 20;

const cookieOptions = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: 60 * 60 * 24,
};

function parse(value: string | undefined): string[] {
  if (!value) return [];
  return value.split(" ").filter(Boolean);
}

export async function grantedAttempts(): Promise<string[]> {
  const store = await cookies();
  return parse(store.get(ATTEMPT_COOKIE)?.value).slice(-MAX_TRACKED);
}

export async function grantAttemptOwnership(attemptId: string): Promise<void> {
  if (!attemptId) return;
  const store = await cookies();
  const ids = parse(store.get(ATTEMPT_COOKIE)?.value);
  if (!ids.includes(attemptId)) ids.push(attemptId);
  store.set(ATTEMPT_COOKIE, ids.slice(-MAX_TRACKED).join(" "), cookieOptions);
}

export async function revokeAttemptOwnership(attemptId: string): Promise<void> {
  if (!attemptId) return;
  const store = await cookies();
  const ids = parse(store.get(ATTEMPT_COOKIE)?.value).filter((id) => id !== attemptId);
  if (ids.length === 0) {
    store.delete(ATTEMPT_COOKIE);
    return;
  }
  store.set(ATTEMPT_COOKIE, ids.join(" "), cookieOptions);
}
