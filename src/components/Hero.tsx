"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Sparkles } from "lucide-react";

export default function Hero({ heading, subheading }: { heading: string; subheading: string }) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-brand-50 to-white py-24 dark:from-gray-900 dark:to-gray-950">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-brand-100/60 via-transparent to-transparent dark:from-brand-900/20" />
      <div className="container-x relative text-center">
        <motion.span
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 inline-flex items-center gap-2 rounded-full bg-brand-100 px-4 py-1.5 text-sm font-semibold text-brand-700 dark:bg-brand-900/40 dark:text-brand-300"
        >
          <Sparkles size={16} /> مکمل مفت آن لائن اکیڈمی
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mx-auto max-w-4xl text-4xl font-extrabold leading-[1.4] text-gray-900 sm:text-5xl dark:text-white"
        >
          {heading}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-gray-600 dark:text-gray-400"
        >
          {subheading}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
        >
          <Link href="/register" className="flex items-center gap-2 rounded-xl bg-brand-600 px-7 py-3.5 text-base font-bold text-white shadow-lg shadow-brand-600/20 transition hover:bg-brand-700">
            ابھی شروع کریں <ArrowLeft size={18} />
          </Link>
          <Link href="/courses" className="rounded-xl border border-gray-300 px-7 py-3.5 text-base font-bold text-gray-700 transition hover:bg-gray-50 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800">
            کورسز دیکھیں
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
