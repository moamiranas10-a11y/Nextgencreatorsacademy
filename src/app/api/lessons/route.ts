import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { lessonSchema, moduleSchema } from "@/lib/validations";

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "SUPER_ADMIN") return null;
  return session;
}

// Admin: create a lesson OR a module (?type=module)
export async function POST(req: Request) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "غیر مجاز رسائی" }, { status: 403 });

  const { searchParams } = new URL(req.url);
  const body = await req.json().catch(() => null);

  if (searchParams.get("type") === "module") {
    const parsed = moduleSchema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: parsed.error.errors[0]?.message }, { status: 400 });
    const mod = await prisma.module.create({ data: parsed.data });
    return NextResponse.json(mod, { status: 201 });
  }

  const parsed = lessonSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.errors[0]?.message }, { status: 400 });
  const lesson = await prisma.lesson.create({ data: parsed.data });
  return NextResponse.json(lesson, { status: 201 });
}
