import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ContactForm from "@/components/ContactForm";
import { Mail, Phone, MapPin } from "lucide-react";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = { title: "رابطہ کریں" };

export default async function ContactPage() {
  const settings = await prisma.websiteSettings.findUnique({ where: { id: "singleton" } });

  return (
    <>
      <Navbar />
      <main className="container-x py-20">
        <h1 className="mb-3 text-center text-4xl font-extrabold">ہم سے رابطہ کریں</h1>
        <p className="mx-auto mb-14 max-w-xl text-center text-gray-600 dark:text-gray-400">
          کوئی سوال یا مسئلہ ہے؟ ہمیں پیغام بھیجیں، ہم جلد جواب دیں گے۔
        </p>

        <div className="mx-auto grid max-w-4xl gap-10 md:grid-cols-2">
          <div className="space-y-6">
            <div className="flex items-start gap-3">
              <Mail className="mt-1 text-brand-600" size={20} />
              <div>
                <p className="font-bold">ای میل</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">{settings?.contactEmail || "info@nextgenacademy.pk"}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Phone className="mt-1 text-brand-600" size={20} />
              <div>
                <p className="font-bold">فون / واٹس ایپ</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">{settings?.whatsappNumber || "+92 300 0000000"}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <MapPin className="mt-1 text-brand-600" size={20} />
              <div>
                <p className="font-bold">پتہ</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">{settings?.contactAddress || "پاکستان"}</p>
              </div>
            </div>
          </div>

          <ContactForm />
        </div>
      </main>
      <Footer />
    </>
  );
}
