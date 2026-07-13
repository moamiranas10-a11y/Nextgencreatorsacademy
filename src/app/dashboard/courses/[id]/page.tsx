import { notFound, redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import LessonPlayer from "@/components/student/LessonPlayer";

export const dynamic = "force-dynamic";

export default async function WatchCoursePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  const userId = session!.user.id;

  const [course, enrollment, progress, certificate] = await Promise.all([
    prisma.course.findUnique({
      where: { id: id },
      include: { modules: { include: { lessons: true }, orderBy: { order: "asc" } } },
    }),
    prisma.enrollment.findUnique({ where: { userId_courseId: { userId, courseId: id } } }),
    prisma.lessonProgress.findMany({
      where: { userId, completed: true, lesson: { module: { courseId: id } } },
      select: { lessonId: true },
    }),
    prisma.certificate.findUnique({ where: { userId_courseId: { userId, courseId: id } } }),
  ]);

  if (!course) notFound();
  if (!enrollment) redirect("/dashboard/courses");

  return (
    <div dir="rtl">
      <h1 className="mb-6 text-2xl font-extrabold text-gray-900 dark:text-gray-50">{course.title}</h1>
      <LessonPlayer
        course={course}
        completedLessonIds={progress.map((p) => p.lessonId)}
        progressPct={enrollment.progressPct}
        certificateId={certificate?.id || null}
      />
    </div>
  );
}
