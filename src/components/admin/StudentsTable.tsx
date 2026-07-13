"use client";

import { useEffect, useState, useCallback } from "react";
import toast from "react-hot-toast";
import { Search, Ban, CheckCircle2, Pencil, Trash2, Loader2 } from "lucide-react";
import { formatDateUrdu } from "@/lib/utils";

type Student = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  isSuspended: boolean;
  createdAt: string;
  _count: { enrollments: number; certificates: number };
};

export default function StudentsTable() {
  const [students, setStudents] = useState<Student[]>([]);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Student | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = useCallback(async (query: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/students${query ? `?q=${encodeURIComponent(query)}` : ""}`);
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      setStudents(json);
    } catch (err: any) {
      toast.error(err.message || "طلباء لوڈ نہیں ہو سکے");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => load(q), 300);
    return () => clearTimeout(timer);
  }, [q, load]);

  async function toggleSuspend(s: Student) {
    setBusyId(s.id);
    try {
      const res = await fetch(`/api/students/${s.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isSuspended: !s.isSuspended }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      toast.success(s.isSuspended ? "اکاؤنٹ بحال ہو گیا" : "اکاؤنٹ معطل ہو گیا");
      load(q);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setBusyId(null);
    }
  }

  async function saveEdit(e: React.FormEvent) {
    e.preventDefault();
    if (!editing) return;
    setBusyId(editing.id);
    try {
      const res = await fetch(`/api/students/${editing.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: editing.name, phone: editing.phone || undefined }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      toast.success("تفصیلات محفوظ ہو گئیں");
      setEditing(null);
      load(q);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setBusyId(null);
    }
  }

  async function remove(s: Student) {
    if (!confirm(`${s.name} کو حذف کریں؟ یہ عمل واپس نہیں ہو سکتا۔`)) return;
    setBusyId(s.id);
    try {
      const res = await fetch(`/api/students/${s.id}`, { method: "DELETE" });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      toast.success("طالب علم حذف ہو گیا");
      load(q);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div dir="rtl">
      <div className="mb-5 flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 dark:border-gray-700 dark:bg-gray-950">
        <Search size={17} className="text-gray-400" />
        <input
          className="w-full bg-transparent text-sm outline-none"
          placeholder="نام یا ای میل سے تلاش کریں..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
      </div>

      <div className="overflow-x-auto rounded-2xl border border-gray-100 bg-white dark:border-gray-800 dark:bg-gray-950">
        <table className="w-full text-right text-sm">
          <thead className="bg-gray-50 text-gray-500 dark:bg-gray-900 dark:text-gray-400">
            <tr>
              <th className="px-5 py-3 font-semibold">نام</th>
              <th className="px-5 py-3 font-semibold">ای میل</th>
              <th className="px-5 py-3 font-semibold">داخلے</th>
              <th className="px-5 py-3 font-semibold">سرٹیفکیٹس</th>
              <th className="px-5 py-3 font-semibold">شمولیت</th>
              <th className="px-5 py-3 font-semibold">حیثیت</th>
              <th className="px-5 py-3 font-semibold">اعمال</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {students.map((s) => (
              <tr key={s.id}>
                <td className="px-5 py-4 font-bold text-gray-900 dark:text-gray-50">{s.name}</td>
                <td className="px-5 py-4 text-gray-600 dark:text-gray-400">{s.email}</td>
                <td className="px-5 py-4 text-gray-600 dark:text-gray-400">{s._count.enrollments}</td>
                <td className="px-5 py-4 text-gray-600 dark:text-gray-400">{s._count.certificates}</td>
                <td className="px-5 py-4 text-gray-600 dark:text-gray-400">{formatDateUrdu(s.createdAt)}</td>
                <td className="px-5 py-4">
                  <span className={`rounded-full px-3 py-1 text-xs font-bold ${s.isSuspended ? "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400" : "bg-teal-100 text-teal-700 dark:bg-teal-950 dark:text-teal-400"}`}>
                    {s.isSuspended ? "معطل" : "فعال"}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <button onClick={() => setEditing(s)} className="text-gray-500 hover:text-brand-600"><Pencil size={16} /></button>
                    <button disabled={busyId === s.id} onClick={() => toggleSuspend(s)} className="text-gray-500 hover:text-brand-600 disabled:opacity-50">
                      {busyId === s.id ? <Loader2 size={16} className="animate-spin" /> : s.isSuspended ? <CheckCircle2 size={16} /> : <Ban size={16} />}
                    </button>
                    <button disabled={busyId === s.id} onClick={() => remove(s)} className="text-red-500 hover:text-red-700 disabled:opacity-50"><Trash2 size={16} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!loading && students.length === 0 && <p className="p-8 text-center text-sm text-gray-500">کوئی طالب علم نہیں ملا۔</p>}
        {loading && <p className="p-8 text-center text-sm text-gray-500">لوڈ ہو رہا ہے...</p>}
      </div>

      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <form onSubmit={saveEdit} className="w-full max-w-md space-y-4 rounded-2xl bg-white p-6 dark:bg-gray-950">
            <h3 className="font-bold">طالب علم میں ترمیم کریں</h3>
            <input
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-900"
              value={editing.name}
              onChange={(e) => setEditing({ ...editing, name: e.target.value })}
            />
            <input
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-900"
              value={editing.phone || ""}
              placeholder="فون نمبر"
              onChange={(e) => setEditing({ ...editing, phone: e.target.value })}
            />
            <div className="flex justify-end gap-2">
              <button type="button" onClick={() => setEditing(null)} className="rounded-lg border px-4 py-2 text-sm font-semibold">منسوخ کریں</button>
              <button type="submit" className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-bold text-white">محفوظ کریں</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
