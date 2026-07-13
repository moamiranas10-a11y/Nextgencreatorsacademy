import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "SUPER_ADMIN") return null;
  return session;
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "غیر مجاز رسائی" }, { status: 403 });

  const body = await req.json().catch(() => ({}));
  const message = await prisma.contactMessage.update({
    where: { id: id },
    data: { isRead: Boolean(body.isRead) },
  });
  return NextResponse.json(message);
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "غیر مجاز رسائی" }, { status: 403 });

  await prisma.contactMessage.delete({ where: { id: id } });
  return NextResponse.json({ success: true });
}
