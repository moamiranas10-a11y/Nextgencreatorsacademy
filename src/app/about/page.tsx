import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Target, Eye, Heart } from "lucide-react";

export const metadata: Metadata = { title: "ہمارے بارے میں" };

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main className="container-x py-20">
        <h1 className="mb-6 text-center text-4xl font-extrabold">ہمارے بارے میں</h1>
        <p className="mx-auto mb-16 max-w-2xl text-center leading-8 text-gray-600 dark:text-gray-400">
          Nextgen Creators Academy کا مقصد پاکستان کے نوجوانوں کو جدید ڈیجیٹل ہنر سکھا کر خود کفیل بنانا ہے۔
          ہم AI، یوٹیوب کریشن اور ویب ڈویلپمنٹ میں مکمل مفت اور عملی تربیت فراہم کرتے ہیں۔
        </p>

        <div className="grid gap-6 sm:grid-cols-3">
          {[
            { icon: Target, title: "ہمارا مشن", desc: "ہر پاکستانی نوجوان کو معیاری ڈیجیٹل تعلیم مفت فراہم کرنا۔" },
            { icon: Eye, title: "ہمارا وژن", desc: "خطے کی سب سے بھروسہ مند اردو آن لائن اکیڈمی بننا۔" },
            { icon: Heart, title: "ہماری اقدار", desc: "معیار، ایمانداری اور طلبہ کی کامیابی ہماری اولین ترجیح ہے۔" },
          ].map((v) => (
            <div key={v.title} className="rounded-2xl border border-gray-100 p-8 text-center dark:border-gray-800">
              <v.icon className="mx-auto mb-4 text-brand-600" size={32} />
              <h3 className="mb-2 font-bold">{v.title}</h3>
              <p className="text-sm leading-7 text-gray-600 dark:text-gray-400">{v.desc}</p>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}
