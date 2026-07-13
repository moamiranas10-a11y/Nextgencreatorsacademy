import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CourseCard from "@/components/CourseCard";

export const metadata: Metadata = { title: "کورسز" };
export const revalidate = 60;

export default async function CoursesPage() {
  const courses = await prisma.course.findMany({
    where: { status: "PUBLISHED" },
    include: { modules: true },
    orderBy: { order: "asc" },
  });

  return (
    <>
      <Navbar />
      <main className="container-x py-20">
        <h1 className="mb-3 text-center text-4xl font-extrabold">ہمارے تمام کورسز</h1>
        <p className="mx-auto mb-14 max-w-xl text-center text-gray-600 dark:text-gray-400">
          اپنی دلچسپی کے مطابق کورس منتخب کریں اور آج ہی سیکھنا شروع کریں۔
        </p>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((c) => (
            <CourseCard key={c.id} title={c.title} slug={c.slug} shortDesc={c.shortDesc} moduleCount={c.modules.length} isFree={c.isFree} />
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}
