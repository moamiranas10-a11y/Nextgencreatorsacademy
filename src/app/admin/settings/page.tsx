"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Loader2, Save } from "lucide-react";

const inputClass = "w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm dark:border-gray-700 dark:bg-gray-900";
const labelClass = "mb-1.5 block text-sm font-semibold";

type Settings = Record<string, string | null>;

export default function AdminSettingsPage() {
  const [form, setForm] = useState<Settings>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((json) => {
        setForm(json);
        setLoading(false);
      });
  }, []);

  function set(key: string, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      toast.success("سیٹنگز محفوظ ہو گئیں");
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <p dir="rtl" className="text-sm text-gray-500">لوڈ ہو رہا ہے...</p>;

  return (
    <div dir="rtl">
      <h1 className="mb-1 text-2xl font-extrabold text-gray-900 dark:text-gray-50">ویب سائٹ سیٹنگز</h1>
      <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">اکیڈمی کی عمومی معلومات اور مواد ترمیم کریں</p>

      <form onSubmit={submit} className="max-w-3xl space-y-8">
        <section className="space-y-4 rounded-2xl border border-gray-100 bg-white p-6 dark:border-gray-800 dark:bg-gray-950">
          <h2 className="font-bold">عمومی معلومات</h2>
          <div>
            <label className={labelClass}>اکیڈمی کا نام</label>
            <input className={inputClass} value={form.academyName || ""} onChange={(e) => set("academyName", e.target.value)} />
          </div>
          <div>
            <label className={labelClass}>لوگو URL</label>
            <input className={inputClass} value={form.logoUrl || ""} onChange={(e) => set("logoUrl", e.target.value)} />
          </div>
        </section>

        <section className="space-y-4 rounded-2xl border border-gray-100 bg-white p-6 dark:border-gray-800 dark:bg-gray-950">
          <h2 className="font-bold">ہیرو سیکشن</h2>
          <div>
            <label className={labelClass}>ہیرو ہیڈنگ</label>
            <textarea className={inputClass} rows={2} value={form.heroHeading || ""} onChange={(e) => set("heroHeading", e.target.value)} />
          </div>
          <div>
            <label className={labelClass}>ہیرو سب ہیڈنگ</label>
            <textarea className={inputClass} rows={2} value={form.heroSubheading || ""} onChange={(e) => set("heroSubheading", e.target.value)} />
          </div>
        </section>

        <section className="space-y-4 rounded-2xl border border-gray-100 bg-white p-6 dark:border-gray-800 dark:bg-gray-950">
          <h2 className="font-bold">رابطہ اور سوشل لنکس</h2>
          <div className="grid grid-cols-2 gap-4">
            <div><label className={labelClass}>واٹس ایپ نمبر</label><input className={inputClass} value={form.whatsappNumber || ""} onChange={(e) => set("whatsappNumber", e.target.value)} placeholder="923000000000" /></div>
            <div><label className={labelClass}>رابطہ ای میل</label><input className={inputClass} value={form.contactEmail || ""} onChange={(e) => set("contactEmail", e.target.value)} /></div>
            <div><label className={labelClass}>رابطہ فون</label><input className={inputClass} value={form.contactPhone || ""} onChange={(e) => set("contactPhone", e.target.value)} /></div>
            <div><label className={labelClass}>پتہ</label><input className={inputClass} value={form.contactAddress || ""} onChange={(e) => set("contactAddress", e.target.value)} /></div>
            <div><label className={labelClass}>فیس بک</label><input className={inputClass} value={form.facebookUrl || ""} onChange={(e) => set("facebookUrl", e.target.value)} /></div>
            <div><label className={labelClass}>انسٹاگرام</label><input className={inputClass} value={form.instagramUrl || ""} onChange={(e) => set("instagramUrl", e.target.value)} /></div>
            <div><label className={labelClass}>یوٹیوب</label><input className={inputClass} value={form.youtubeUrl || ""} onChange={(e) => set("youtubeUrl", e.target.value)} /></div>
            <div><label className={labelClass}>ٹک ٹاک</label><input className={inputClass} value={form.tiktokUrl || ""} onChange={(e) => set("tiktokUrl", e.target.value)} /></div>
          </div>
        </section>

        <section className="space-y-4 rounded-2xl border border-gray-100 bg-white p-6 dark:border-gray-800 dark:bg-gray-950">
          <h2 className="font-bold">SEO سیٹنگز</h2>
          <div><label className={labelClass}>SEO عنوان</label><input className={inputClass} value={form.seoTitle || ""} onChange={(e) => set("seoTitle", e.target.value)} /></div>
          <div><label className={labelClass}>SEO تفصیل</label><textarea className={inputClass} rows={2} value={form.seoDescription || ""} onChange={(e) => set("seoDescription", e.target.value)} /></div>
        </section>

        <button disabled={saving} className="flex items-center gap-2 rounded-xl bg-brand-600 px-6 py-3 text-sm font-bold text-white hover:bg-brand-700 disabled:opacity-60">
          {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />} تمام تبدیلیاں محفوظ کریں
        </button>
      </form>
    </div>
  );
}
