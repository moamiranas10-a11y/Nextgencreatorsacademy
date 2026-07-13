import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { courseSchema } from "@/lib/validations";

// Public: list published courses. Admin (via ?all=1): list everything.
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const all = searchParams.get("all") === "1";

  if (all) {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "غیر مجاز رسائی" }, { status: 403 });
    }
    const courses = await prisma.course.findMany({
      include: { modules: { include: { lessons: true } }, _count: { select: { enrollments: true } } },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(courses);
  }

  const courses = await prisma.course.findMany({
    where: { status: "PUBLISHED" },
    include: { modules: true },
    orderBy: { order: "asc" },
  });
  return NextResponse.json(courses);
}

// Admin only: create a course
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "SUPER_ADMIN") {
    return NextResponse.json({ error: "غیر مجاز رسائی" }, { status: 403 });
  }

  const body = await req.json().catch(() => null);
  const parsed = courseSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.errors[0]?.message }, { status: 400 });
  }

  const existing = await prisma.course.findUnique({ where: { slug: parsed.data.slug } });
  if (existing) {
    return NextResponse.json({ error: "یہ Slug پہلے سے موجود ہے۔" }, { status: 409 });
  }

  const course = await prisma.course.create({
    data: { ...parsed.data, authorId: session.user.id },
  });

  return NextResponse.json(course, { status: 201 });
}
