import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { CheckCircle2, Lock, PlayCircle } from "lucide-react";

export const revalidate = 60;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const course = await prisma.course.findUnique({ where: { slug: slug } });
  if (!course) return {};
  return {
    title: course.seoTitle || course.title,
    description: course.seoDescription || course.shortDesc || undefined,
  };
}

export default async function CourseDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const course = await prisma.course.findUnique({
    where: { slug: slug, status: "PUBLISHED" },
    include: { modules: { orderBy: { order: "asc" }, include: { lessons: { orderBy: { order: "asc" } } } } },
  });

  if (!course) notFound();

  const totalLessons = course.modules.reduce((sum, m) => sum + m.lessons.length, 0);

  return (
    <>
      <Navbar />
      <main>
        <section className="bg-gradient-to-b from-brand-50 to-white py-16 dark:from-gray-900 dark:to-gray-950">
          <div className="container-x">
            <h1 className="mb-4 text-4xl font-extrabold">{course.title}</h1>
            <p className="max-w-2xl leading-8 text-gray-600 dark:text-gray-400">{course.description}</p>
            <div className="mt-6 flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400">
              <span>{course.modules.length} ماڈیولز</span>
              <span>•</span>
              <span>{totalLessons} اسباق</span>
              <span>•</span>
              <span className="font-bold text-brand-600">{course.isFree ? "مفت" : `PKR ${course.price}`}</span>
            </div>
            <Link href="/register" className="mt-8 inline-block rounded-xl bg-brand-600 px-7 py-3.5 font-bold text-white hover:bg-brand-700">
              ابھی داخلہ لیں
            </Link>
          </div>
        </section>

        <section className="container-x py-16">
          <h2 className="mb-6 text-2xl font-extrabold">کورس مواد</h2>
          <div className="space-y-4">
            {course.modules.map((m, i) => (
              <div key={m.id} className="rounded-2xl border border-gray-100 dark:border-gray-800">
                <div className="border-b border-gray-100 bg-gray-50 px-5 py-3 font-bold dark:border-gray-800 dark:bg-gray-900">
                  ماڈیول {i + 1}: {m.title}
                </div>
                <ul className="divide-y divide-gray-100 dark:divide-gray-800">
                  {m.lessons.map((l) => (
                    <li key={l.id} className="flex items-center justify-between px-5 py-3 text-sm">
                      <span className="flex items-center gap-2">
                        <PlayCircle size={16} className="text-brand-600" /> {l.title}
                      </span>
                      {l.isPreview ? (
                        <span className="flex items-center gap-1 text-xs font-semibold text-brand-600"><CheckCircle2 size={14} /> پری ویو</span>
                      ) : (
                        <Lock size={14} className="text-gray-400" />
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
