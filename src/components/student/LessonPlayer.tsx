"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { CheckCircle2, Circle, PlayCircle, FileText, ClipboardList, Award, Loader2 } from "lucide-react";

type Lesson = {
  id: string;
  title: string;
  type: "VIDEO" | "PDF" | "ASSIGNMENT" | "TEXT";
  videoUrl: string | null;
  pdfUrl: string | null;
  content: string | null;
  order: number;
};
type Module = { id: string; title: string; order: number; lessons: Lesson[] };
type Course = { id: string; title: string; modules: Module[] };

const typeIcon = { VIDEO: PlayCircle, PDF: FileText, ASSIGNMENT: ClipboardList, TEXT: FileText };

export default function LessonPlayer({
  course,
  completedLessonIds,
  progressPct,
  certificateId,
}: {
  course: Course;
  completedLessonIds: string[];
  progressPct: number;
  certificateId: string | null;
}) {
  const router = useRouter();
  const allLessons = course.modules.flatMap((m) => m.lessons).sort((a, b) => a.order - b.order);
  const [activeId, setActiveId] = useState(allLessons[0]?.id);
  const [completed, setCompleted] = useState(new Set(completedLessonIds));
  const [busy, setBusy] = useState(false);
  const [pct, setPct] = useState(progressPct);
  const [cert, setCert] = useState(certificateId);

  const active = allLessons.find((l) => l.id === activeId);

  async function toggleComplete(lessonId: string, value: boolean) {
    setBusy(true);
    try {
      const res = await fetch(`/api/lessons/${lessonId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed: value }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "کچھ غلط ہو گیا");

      setCompleted((prev) => {
        const next = new Set(prev);
        value ? next.add(lessonId) : next.delete(lessonId);
        return next;
      });
      setPct(json.enrollment.progressPct);
      if (json.certificate) {
        setCert(json.certificate.id);
        toast.success("مبارک ہو! آپ نے کورس مکمل کر لیا 🎉");
      }
      router.refresh();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div dir="rtl" className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
      <div className="rounded-2xl border border-gray-100 bg-white p-6 dark:border-gray-800 dark:bg-gray-950">
        {active ? (
          <>
            <h2 className="mb-4 text-xl font-extrabold text-gray-900 dark:text-gray-50">{active.title}</h2>

            {active.type === "VIDEO" && active.videoUrl && (
              <div className="mb-5 aspect-video overflow-hidden rounded-xl bg-black">
                <iframe src={active.videoUrl} className="h-full w-full" allowFullScreen title={active.title} />
              </div>
            )}
            {active.type === "PDF" && active.pdfUrl && (
              <a href={active.pdfUrl} target="_blank" rel="noreferrer" className="mb-5 flex items-center gap-2 rounded-xl border border-brand-200 bg-brand-50 px-4 py-3 text-sm font-bold text-brand-700 dark:border-brand-900 dark:bg-brand-950/30 dark:text-brand-400">
                <FileText size={18} /> PDF ڈاؤن لوڈ کریں
              </a>
            )}
            {active.content && <p className="mb-5 leading-8 text-gray-600 dark:text-gray-400">{active.content}</p>}

            <button
              disabled={busy}
              onClick={() => toggleComplete(active.id, !completed.has(active.id))}
              className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold disabled:opacity-60 ${completed.has(active.id) ? "bg-teal-100 text-teal-700 dark:bg-teal-950 dark:text-teal-400" : "bg-brand-600 text-white hover:bg-brand-700"}`}
            >
              {busy ? <Loader2 size={16} className="animate-spin" /> : completed.has(active.id) ? <CheckCircle2 size={16} /> : <Circle size={16} />}
              {completed.has(active.id) ? "مکمل شدہ" : "بطور مکمل نشان زد کریں"}
            </button>
          </>
        ) : (
          <p className="text-sm text-gray-500">اس کورس میں ابھی کوئی سبق شامل نہیں کیا گیا۔</p>
        )}
      </div>

      <div className="space-y-4">
        <div className="rounded-2xl border border-gray-100 bg-white p-5 dark:border-gray-800 dark:bg-gray-950">
          <div className="mb-2 flex items-center justify-between text-sm font-bold">
            <span>پیش رفت</span>
            <span className="text-brand-600">{pct}%</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
            <div className="h-full rounded-full bg-path-gradient" style={{ width: `${pct}%` }} />
          </div>
          {cert && (
            <Link href={`/dashboard/certificates/${cert}`} className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-gray-900 py-2.5 text-sm font-bold text-white dark:bg-brand-600">
              <Award size={16} /> سرٹیفکیٹ دیکھیں
            </Link>
          )}
        </div>

        <div className="max-h-[65vh] overflow-y-auto rounded-2xl border border-gray-100 bg-white dark:border-gray-800 dark:bg-gray-950">
          {course.modules.sort((a, b) => a.order - b.order).map((m) => (
            <div key={m.id}>
              <div className="border-b border-gray-100 bg-gray-50 px-4 py-2.5 text-xs font-bold text-gray-500 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400">{m.title}</div>
              <ul className="divide-y divide-gray-100 dark:divide-gray-800">
                {m.lessons.sort((a, b) => a.order - b.order).map((l) => {
                  const Icon = typeIcon[l.type];
                  const isDone = completed.has(l.id);
                  return (
                    <li key={l.id}>
                      <button
                        onClick={() => setActiveId(l.id)}
                        className={`flex w-full items-center gap-3 px-4 py-3 text-right text-sm transition ${activeId === l.id ? "bg-brand-50 dark:bg-brand-950/30" : "hover:bg-gray-50 dark:hover:bg-gray-900"}`}
                      >
                        {isDone ? <CheckCircle2 size={16} className="shrink-0 text-teal-500" /> : <Icon size={16} className="shrink-0 text-gray-400" />}
                        <span className={activeId === l.id ? "font-bold text-brand-700 dark:text-brand-400" : "text-gray-700 dark:text-gray-300"}>{l.title}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
