"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Plus, Trash2, ArrowUp, ArrowDown, Loader2, Eye } from "lucide-react";

type Lesson = {
  id: string;
  title: string;
  type: "VIDEO" | "PDF" | "ASSIGNMENT" | "TEXT";
  videoUrl: string | null;
  pdfUrl: string | null;
  order: number;
  isPreview: boolean;
};
type Module = { id: string; title: string; order: number; lessons: Lesson[] };
type CourseWithModules = { id: string; title: string; modules: Module[] };

const inputClass = "w-full rounded-lg border border-gray-200 px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-900";

export default function LessonManager({ course }: { course: CourseWithModules }) {
  const router = useRouter();
  const [newModuleTitle, setNewModuleTitle] = useState("");
  const [busy, setBusy] = useState(false);

  async function call(url: string, method: string, body?: unknown) {
    setBusy(true);
    try {
      const res = await fetch(url, {
        method,
        headers: body ? { "Content-Type": "application/json" } : undefined,
        body: body ? JSON.stringify(body) : undefined,
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error || "کارروائی ناکام ہوئی");
      router.refresh();
      return json;
    } catch (err: any) {
      toast.error(err.message);
      throw err;
    } finally {
      setBusy(false);
    }
  }

  async function addModule(e: React.FormEvent) {
    e.preventDefault();
    if (!newModuleTitle.trim()) return;
    await call("/api/lessons?type=module", "POST", {
      title: newModuleTitle,
      order: course.modules.length,
      courseId: course.id,
    });
    setNewModuleTitle("");
    toast.success("ماڈیول شامل ہو گیا");
  }

  async function moveModule(mod: Module, direction: -1 | 1) {
    const sorted = [...course.modules].sort((a, b) => a.order - b.order);
    const idx = sorted.findIndex((m) => m.id === mod.id);
    const swapWith = sorted[idx + direction];
    if (!swapWith) return;
    await Promise.all([
      fetch(`/api/modules/${mod.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ order: swapWith.order }) }),
      fetch(`/api/modules/${swapWith.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ order: mod.order }) }),
    ]);
    router.refresh();
  }

  return (
    <div dir="rtl" className="space-y-6">
      {[...course.modules].sort((a, b) => a.order - b.order).map((mod, mi, arr) => (
        <div key={mod.id} className="rounded-2xl border border-gray-100 bg-white dark:border-gray-800 dark:bg-gray-950">
          <div className="flex items-center justify-between border-b border-gray-100 px-5 py-3 dark:border-gray-800">
            <span className="font-bold">ماڈیول {mi + 1}: {mod.title}</span>
            <div className="flex items-center gap-2">
              <button disabled={busy || mi === 0} onClick={() => moveModule(mod, -1)} className="text-gray-400 hover:text-brand-600 disabled:opacity-30"><ArrowUp size={16} /></button>
              <button disabled={busy || mi === arr.length - 1} onClick={() => moveModule(mod, 1)} className="text-gray-400 hover:text-brand-600 disabled:opacity-30"><ArrowDown size={16} /></button>
              <button
                disabled={busy}
                onClick={() => confirm("ماڈیول اور اس کے تمام اسباق حذف کریں؟") && call(`/api/modules/${mod.id}`, "DELETE")}
                className="text-red-500 hover:text-red-700"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>

          <div className="divide-y divide-gray-100 dark:divide-gray-800">
            {[...mod.lessons].sort((a, b) => a.order - b.order).map((lesson) => (
              <div key={lesson.id} className="flex items-center justify-between px-5 py-3 text-sm">
                <div>
                  <span className="font-medium">{lesson.title}</span>
                  <span className="mr-2 rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-500 dark:bg-gray-800">{lesson.type}</span>
                  {lesson.isPreview && <span className="mr-2 flex items-center gap-1 rounded-full bg-teal-100 px-2 py-0.5 text-xs text-teal-700 dark:bg-teal-950 dark:text-teal-400"><Eye size={11} /> پیش نظارہ</span>}
                </div>
                <button
                  disabled={busy}
                  onClick={() => confirm("یہ سبق حذف کریں؟") && call(`/api/lessons/${lesson.id}`, "DELETE")}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            ))}
          </div>

          <AddLessonForm moduleId={mod.id} order={mod.lessons.length} onAdd={(body) => call("/api/lessons", "POST", body)} />
        </div>
      ))}

      <form onSubmit={addModule} className="flex gap-3 rounded-2xl border border-dashed border-gray-300 p-4 dark:border-gray-700">
        <input
          className={inputClass}
          placeholder="نیا ماڈیول کا عنوان"
          value={newModuleTitle}
          onChange={(e) => setNewModuleTitle(e.target.value)}
        />
        <button disabled={busy} className="flex shrink-0 items-center gap-1.5 rounded-lg bg-brand-600 px-4 py-2 text-sm font-bold text-white hover:bg-brand-700 disabled:opacity-60">
          {busy ? <Loader2 size={15} className="animate-spin" /> : <Plus size={15} />} ماڈیول شامل کریں
        </button>
      </form>
    </div>
  );
}

function AddLessonForm({ moduleId, order, onAdd }: { moduleId: string; order: number; onAdd: (body: unknown) => Promise<any> }) {
  const [title, setTitle] = useState("");
  const [type, setType] = useState<"VIDEO" | "PDF" | "ASSIGNMENT" | "TEXT">("VIDEO");
  const [videoUrl, setVideoUrl] = useState("");
  const [pdfUrl, setPdfUrl] = useState("");
  const [isPreview, setIsPreview] = useState(false);
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    setLoading(true);
    try {
      await onAdd({ title, type, videoUrl: videoUrl || undefined, pdfUrl: pdfUrl || undefined, order, isPreview, moduleId });
      setTitle("");
      setVideoUrl("");
      setPdfUrl("");
      setIsPreview(false);
      toast.success("سبق شامل ہو گیا");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={submit} className="grid grid-cols-1 gap-2 border-t border-gray-100 p-4 dark:border-gray-800 sm:grid-cols-6">
      <input className={`${inputClass} sm:col-span-2`} placeholder="سبق کا عنوان" value={title} onChange={(e) => setTitle(e.target.value)} />
      <select className={inputClass} value={type} onChange={(e) => setType(e.target.value as any)}>
        <option value="VIDEO">ویڈیو</option>
        <option value="PDF">PDF</option>
        <option value="ASSIGNMENT">اسائنمنٹ</option>
        <option value="TEXT">متن</option>
      </select>
      <input className={inputClass} placeholder="ویڈیو URL" value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} />
      <input className={inputClass} placeholder="PDF URL" value={pdfUrl} onChange={(e) => setPdfUrl(e.target.value)} />
      <div className="flex items-center gap-3">
        <label className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-400">
          <input type="checkbox" checked={isPreview} onChange={(e) => setIsPreview(e.target.checked)} /> مفت پیش نظارہ
        </label>
        <button disabled={loading} className="flex items-center gap-1 rounded-lg bg-gray-900 px-3 py-2 text-xs font-bold text-white hover:bg-black disabled:opacity-60 dark:bg-brand-600">
          {loading ? <Loader2 size={13} className="animate-spin" /> : <Plus size={13} />} شامل کریں
        </button>
      </div>
    </form>
  );
}
