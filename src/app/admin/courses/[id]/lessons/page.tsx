import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import LessonManager from "@/components/admin/LessonManager";

export const dynamic = "force-dynamic";

export default async function CourseLessonsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const course = await prisma.course.findUnique({
    where: { id: id },
    include: { modules: { include: { lessons: true }, orderBy: { order: "asc" } } },
  });
  if (!course) notFound();

  return (
    <div dir="rtl">
      <h1 className="mb-1 text-2xl font-extrabold text-gray-900 dark:text-gray-50">اسباق کا انتظام</h1>
      <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">کورس: {course.title}</p>
      <LessonManager course={course} />
    </div>
  );
}
