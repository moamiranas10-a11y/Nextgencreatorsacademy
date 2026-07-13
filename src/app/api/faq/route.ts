import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { faqSchema } from "@/lib/validations";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const all = searchParams.get("all") === "1";

  if (all) {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "غیر مجاز رسائی" }, { status: 403 });
    }
    const faqs = await prisma.faq.findMany({ orderBy: { order: "asc" } });
    return NextResponse.json(faqs);
  }

  const faqs = await prisma.faq.findMany({ where: { isPublished: true }, orderBy: { order: "asc" } });
  return NextResponse.json(faqs);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "SUPER_ADMIN") {
    return NextResponse.json({ error: "غیر مجاز رسائی" }, { status: 403 });
  }

  const body = await req.json().catch(() => null);
  const parsed = faqSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.errors[0]?.message }, { status: 400 });

  const faq = await prisma.faq.create({ data: parsed.data });
  return NextResponse.json(faq, { status: 201 });
}
