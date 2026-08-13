import { redirect } from "next/navigation";
import { serverClient } from "@/lib/supabase/server";

export type AdminSession = {
  email: string;
  name: string;
};

export async function getAdminSession(): Promise<AdminSession | null> {
  const sb = await serverClient();
  const { data: userData } = await sb.auth.getUser();
  const user = userData.user;
  if (!user?.email) return null;

  const { data } = await sb.from("admins").select("email, name").eq("email", user.email).maybeSingle();
  if (!data) return null;

  return { email: data.email, name: data.name };
}

export async function requireAdmin(): Promise<AdminSession> {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");
  return session;
}
