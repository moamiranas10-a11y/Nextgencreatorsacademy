import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { CheckCircle2 } from "lucide-react";
import EnrollButton from "@/components/student/EnrollButton";

export const dynamic = "force-dynamic";

export default async function StudentCoursesPage() {
  const session = await getServerSession(authOptions);
  const userId = session!.user.id;

  const [courses, enrollments] = await Promise.all([
    prisma.course.findMany({
      where: { status: "PUBLISHED" },
      include: { modules: { include: { lessons: true } } },
      orderBy: { order: "asc" },
    }),
    prisma.enrollment.findMany({ where: { userId } }),
  ]);

  const enrollmentMap = new Map(enrollments.map((e) => [e.courseId, e]));

  return (
    <div dir="rtl">
      <h1 className="mb-1 text-2xl font-extrabold text-gray-900 dark:text-gray-50">کورسز</h1>
      <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">دستیاب کورسز میں داخلہ لیں یا اپنی پیش رفت جاری رکھیں</p>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
        {courses.map((c) => {
          const enrollment = enrollmentMap.get(c.id);
          const totalLessons = c.modules.reduce((s, m) => s + m.lessons.length, 0);
          return (
            <div key={c.id} className="flex flex-col rounded-2xl border border-gray-100 bg-white p-5 dark:border-gray-800 dark:bg-gray-950">
              <h3 className="mb-2 font-bold text-gray-900 dark:text-gray-50">{c.title}</h3>
              <p className="mb-4 flex-1 text-sm text-gray-500 dark:text-gray-400">{c.shortDesc}</p>
              <p className="mb-4 text-xs text-gray-400">{c.modules.length} ماڈیولز • {totalLessons} اسباق</p>

              {enrollment ? (
                <>
                  <div className="mb-2 h-2 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
                    <div className="h-full rounded-full bg-path-gradient" style={{ width: `${enrollment.progressPct}%` }} />
                  </div>
                  <Link href={`/dashboard/courses/${c.id}`} className="flex items-center justify-center gap-2 rounded-xl border border-brand-600 py-2.5 text-sm font-bold text-brand-600 hover:bg-brand-50 dark:hover:bg-brand-950/30">
                    {enrollment.progressPct === 100 ? <><CheckCircle2 size={16} /> مکمل — دوبارہ دیکھیں</> : "جاری رکھیں"}
                  </Link>
                </>
              ) : (
                <EnrollButton courseId={c.id} />
              )}
            </div>
          );
        })}
      </div>
      {courses.length === 0 && <p className="rounded-2xl border border-gray-100 bg-white p-8 text-center text-sm text-gray-500 dark:border-gray-800 dark:bg-gray-950">فی الحال کوئی کورس دستیاب نہیں۔</p>}
    </div>
  );
}
