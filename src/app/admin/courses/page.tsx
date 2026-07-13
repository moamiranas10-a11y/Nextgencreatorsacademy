import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Plus, Pencil, Trash2, ListVideo, Eye, EyeOff } from "lucide-react";
import ConfirmButton from "@/components/admin/ConfirmButton";

export const dynamic = "force-dynamic";

export default async function AdminCoursesPage() {
  const courses = await prisma.course.findMany({
    orderBy: { order: "asc" },
    include: { modules: { include: { lessons: true } }, _count: { select: { enrollments: true } } },
  });

  return (
    <div dir="rtl">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 dark:text-gray-50">کورسز</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">تمام کورسز کا انتظام کریں</p>
        </div>
        <Link href="/admin/courses/new" className="flex items-center gap-2 rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-brand-700">
          <Plus size={16} /> نیا کورس
        </Link>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-gray-100 bg-white dark:border-gray-800 dark:bg-gray-950">
        <table className="w-full text-right text-sm">
          <thead className="bg-gray-50 text-gray-500 dark:bg-gray-900 dark:text-gray-400">
            <tr>
              <th className="px-5 py-3 font-semibold">کورس</th>
              <th className="px-5 py-3 font-semibold">حیثیت</th>
              <th className="px-5 py-3 font-semibold">ماڈیولز / اسباق</th>
              <th className="px-5 py-3 font-semibold">داخلے</th>
              <th className="px-5 py-3 font-semibold">قیمت</th>
              <th className="px-5 py-3 font-semibold">اعمال</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {courses.map((c) => {
              const lessonCount = c.modules.reduce((s, m) => s + m.lessons.length, 0);
              return (
                <tr key={c.id}>
                  <td className="px-5 py-4 font-bold text-gray-900 dark:text-gray-50">{c.title}</td>
                  <td className="px-5 py-4">
                    <span className={`rounded-full px-3 py-1 text-xs font-bold ${c.status === "PUBLISHED" ? "bg-teal-100 text-teal-700 dark:bg-teal-950 dark:text-teal-400" : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300"}`}>
                      {c.status === "PUBLISHED" ? "شائع شدہ" : "ڈرافٹ"}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-gray-600 dark:text-gray-400">{c.modules.length} / {lessonCount}</td>
                  <td className="px-5 py-4 text-gray-600 dark:text-gray-400">{c._count.enrollments}</td>
                  <td className="px-5 py-4 text-gray-600 dark:text-gray-400">{c.isFree ? "مفت" : `PKR ${c.price}`}</td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <Link href={`/admin/courses/${c.id}/lessons`} title="اسباق منظم کریں" className="text-gray-500 hover:text-brand-600">
                        <ListVideo size={17} />
                      </Link>
                      <Link href={`/admin/courses/${c.id}/edit`} title="ترمیم کریں" className="text-gray-500 hover:text-brand-600">
                        <Pencil size={17} />
                      </Link>
                      <ConfirmButton
                        url={`/api/courses/${c.id}`}
                        method="PATCH"
                        body={{ status: c.status === "PUBLISHED" ? "DRAFT" : "PUBLISHED" }}
                        confirmText={c.status === "PUBLISHED" ? "کورس کو ڈرافٹ بنائیں؟" : "کورس شائع کریں؟"}
                        successText="حیثیت تبدیل ہو گئی"
                        icon={c.status === "PUBLISHED" ? EyeOff : Eye}
                        className="text-gray-500 hover:text-brand-600"
                      />
                      <ConfirmButton
                        url={`/api/courses/${c.id}`}
                        confirmText="کیا آپ واقعی یہ کورس حذف کرنا چاہتے ہیں؟ اس سے متعلقہ تمام ماڈیولز اور اسباق بھی حذف ہو جائیں گے۔"
                        icon={Trash2}
                        className="text-red-500 hover:text-red-700"
                      />
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {courses.length === 0 && <p className="p-8 text-center text-sm text-gray-500">ابھی کوئی کورس شامل نہیں کیا گیا۔</p>}
      </div>
    </div>
  );
}
