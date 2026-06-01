"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import {
  ADMIN_COOKIE,
  SESSION_MAX_AGE,
  createSessionToken,
  verifyCredentials,
} from "@/lib/auth";
import { isAdmin } from "@/lib/admin-session";
import { prisma } from "@/lib/db";
import { STATUSES, type LeadStatus } from "@/lib/validation";

export async function loginAction(formData: FormData) {
  const user = String(formData.get("user") ?? "");
  const password = String(formData.get("password") ?? "");

  if (!verifyCredentials(user, password)) {
    redirect("/admin/login?error=1");
  }

  const store = await cookies();
  store.set(ADMIN_COOKIE, createSessionToken(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
  redirect("/admin");
}

export async function logoutAction() {
  const store = await cookies();
  store.delete(ADMIN_COOKIE);
  redirect("/admin/login");
}

export async function updateLeadStatus(id: string, status: string) {
  if (!(await isAdmin())) throw new Error("unauthorized");
  if (!STATUSES.includes(status as LeadStatus)) throw new Error("bad_status");

  await prisma.lead.update({ where: { id }, data: { status } });
  revalidatePath("/admin");
}
