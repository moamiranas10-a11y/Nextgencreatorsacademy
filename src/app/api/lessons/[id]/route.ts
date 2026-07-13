import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { lessonSchema } from "@/lib/validations";
import { generateCertificateNumber } from "@/lib/utils";

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
  const parsed = lessonSchema.partial().safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.errors[0]?.message }, { status: 400 });

  const lesson = await prisma.lesson.update({ where: { id: id }, data: parsed.data });
  return NextResponse.json(lesson);
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "غیر مجاز رسائی" }, { status: 403 });

  await prisma.lesson.delete({ where: { id: id } });
  return NextResponse.json({ success: true });
}

// Student: mark lesson progress (completed toggle). Also recomputes the
// parent enrollment's progress percentage and auto-issues a certificate
// the moment every lesson in the course has been completed.
export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "لاگ ان درکار ہے" }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const completed = Boolean(body.completed);

  const lesson = await prisma.lesson.findUnique({
    where: { id: id },
    include: { module: { select: { courseId: true } } },
  });
  if (!lesson) return NextResponse.json({ error: "سبق نہیں ملا" }, { status: 404 });

  const progress = await prisma.lessonProgress.upsert({
    where: { userId_lessonId: { userId: session.user.id, lessonId: id } },
    update: { completed, completedAt: completed ? new Date() : null },
    create: {
      userId: session.user.id,
      lessonId: id,
      completed,
      completedAt: completed ? new Date() : null,
    },
  });

  const courseId = lesson.module.courseId;
  const [totalLessons, completedLessons] = await Promise.all([
    prisma.lesson.count({ where: { module: { courseId } } }),
    prisma.lessonProgress.count({
      where: { completed: true, userId: session.user.id, lesson: { module: { courseId } } },
    }),
  ]);

  const progressPct = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;
  const isComplete = totalLessons > 0 && completedLessons === totalLessons;

  const enrollment = await prisma.enrollment.update({
    where: { userId_courseId: { userId: session.user.id, courseId } },
    data: {
      progressPct,
      status: isComplete ? "COMPLETED" : "ACTIVE",
    },
  });

  let certificate = null;
  if (isComplete) {
    certificate = await prisma.certificate.upsert({
      where: { userId_courseId: { userId: session.user.id, courseId } },
      update: {},
      create: {
        userId: session.user.id,
        courseId,
        certificateNo: generateCertificateNumber(),
      },
    });
  }

  return NextResponse.json({ progress, enrollment, certificate });
}
