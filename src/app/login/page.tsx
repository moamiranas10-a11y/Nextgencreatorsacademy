"use client";

import { useState, Suspense } from "react";
import { signIn, getSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Loader2, Lock, Mail } from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const res = await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirect: false,
    });

    setLoading(false);

    if (res?.error) {
      setError("ای میل یا پاسورڈ درست نہیں ہے۔");
      return;
    }

    const callbackUrl = params.get("callbackUrl");
    if (callbackUrl) {
      router.push(callbackUrl);
    } else {
      const session = await getSession();
      router.push(session?.user.role === "SUPER_ADMIN" ? "/admin" : "/dashboard");
    }
    router.refresh();
  }

  return (
    <main className="container-x flex min-h-[70vh] items-center justify-center py-16">
      <div className="w-full max-w-md rounded-2xl border border-gray-100 bg-white p-8 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <h1 className="mb-2 text-center text-2xl font-extrabold">خوش آمدید</h1>
        <p className="mb-8 text-center text-sm text-gray-600 dark:text-gray-400">اپنے اکاؤنٹ میں لاگ ان کریں</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Mail className="absolute right-3 top-3.5 text-gray-400" size={18} />
            <input name="email" type="email" required placeholder="ای میل ایڈریس" className="w-full rounded-xl border border-gray-200 py-3 pl-4 pr-10 text-sm dark:border-gray-700 dark:bg-gray-800" />
          </div>
          <div className="relative">
            <Lock className="absolute right-3 top-3.5 text-gray-400" size={18} />
            <input name="password" type="password" required placeholder="پاسورڈ" className="w-full rounded-xl border border-gray-200 py-3 pl-4 pr-10 text-sm dark:border-gray-700 dark:bg-gray-800" />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button type="submit" disabled={loading} className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-600 py-3.5 font-bold text-white hover:bg-brand-700 disabled:opacity-60">
            {loading && <Loader2 className="animate-spin" size={18} />} لاگ ان کریں
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
          اکاؤنٹ نہیں ہے؟ <Link href="/register" className="font-bold text-brand-600">رجسٹر کریں</Link>
        </p>
      </div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <>
      <Navbar />
      <Suspense>
        <LoginForm />
      </Suspense>
      <Footer />
    </>
  );
}
