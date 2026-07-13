import Link from "next/link";
import { Facebook, Instagram, Youtube, MessageCircle } from "lucide-react";

export default function Footer() {
  const whatsapp = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "923000000000";

  return (
    <footer className="border-t border-gray-100 bg-gray-50 dark:border-gray-800 dark:bg-gray-900">
      <div className="container-x grid gap-10 py-14 md:grid-cols-4">
        <div>
          <h3 className="mb-3 text-lg font-extrabold text-brand-700 dark:text-brand-400">Nextgen Creators Academy</h3>
          <p className="text-sm leading-7 text-gray-600 dark:text-gray-400">
            پاکستان کی جدید ترین آن لائن اکیڈمی — AI، یوٹیوب اور ویب ڈویلپمنٹ کی عملی تربیت۔
          </p>
        </div>

        <div>
          <h4 className="mb-3 font-bold">فوری لنکس</h4>
          <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
            <li><Link href="/courses" className="hover:text-brand-600">کورسز</Link></li>
            <li><Link href="/about" className="hover:text-brand-600">ہمارے بارے میں</Link></li>
            <li><Link href="/contact" className="hover:text-brand-600">رابطہ کریں</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="mb-3 font-bold">قانونی</h4>
          <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
            <li><Link href="/privacy-policy" className="hover:text-brand-600">پرائیویسی پالیسی</Link></li>
            <li><Link href="/terms" className="hover:text-brand-600">شرائط و ضوابط</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="mb-3 font-bold">سوشل میڈیا</h4>
          <div className="flex gap-3">
            <a href={`https://wa.me/${whatsapp}`} target="_blank" rel="noopener noreferrer" className="rounded-full bg-white p-2.5 shadow-sm dark:bg-gray-800"><MessageCircle size={18} /></a>
            <a href="#" className="rounded-full bg-white p-2.5 shadow-sm dark:bg-gray-800"><Facebook size={18} /></a>
            <a href="#" className="rounded-full bg-white p-2.5 shadow-sm dark:bg-gray-800"><Instagram size={18} /></a>
            <a href="#" className="rounded-full bg-white p-2.5 shadow-sm dark:bg-gray-800"><Youtube size={18} /></a>
          </div>
        </div>
      </div>
      <div className="border-t border-gray-100 py-6 text-center text-xs text-gray-500 dark:border-gray-800">
        © {new Date().getFullYear()} Nextgen Creators Academy — تمام حقوق محفوظ ہیں۔
      </div>
    </footer>
  );
}
