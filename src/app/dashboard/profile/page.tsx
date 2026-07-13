"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
import { Loader2, Save, KeyRound } from "lucide-react";

const inputClass = "w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm dark:border-gray-700 dark:bg-gray-900";
const labelClass = "mb-1.5 block text-sm font-semibold";

export default function ProfilePage() {
  const { data: session, update } = useSession();
  const [name, setName] = useState(session?.user.name || "");
  const [phone, setPhone] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [savingPassword, setSavingPassword] = useState(false);

  async function saveProfile(e: React.FormEvent) {
    e.preventDefault();
    setSavingProfile(true);
    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone: phone || undefined }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      toast.success("پروفائل محفوظ ہو گئی");
      await update({ name });
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setSavingProfile(false);
    }
  }

  async function changePassword(e: React.FormEvent) {
    e.preventDefault();
    setSavingPassword(true);
    try {
      const res = await fetch("/api/profile/password", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      toast.success("پاسورڈ تبدیل ہو گیا");
      setCurrentPassword("");
      setNewPassword("");
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setSavingPassword(false);
    }
  }

  return (
    <div dir="rtl" className="max-w-2xl space-y-8">
      <div>
        <h1 className="mb-1 text-2xl font-extrabold text-gray-900 dark:text-gray-50">پروفائل</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">اپنی معلومات اور پاسورڈ منظم کریں</p>
      </div>

      <form onSubmit={saveProfile} className="space-y-4 rounded-2xl border border-gray-100 bg-white p-6 dark:border-gray-800 dark:bg-gray-950">
        <h2 className="font-bold">بنیادی معلومات</h2>
        <div>
          <label className={labelClass}>پورا نام</label>
          <input className={inputClass} value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div>
          <label className={labelClass}>ای میل</label>
          <input className={inputClass} value={session?.user.email || ""} disabled />
        </div>
        <div>
          <label className={labelClass}>فون نمبر</label>
          <input className={inputClass} value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="03XXXXXXXXX" />
        </div>
        <button disabled={savingProfile} className="flex items-center gap-2 rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-bold text-white disabled:opacity-60">
          {savingProfile ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />} محفوظ کریں
        </button>
      </form>

      <form onSubmit={changePassword} className="space-y-4 rounded-2xl border border-gray-100 bg-white p-6 dark:border-gray-800 dark:bg-gray-950">
        <h2 className="font-bold">پاسورڈ تبدیل کریں</h2>
        <div>
          <label className={labelClass}>موجودہ پاسورڈ</label>
          <input type="password" className={inputClass} value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} required />
        </div>
        <div>
          <label className={labelClass}>نیا پاسورڈ</label>
          <input type="password" className={inputClass} value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
        </div>
        <button disabled={savingPassword} className="flex items-center gap-2 rounded-xl bg-gray-900 px-5 py-2.5 text-sm font-bold text-white disabled:opacity-60 dark:bg-brand-600">
          {savingPassword ? <Loader2 size={15} className="animate-spin" /> : <KeyRound size={15} />} پاسورڈ تبدیل کریں
        </button>
      </form>
    </div>
  );
}
