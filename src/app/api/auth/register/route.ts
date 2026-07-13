import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { registerSchema } from "@/lib/validations";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

export async function POST(req: Request) {
  // Rate limit registration to prevent automated abuse: 5 per 10 minutes per IP.
  const ip = getClientIp(req);
  const { success } = rateLimit(`register:${ip}`, { limit: 5, windowMs: 10 * 60_000 });
  if (!success) {
    return NextResponse.json({ error: "بہت زیادہ کوششیں، براہ کرم بعد میں کوشش کریں۔" }, { status: 429 });
  }

  const body = await req.json().catch(() => null);
  const parsed = registerSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.errors[0]?.message || "غلط معلومات" }, { status: 400 });
  }

  const { name, email, password, phone } = parsed.data;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json({ error: "یہ ای میل پہلے سے رجسٹرڈ ہے۔" }, { status: 409 });
  }

  const passwordHash = await bcrypt.hash(password, 12);

  const user = await prisma.user.create({
    data: { name, email, passwordHash, phone, role: "STUDENT" },
  });

  return NextResponse.json({ id: user.id, email: user.email }, { status: 201 });
}
