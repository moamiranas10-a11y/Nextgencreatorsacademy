import Link from "next/link";
import { BookOpen, Clock } from "lucide-react";

type CourseCardProps = {
  title: string;
  slug: string;
  shortDesc?: string | null;
  moduleCount: number;
  isFree: boolean;
};

export default function CourseCard({ title, slug, shortDesc, moduleCount, isFree }: CourseCardProps) {
  return (
    <Link
      href={`/courses/${slug}`}
      className="group flex flex-col rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl dark:border-gray-800 dark:bg-gray-900"
    >
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-brand-100 text-brand-700 dark:bg-brand-900/40 dark:text-brand-300">
        <BookOpen size={22} />
      </div>
      <h3 className="mb-2 text-lg font-bold text-gray-900 group-hover:text-brand-700 dark:text-white">{title}</h3>
      <p className="mb-4 flex-1 text-sm leading-6 text-gray-600 dark:text-gray-400">{shortDesc}</p>
      <div className="flex items-center justify-between border-t border-gray-100 pt-4 text-xs text-gray-500 dark:border-gray-800">
        <span className="flex items-center gap-1"><Clock size={14} /> {moduleCount} ماڈیولز</span>
        <span className={isFree ? "font-bold text-brand-600" : "font-bold text-gray-900"}>
          {isFree ? "مفت" : "پیڈ"}
        </span>
      </div>
    </Link>
  );
}
