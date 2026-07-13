"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Loader2, Lock, Mail, User, Phone } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const payload = Object.fromEntries(formData.entries());

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "رجسٹریشن ناکام ہوئی");

      const signInRes = await signIn("credentials", {
        email: payload.email,
        password: payload.password,
        redirect: false,
      });

      if (signInRes?.error) throw new Error("اکاؤنٹ بن گیا، براہ کرم لاگ ان کریں۔");

      router.push("/dashboard");
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Navbar />
      <main className="container-x flex min-h-[70vh] items-center justify-center py-16">
        <div className="w-full max-w-md rounded-2xl border border-gray-100 bg-white p-8 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <h1 className="mb-2 text-center text-2xl font-extrabold">اکاؤنٹ بنائیں</h1>
          <p className="mb-8 text-center text-sm text-gray-600 dark:text-gray-400">مفت رجسٹریشن کر کے سیکھنا شروع کریں</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <User className="absolute right-3 top-3.5 text-gray-400" size={18} />
              <input name="name" required placeholder="پورا نام" className="w-full rounded-xl border border-gray-200 py-3 pl-4 pr-10 text-sm dark:border-gray-700 dark:bg-gray-800" />
            </div>
            <div className="relative">
              <Mail className="absolute right-3 top-3.5 text-gray-400" size={18} />
              <input name="email" type="email" required placeholder="ای میل ایڈریس" className="w-full rounded-xl border border-gray-200 py-3 pl-4 pr-10 text-sm dark:border-gray-700 dark:bg-gray-800" />
            </div>
            <div className="relative">
              <Phone className="absolute right-3 top-3.5 text-gray-400" size={18} />
              <input name="phone" placeholder="فون نمبر (اختیاری)" className="w-full rounded-xl border border-gray-200 py-3 pl-4 pr-10 text-sm dark:border-gray-700 dark:bg-gray-800" />
            </div>
            <div className="relative">
              <Lock className="absolute right-3 top-3.5 text-gray-400" size={18} />
              <input name="password" type="password" required placeholder="پاسورڈ (کم از کم 8 حروف)" className="w-full rounded-xl border border-gray-200 py-3 pl-4 pr-10 text-sm dark:border-gray-700 dark:bg-gray-800" />
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}

            <button type="submit" disabled={loading} className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-600 py-3.5 font-bold text-white hover:bg-brand-700 disabled:opacity-60">
              {loading && <Loader2 className="animate-spin" size={18} />} رجسٹر کریں
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
            پہلے سے اکاؤنٹ ہے؟ <Link href="/login" className="font-bold text-brand-600">لاگ ان کریں</Link>
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
