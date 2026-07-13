import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { testimonialSchema } from "@/lib/validations";

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
  const parsed = testimonialSchema.partial().safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.errors[0]?.message }, { status: 400 });

  const testimonial = await prisma.testimonial.update({ where: { id: id }, data: parsed.data });
  return NextResponse.json(testimonial);
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "غیر مجاز رسائی" }, { status: 403 });

  await prisma.testimonial.delete({ where: { id: id } });
  return NextResponse.json({ success: true });
}
