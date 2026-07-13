"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Plus, Trash2, Pencil, Loader2, Eye, EyeOff } from "lucide-react";

type Faq = { id: string; question: string; answer: string; order: number; isPublished: boolean };

const inputClass = "w-full rounded-lg border border-gray-200 px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-900";
const emptyForm = { id: "", question: "", answer: "" };

export default function AdminFaqPage() {
  const [items, setItems] = useState<Faq[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);

  async function load() {
    const res = await fetch("/api/faq?all=1");
    setItems(await res.json());
  }
  useEffect(() => {
    load();
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(form.id ? `/api/faq/${form.id}` : "/api/faq", {
        method: form.id ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: form.question, answer: form.answer, order: items.length }),
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

  async function toggle(f: Faq) {
    await fetch(`/api/faq/${f.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ isPublished: !f.isPublished }) });
    load();
  }

  async function remove(id: string) {
    if (!confirm("یہ سوال حذف کریں؟")) return;
    await fetch(`/api/faq/${id}`, { method: "DELETE" });
    toast.success("حذف ہو گیا");
    load();
  }

  return (
    <div dir="rtl">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 dark:text-gray-50">سوالات و جوابات</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">FAQ سیکشن کا مواد منظم کریں</p>
        </div>
        <button onClick={() => { setForm(emptyForm); setShowForm(!showForm); }} className="flex items-center gap-2 rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-brand-700">
          <Plus size={16} /> نیا سوال
        </button>
      </div>

      {showForm && (
        <form onSubmit={submit} className="mb-6 space-y-3 rounded-2xl border border-gray-100 bg-white p-5 dark:border-gray-800 dark:bg-gray-950">
          <input className={inputClass} placeholder="سوال" required value={form.question} onChange={(e) => setForm({ ...form, question: e.target.value })} />
          <textarea className={inputClass} placeholder="جواب" required rows={3} value={form.answer} onChange={(e) => setForm({ ...form, answer: e.target.value })} />
          <button disabled={loading} className="flex items-center gap-2 rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-bold text-white disabled:opacity-60">
            {loading && <Loader2 size={15} className="animate-spin" />} محفوظ کریں
          </button>
        </form>
      )}

      <div className="space-y-3">
        {items.map((f) => (
          <div key={f.id} className="rounded-2xl border border-gray-100 bg-white p-5 dark:border-gray-800 dark:bg-gray-950">
            <div className="mb-1.5 flex items-start justify-between gap-3">
              <h3 className="font-bold">{f.question}</h3>
              <div className="flex shrink-0 items-center gap-3 text-xs">
                <button onClick={() => { setForm({ id: f.id, question: f.question, answer: f.answer }); setShowForm(true); }} className="text-gray-500 hover:text-brand-600"><Pencil size={14} /></button>
                <button onClick={() => toggle(f)} className="text-gray-500 hover:text-brand-600">{f.isPublished ? <EyeOff size={14} /> : <Eye size={14} />}</button>
                <button onClick={() => remove(f.id)} className="text-red-500 hover:text-red-700"><Trash2 size={14} /></button>
              </div>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">{f.answer}</p>
          </div>
        ))}
        {items.length === 0 && <p className="rounded-2xl border border-gray-100 bg-white p-8 text-center text-sm text-gray-500 dark:border-gray-800 dark:bg-gray-950">ابھی کوئی سوال شامل نہیں کیا گیا۔</p>}
      </div>
    </div>
  );
}
