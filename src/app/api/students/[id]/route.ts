import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { studentUpdateSchema } from "@/lib/validations";

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "SUPER_ADMIN") return null;
  return session;
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "غیر مجاز رسائی" }, { status: 403 });

  const body = await req.json().catch(() => null);
  const parsed = studentUpdateSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.errors[0]?.message }, { status: 400 });

  const existing = await prisma.user.findUnique({ where: { id: id } });
  if (!existing || existing.role !== "STUDENT") {
    return NextResponse.json({ error: "طالب علم نہیں ملا" }, { status: 404 });
  }

  const student = await prisma.user.update({
    where: { id: id },
    data: parsed.data,
  });
  return NextResponse.json(student);
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "غیر مجاز رسائی" }, { status: 403 });

  const existing = await prisma.user.findUnique({ where: { id: id } });
  if (!existing || existing.role !== "STUDENT") {
    return NextResponse.json({ error: "طالب علم نہیں ملا" }, { status: 404 });
  }

  await prisma.user.delete({ where: { id: id } });
  return NextResponse.json({ success: true });
}
