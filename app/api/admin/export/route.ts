import { NextResponse, type NextRequest } from "next/server";
import { isAdmin } from "@/lib/admin-session";
import { prisma } from "@/lib/db";
import { leadsToCsv } from "@/lib/format";
import { STATUSES, SERVICES } from "@/lib/validation";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  if (!(await isAdmin())) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status") ?? "";
  const service = searchParams.get("service") ?? "";
  const q = (searchParams.get("q") ?? "").trim();

  const where: {
    status?: string;
    service?: string;
    OR?: { name?: { contains: string }; phone?: { contains: string } }[];
  } = {};
  if (status && (STATUSES as readonly string[]).includes(status)) where.status = status;
  if (service && (SERVICES as readonly string[]).includes(service)) where.service = service;
  if (q) where.OR = [{ name: { contains: q } }, { phone: { contains: q } }];

  const leads = await prisma.lead.findMany({
    where,
    orderBy: { createdAt: "desc" },
  });

  const csv = leadsToCsv(leads);
  const date = new Date().toISOString().slice(0, 10);

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="ded-zhara-leads-${date}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
