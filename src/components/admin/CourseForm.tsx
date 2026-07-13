"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";
import { slugify } from "@/lib/utils";

type CourseInitial = {
  id?: string;
  title?: string;
  slug?: string;
  description?: string;
  shortDesc?: string | null;
  thumbnailUrl?: string | null;
  price?: number | string;
  isFree?: boolean;
  status?: "DRAFT" | "PUBLISHED";
  seoTitle?: string | null;
  seoDescription?: string | null;
};

export default function CourseForm({ initial }: { initial?: CourseInitial }) {
  const router = useRouter();
  const isEdit = Boolean(initial?.id);
  const [title, setTitle] = useState(initial?.title || "");
  const [slug, setSlug] = useState(initial?.slug || "");
  const [slugTouched, setSlugTouched] = useState(isEdit);
  const [description, setDescription] = useState(initial?.description || "");
  const [shortDesc, setShortDesc] = useState(initial?.shortDesc || "");
  const [thumbnailUrl, setThumbnailUrl] = useState(initial?.thumbnailUrl || "");
  const [isFree, setIsFree] = useState(initial?.isFree ?? true);
  const [price, setPrice] = useState(String(initial?.price ?? 0));
  const [status, setStatus] = useState(initial?.status || "DRAFT");
  const [seoTitle, setSeoTitle] = useState(initial?.seoTitle || "");
  const [seoDescription, setSeoDescription] = useState(initial?.seoDescription || "");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        title,
        slug,
        description,
        shortDesc: shortDesc || undefined,
        thumbnailUrl: thumbnailUrl || undefined,
        price: Number(price) || 0,
        isFree,
        status,
        seoTitle: seoTitle || undefined,
        seoDescription: seoDescription || undefined,
      };
      const res = await fetch(isEdit ? `/api/courses/${initial!.id}` : "/api/courses", {
        method: isEdit ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "کچھ غلط ہو گیا");
      toast.success(isEdit ? "کورس اپ ڈیٹ ہو گیا" : "کورس بن گیا");
      router.push("/admin/courses");
      router.refresh();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }

  const inputClass =
    "w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm dark:border-gray-700 dark:bg-gray-900";

  return (
    <form onSubmit={handleSubmit} dir="rtl" className="max-w-3xl space-y-5 rounded-2xl border border-gray-100 bg-white p-6 dark:border-gray-800 dark:bg-gray-950">
      <div>
        <label className="mb-1.5 block text-sm font-semibold">کورس کا عنوان</label>
        <input
          className={inputClass}
          value={title}
          required
          onChange={(e) => {
            setTitle(e.target.value);
            if (!slugTouched) setSlug(slugify(e.target.value));
          }}
        />
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-semibold">Slug (URL)</label>
        <input
          className={inputClass}
          value={slug}
          required
          onChange={(e) => {
            setSlug(slugify(e.target.value));
            setSlugTouched(true);
          }}
        />
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-semibold">مختصر تفصیل</label>
        <input className={inputClass} value={shortDesc} onChange={(e) => setShortDesc(e.target.value)} maxLength={300} />
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-semibold">مکمل تفصیل</label>
        <textarea className={inputClass} rows={5} value={description} required onChange={(e) => setDescription(e.target.value)} />
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-semibold">تھمب نیل تصویر کا URL</label>
        <input className={inputClass} value={thumbnailUrl} onChange={(e) => setThumbnailUrl(e.target.value)} placeholder="https://..." />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1.5 block text-sm font-semibold">قیمت کی قسم</label>
          <select className={inputClass} value={isFree ? "free" : "paid"} onChange={(e) => setIsFree(e.target.value === "free")}>
            <option value="free">مفت</option>
            <option value="paid">ادا شدہ</option>
          </select>
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-semibold">قیمت (PKR)</label>
          <input type="number" min={0} className={inputClass} value={price} disabled={isFree} onChange={(e) => setPrice(e.target.value)} />
        </div>
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-semibold">حیثیت</label>
        <select className={inputClass} value={status} onChange={(e) => setStatus(e.target.value as "DRAFT" | "PUBLISHED")}>
          <option value="DRAFT">ڈرافٹ</option>
          <option value="PUBLISHED">شائع شدہ</option>
        </select>
      </div>

      <fieldset className="rounded-xl border border-dashed border-gray-200 p-4 dark:border-gray-700">
        <legend className="px-2 text-xs font-bold text-gray-500">SEO سیٹنگز (اختیاری)</legend>
        <div className="space-y-3">
          <input className={inputClass} placeholder="SEO عنوان" value={seoTitle} onChange={(e) => setSeoTitle(e.target.value)} />
          <input className={inputClass} placeholder="SEO تفصیل" value={seoDescription} onChange={(e) => setSeoDescription(e.target.value)} />
        </div>
      </fieldset>

      <button type="submit" disabled={loading} className="flex items-center gap-2 rounded-xl bg-brand-600 px-6 py-3 text-sm font-bold text-white hover:bg-brand-700 disabled:opacity-60">
        {loading && <Loader2 size={16} className="animate-spin" />}
        {isEdit ? "تبدیلیاں محفوظ کریں" : "کورس بنائیں"}
      </button>
    </form>
  );
}
