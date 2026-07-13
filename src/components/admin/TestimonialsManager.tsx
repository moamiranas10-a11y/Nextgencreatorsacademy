"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Plus, Trash2, Pencil, Star, Loader2, Eye, EyeOff } from "lucide-react";

type Testimonial = {
  id: string;
  name: string;
  role: string | null;
  message: string;
  avatarUrl: string | null;
  rating: number;
  isPublished: boolean;
};

const inputClass = "w-full rounded-lg border border-gray-200 px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-900";
const emptyForm = { id: "", name: "", role: "", message: "", avatarUrl: "", rating: 5, isPublished: true };

export default function TestimonialsManager() {
  const [items, setItems] = useState<Testimonial[]>([]);
  const [form, setForm] = useState<typeof emptyForm>(emptyForm);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);

  async function load() {
    const res = await fetch("/api/testimonials?all=1");
    setItems(await res.json());
  }
  useEffect(() => {
    load();
  }, []);

  function edit(t: Testimonial) {
    setForm({ id: t.id, name: t.name, role: t.role || "", message: t.message, avatarUrl: t.avatarUrl || "", rating: t.rating, isPublished: t.isPublished });
    setShowForm(true);
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = { name: form.name, role: form.role || undefined, message: form.message, avatarUrl: form.avatarUrl || undefined, rating: form.rating, isPublished: form.isPublished };
      const res = await fetch(form.id ? `/api/testimonials/${form.id}` : "/api/testimonials", {
        method: form.id ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      toast.success("محفوظ ہو گیا");
      setForm(emptyForm);
      setShowForm(false);
      load();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function toggle(t: Testimonial) {
    await fetch(`/api/testimonials/${t.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ isPublished: !t.isPublished }) });
    load();
  }

  async function remove(id: string) {
    if (!confirm("یہ تاثر حذف کریں؟")) return;
    await fetch(`/api/testimonials/${id}`, { method: "DELETE" });
    toast.success("حذف ہو گیا");
    load();
  }

  return (
    <div dir="rtl">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 dark:text-gray-50">تاثرات</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">طلباء کے تاثرات شامل اور منظم کریں</p>
        </div>
        <button onClick={() => { setForm(emptyForm); setShowForm(!showForm); }} className="flex items-center gap-2 rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-brand-700">
          <Plus size={16} /> نیا تاثر
        </button>
      </div>

      {showForm && (
        <form onSubmit={submit} className="mb-6 space-y-3 rounded-2xl border border-gray-100 bg-white p-5 dark:border-gray-800 dark:bg-gray-950">
          <div className="grid grid-cols-2 gap-3">
            <input className={inputClass} placeholder="نام" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <input className={inputClass} placeholder="عہدہ / کورس" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} />
          </div>
          <textarea className={inputClass} placeholder="تاثر کا پیغام" required rows={3} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
          <div className="grid grid-cols-2 gap-3">
            <input className={inputClass} placeholder="تصویر URL (اختیاری)" value={form.avatarUrl} onChange={(e) => setForm({ ...form, avatarUrl: e.target.value })} />
            <select className={inputClass} value={form.rating} onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })}>
              {[5, 4, 3, 2, 1].map((r) => <option key={r} value={r}>{r} ستارے</option>)}
            </select>
          </div>
          <button disabled={loading} className="flex items-center gap-2 rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-bold text-white disabled:opacity-60">
            {loading && <Loader2 size={15} className="animate-spin" />} محفوظ کریں
          </button>
        </form>
      )}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {items.map((t) => (
          <div key={t.id} className="rounded-2xl border border-gray-100 bg-white p-5 dark:border-gray-800 dark:bg-gray-950">
            <div className="mb-2 flex items-center gap-1 text-brand-500">
              {Array.from({ length: t.rating }).map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
            </div>
            <p className="mb-3 text-sm text-gray-600 dark:text-gray-400">{t.message}</p>
            <div className="mb-3 text-sm font-bold">{t.name} <span className="font-normal text-gray-400">— {t.role}</span></div>
            <div className="flex items-center gap-3 text-xs">
              <button onClick={() => edit(t)} className="flex items-center gap-1 text-gray-500 hover:text-brand-600"><Pencil size={14} /> ترمیم</button>
              <button onClick={() => toggle(t)} className="flex items-center gap-1 text-gray-500 hover:text-brand-600">
                {t.isPublished ? <><EyeOff size={14} /> چھپائیں</> : <><Eye size={14} /> دکھائیں</>}
              </button>
              <button onClick={() => remove(t.id)} className="flex items-center gap-1 text-red-500 hover:text-red-700"><Trash2 size={14} /> حذف کریں</button>
            </div>
          </div>
        ))}
      </div>
      {items.length === 0 && <p className="rounded-2xl border border-gray-100 bg-white p-8 text-center text-sm text-gray-500 dark:border-gray-800 dark:bg-gray-950">ابھی کوئی تاثر شامل نہیں کیا گیا۔</p>}
    </div>
  );
}
