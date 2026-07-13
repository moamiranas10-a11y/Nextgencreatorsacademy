import { prisma } from "@/lib/prisma";
import { formatDateUrdu } from "@/lib/utils";
import { Users, BookOpen, GraduationCap, Mail, TrendingUp } from "lucide-react";

export const dynamic = "force-dynamic";

async function getStats() {
  const [totalStudents, totalCourses, totalEnrollments, totalMessages, unreadMessages, recentEnrollments, recentMessages] =
    await Promise.all([
      prisma.user.count({ where: { role: "STUDENT" } }),
      prisma.course.count(),
      prisma.enrollment.count(),
      prisma.contactMessage.count(),
      prisma.contactMessage.count({ where: { isRead: false } }),
      prisma.enrollment.findMany({
        take: 5,
        orderBy: { enrolledAt: "desc" },
        include: { user: true, course: true },
      }),
      prisma.contactMessage.findMany({ take: 5, orderBy: { createdAt: "desc" } }),
    ]);

  // Revenue: sum of course price for each paid enrollment (free courses contribute 0)
  const paidEnrollments = await prisma.enrollment.findMany({ include: { course: true } });
  const revenue = paidEnrollments.reduce((sum, e) => sum + Number(e.course.isFree ? 0 : e.course.price), 0);

  return { totalStudents, totalCourses, totalEnrollments, totalMessages, unreadMessages, revenue, recentEnrollments, recentMessages };
}

export default async function AdminDashboardPage() {
  const stats = await getStats();

  const cards = [
    { label: "کل طلباء", value: stats.totalStudents, icon: Users, color: "bg-brand-600" },
    { label: "کل کورسز", value: stats.totalCourses, icon: BookOpen, color: "bg-teal-600" },
    { label: "کل داخلے", value: stats.totalEnrollments, icon: GraduationCap, color: "bg-indigo-600" },
    { label: "نئے پیغامات", value: stats.unreadMessages, icon: Mail, color: "bg-rose-600" },
  ];

  return (
    <div dir="rtl">
      <h1 className="mb-1 text-2xl font-extrabold text-gray-900 dark:text-gray-50">ڈیش بورڈ</h1>
      <p className="mb-8 text-sm text-gray-500 dark:text-gray-400">اکیڈمی کی مجموعی کارکردگی کا ایک نظر میں جائزہ</p>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <div key={c.label} className="rounded-2xl border border-gray-100 bg-white p-5 dark:border-gray-800 dark:bg-gray-950">
            <div className={`mb-4 flex h-11 w-11 items-center justify-center rounded-xl text-white ${c.color}`}>
              <c.icon size={20} />
            </div>
            <div className="text-2xl font-extrabold text-gray-900 dark:text-gray-50">{c.value}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">{c.label}</div>
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-2xl border border-gray-100 bg-white p-5 dark:border-gray-800 dark:bg-gray-950">
        <div className="mb-4 flex items-center gap-2 font-bold text-gray-900 dark:text-gray-50">
          <TrendingUp size={18} className="text-brand-600" /> ریونیو کا جائزہ (کل)
        </div>
        <div className="text-3xl font-extrabold text-brand-600">PKR {stats.revenue.toLocaleString("en-US")}</div>
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">تمام کورسز فی الحال مفت ہونے کی صورت میں یہ 0 دکھائے گا۔</p>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-5 lg:grid-cols-2">
        <div className="rounded-2xl border border-gray-100 bg-white p-5 dark:border-gray-800 dark:bg-gray-950">
          <h2 className="mb-4 font-bold text-gray-900 dark:text-gray-50">حالیہ داخلے</h2>
          <ul className="space-y-3">
            {stats.recentEnrollments.length === 0 && <li className="text-sm text-gray-500">ابھی کوئی داخلہ نہیں</li>}
            {stats.recentEnrollments.map((e) => (
              <li key={e.id} className="flex items-center justify-between text-sm">
                <span className="font-medium text-gray-800 dark:text-gray-200">{e.user.name}</span>
                <span className="text-gray-500 dark:text-gray-400">{e.course.title}</span>
                <span className="text-xs text-gray-400">{formatDateUrdu(e.enrolledAt)}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-5 dark:border-gray-800 dark:bg-gray-950">
          <h2 className="mb-4 font-bold text-gray-900 dark:text-gray-50">حالیہ پیغامات</h2>
          <ul className="space-y-3">
            {stats.recentMessages.length === 0 && <li className="text-sm text-gray-500">ابھی کوئی پیغام نہیں</li>}
            {stats.recentMessages.map((m) => (
              <li key={m.id} className="text-sm">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-800 dark:text-gray-200">{m.name}</span>
                  <span className="text-xs text-gray-400">{formatDateUrdu(m.createdAt)}</span>
                </div>
                <p className="truncate text-gray-500 dark:text-gray-400">{m.message}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
