import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = { title: "شرائط و ضوابط" };

export default function TermsPage() {
  return (
    <>
      <Navbar />
      <main className="container-x max-w-3xl py-20">
        <h1 className="mb-8 text-4xl font-extrabold">شرائط و ضوابط</h1>
        <div className="space-y-6 leading-8 text-gray-700 dark:text-gray-300">
          <p>Nextgen Creators Academy استعمال کرنے سے پہلے درج ذیل شرائط کو غور سے پڑھیں۔</p>
          <h2 className="text-xl font-bold">اکاؤنٹ کی ذمہ داری</h2>
          <p>آپ اپنے اکاؤنٹ کی معلومات اور پاسورڈ کی حفاظت کے خود ذمہ دار ہیں۔</p>
          <h2 className="text-xl font-bold">مواد کا استعمال</h2>
          <p>کورس کا مواد صرف ذاتی تعلیمی مقاصد کے لیے ہے۔ اسے دوبارہ تقسیم یا فروخت کرنا ممنوع ہے۔</p>
          <h2 className="text-xl font-bold">اکاؤنٹ کی معطلی</h2>
          <p>پالیسی کی خلاف ورزی کی صورت میں انتظامیہ کسی بھی اکاؤنٹ کو معطل کرنے کا حق رکھتی ہے۔</p>
          <h2 className="text-xl font-bold">تبدیلیاں</h2>
          <p>یہ شرائط وقتاً فوقتاً تبدیل ہو سکتی ہیں۔ تبدیلیوں کے بعد ویب سائٹ کا استعمال جاری رکھنے کا مطلب نئی شرائط سے اتفاق ہے۔</p>
        </div>
      </main>
      <Footer />
    </>
  );
}
