import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import CourseForm from "@/components/admin/CourseForm";

export default async function EditCoursePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const course = await prisma.course.findUnique({ where: { id: id } });
  if (!course) notFound();

  return (
    <div dir="rtl">
      <h1 className="mb-6 text-2xl font-extrabold text-gray-900 dark:text-gray-50">کورس میں ترمیم کریں</h1>
      <CourseForm
        initial={{
          id: course.id,
          title: course.title,
          slug: course.slug,
          description: course.description,
          shortDesc: course.shortDesc,
          thumbnailUrl: course.thumbnailUrl,
          price: Number(course.price),
          isFree: course.isFree,
          status: course.status,
          seoTitle: course.seoTitle,
          seoDescription: course.seoDescription,
        }}
      />
    </div>
  );
}
