"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Trash2, Mail, MailOpen } from "lucide-react";
import { formatDateUrdu } from "@/lib/utils";

type Message = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string | null;
  message: string;
  isRead: boolean;
  createdAt: string;
};

export default function AdminMessagesPage() {
  const [items, setItems] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const res = await fetch("/api/contact");
    setItems(await res.json());
    setLoading(false);
  }
  useEffect(() => {
    load();
  }, []);

  async function markRead(m: Message) {
    await fetch(`/api/contact/${m.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ isRead: !m.isRead }) });
    load();
  }

  async function remove(id: string) {
    if (!confirm("یہ پیغام حذف کریں؟")) return;
    await fetch(`/api/contact/${id}`, { method: "DELETE" });
    toast.success("حذف ہو گیا");
    load();
  }

  return (
    <div dir="rtl">
      <h1 className="mb-1 text-2xl font-extrabold text-gray-900 dark:text-gray-50">پیغامات</h1>
      <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">رابطہ فارم کے ذریعے آنے والے پیغامات</p>

      <div className="space-y-3">
        {items.map((m) => (
          <div key={m.id} className={`rounded-2xl border p-5 ${m.isRead ? "border-gray-100 bg-white dark:border-gray-800 dark:bg-gray-950" : "border-brand-200 bg-brand-50/50 dark:border-brand-900 dark:bg-brand-950/20"}`}>
            <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
              <div>
                <span className="font-bold text-gray-900 dark:text-gray-50">{m.name}</span>
                <span className="mr-3 text-sm text-gray-500">{m.email}</span>
                {m.phone && <span className="mr-3 text-sm text-gray-500">{m.phone}</span>}
              </div>
              <div className="flex items-center gap-3 text-xs">
                <span className="text-gray-400">{formatDateUrdu(m.createdAt)}</span>
                <button onClick={() => markRead(m)} className="text-gray-500 hover:text-brand-600" title={m.isRead ? "غیر پڑھا ہوا نشان زد کریں" : "پڑھا ہوا نشان زد کریں"}>
                  {m.isRead ? <MailOpen size={16} /> : <Mail size={16} />}
                </button>
                <button onClick={() => remove(m.id)} className="text-red-500 hover:text-red-700"><Trash2 size={16} /></button>
              </div>
            </div>
            {m.subject && <p className="mb-1 text-sm font-semibold text-gray-700 dark:text-gray-300">موضوع: {m.subject}</p>}
            <p className="text-sm text-gray-600 dark:text-gray-400">{m.message}</p>
          </div>
        ))}
        {!loading && items.length === 0 && <p className="rounded-2xl border border-gray-100 bg-white p-8 text-center text-sm text-gray-500 dark:border-gray-800 dark:bg-gray-950">ابھی کوئی پیغام موصول نہیں ہوا۔</p>}
      </div>
    </div>
  );
}
