import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const enrollSchema = z.object({ courseId: z.string().cuid() });

// Student: enroll in a course
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "لاگ ان درکار ہے" }, { status: 401 });

  const body = await req.json().catch(() => null);
  const parsed = enrollSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "غلط درخواست" }, { status: 400 });

  const course = await prisma.course.findUnique({ where: { id: parsed.data.courseId } });
  if (!course || course.status !== "PUBLISHED") {
    return NextResponse.json({ error: "کورس دستیاب نہیں" }, { status: 404 });
  }

  const enrollment = await prisma.enrollment.upsert({
    where: { userId_courseId: { userId: session.user.id, courseId: course.id } },
    update: {},
    create: { userId: session.user.id, courseId: course.id },
  });

  return NextResponse.json(enrollment, { status: 201 });
}

// Student: list my enrollments
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "لاگ ان درکار ہے" }, { status: 401 });

  const enrollments = await prisma.enrollment.findMany({
    where: { userId: session.user.id },
    include: { course: { include: { modules: { include: { lessons: true } } } } },
    orderBy: { enrolledAt: "desc" },
  });

  return NextResponse.json(enrollments);
}
