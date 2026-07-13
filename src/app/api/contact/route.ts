import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { contactSchema } from "@/lib/validations";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

// Public: submit a contact message — saved directly to the database
// (no third-party email/API service required).
export async function POST(req: Request) {
  const ip = getClientIp(req);
  const { success } = rateLimit(`contact:${ip}`, { limit: 5, windowMs: 10 * 60_000 });
  if (!success) {
    return NextResponse.json({ error: "بہت زیادہ پیغامات، براہ کرم بعد میں کوشش کریں۔" }, { status: 429 });
  }

  const body = await req.json().catch(() => null);
  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.errors[0]?.message || "غلط معلومات" }, { status: 400 });
  }

  const message = await prisma.contactMessage.create({ data: parsed.data });
  return NextResponse.json({ id: message.id }, { status: 201 });
}

// Admin only: list messages
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "SUPER_ADMIN") {
    return NextResponse.json({ error: "غیر مجاز رسائی" }, { status: 403 });
  }
  const messages = await prisma.contactMessage.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json(messages);
}
