import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = { title: "پرائیویسی پالیسی" };

export default function PrivacyPolicyPage() {
  return (
    <>
      <Navbar />
      <main className="container-x max-w-3xl py-20">
        <h1 className="mb-8 text-4xl font-extrabold">پرائیویسی پالیسی</h1>
        <div className="space-y-6 leading-8 text-gray-700 dark:text-gray-300">
          <p>ہم آپ کی رازداری کا احترام کرتے ہیں اور آپ کا ذاتی ڈیٹا مکمل طور پر محفوظ رکھتے ہیں۔</p>
          <h2 className="text-xl font-bold">ہم کیا ڈیٹا جمع کرتے ہیں</h2>
          <p>رجسٹریشن کے دوران نام، ای میل اور فون نمبر جیسی معلومات جمع کی جاتی ہیں تاکہ آپ کو بہتر سہولت فراہم کی جا سکے۔</p>
          <h2 className="text-xl font-bold">ڈیٹا کا استعمال</h2>
          <p>آپ کا ڈیٹا صرف تعلیمی سہولیات فراہم کرنے، پیشرفت ٹریک کرنے اور رابطے کے لیے استعمال ہوتا ہے۔ ہم آپ کا ڈیٹا کسی تیسرے فریق کو فروخت یا شیئر نہیں کرتے۔</p>
          <h2 className="text-xl font-bold">ڈیٹا کی حفاظت</h2>
          <p>تمام پاسورڈز خفیہ (encrypted) شکل میں محفوظ کیے جاتے ہیں اور جدید سیکیورٹی اقدامات کے ذریعے آپ کے اکاؤنٹ کی حفاظت کی جاتی ہے۔</p>
          <h2 className="text-xl font-bold">رابطہ</h2>
          <p>پرائیویسی سے متعلق کسی بھی سوال کے لیے ہمارے رابطہ صفحہ کے ذریعے ہم سے رابطہ کریں۔</p>
        </div>
      </main>
      <Footer />
    </>
  );
}
