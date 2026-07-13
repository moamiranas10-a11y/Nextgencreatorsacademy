import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { BookOpen, Award, TrendingUp, ArrowLeft } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function StudentDashboardPage() {
  const session = await getServerSession(authOptions);
  const userId = session!.user.id;

  const [enrollments, certificateCount] = await Promise.all([
    prisma.enrollment.findMany({
      where: { userId },
      include: { course: true },
      orderBy: { enrolledAt: "desc" },
    }),
    prisma.certificate.count({ where: { userId } }),
  ]);

  const avgProgress = enrollments.length
    ? Math.round(enrollments.reduce((s, e) => s + e.progressPct, 0) / enrollments.length)
    : 0;

  const cards = [
    { label: "داخل شدہ کورسز", value: enrollments.length, icon: BookOpen },
    { label: "حاصل کردہ سرٹیفکیٹس", value: certificateCount, icon: Award },
    { label: "اوسط پیش رفت", value: `${avgProgress}%`, icon: TrendingUp },
  ];

  return (
    <div dir="rtl">
      <h1 className="mb-1 text-2xl font-extrabold text-gray-900 dark:text-gray-50">خوش آمدید، {session!.user.name}</h1>
      <p className="mb-8 text-sm text-gray-500 dark:text-gray-400">اپنی سیکھنے کی پیش رفت کا جائزہ لیں</p>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        {cards.map((c) => (
          <div key={c.label} className="rounded-2xl border border-gray-100 bg-white p-5 dark:border-gray-800 dark:bg-gray-950">
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-brand-600 text-white">
              <c.icon size={20} />
            </div>
            <div className="text-2xl font-extrabold text-gray-900 dark:text-gray-50">{c.value}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">{c.label}</div>
          </div>
        ))}
      </div>

      <div className="mt-8">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-bold text-gray-900 dark:text-gray-50">میرے کورسز</h2>
          <Link href="/dashboard/courses" className="flex items-center gap-1 text-sm font-semibold text-brand-600">
            سب دیکھیں <ArrowLeft size={14} />
          </Link>
        </div>

        {enrollments.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-10 text-center dark:border-gray-700 dark:bg-gray-950">
            <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">آپ نے ابھی تک کسی کورس میں داخلہ نہیں لیا۔</p>
            <Link href="/dashboard/courses" className="rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-brand-700">
              کورسز دیکھیں
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {enrollments.map((e) => (
              <Link key={e.id} href={`/dashboard/courses/${e.courseId}`} className="rounded-2xl border border-gray-100 bg-white p-5 transition hover:border-brand-300 dark:border-gray-800 dark:bg-gray-950">
                <h3 className="mb-3 font-bold text-gray-900 dark:text-gray-50">{e.course.title}</h3>
                <div className="mb-1.5 h-2 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
                  <div className="h-full rounded-full bg-path-gradient" style={{ width: `${e.progressPct}%` }} />
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-400">{e.progressPct}% مکمل</span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
