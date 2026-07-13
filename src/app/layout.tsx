import type { Metadata } from "next";
import "./globals.css";
import SessionProvider from "@/components/providers/SessionProvider";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
const academyName = process.env.NEXT_PUBLIC_ACADEMY_NAME || "Nextgen Creators Academy";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${academyName} — AI، YouTube اور Web Development سیکھیں`,
    template: `%s | ${academyName}`,
  },
  description:
    "پاکستان کی جدید ترین آن لائن اکیڈمی جہاں آپ AI، یوٹیوب کریشن اور ویب ڈویلپمنٹ کی عملی تربیت حاصل کر سکتے ہیں۔",
  openGraph: {
    type: "website",
    locale: "ur_PK",
    url: siteUrl,
    siteName: academyName,
    title: `${academyName} — اپنی ڈیجیٹل کامیابی کا سفر آج ہی شروع کریں`,
    description:
      "AI، YouTube اور Website Development کی جدید اور عملی تربیت — مکمل مفت۔",
  },
  twitter: {
    card: "summary_large_image",
    title: academyName,
    description: "AI، YouTube اور Website Development کی جدید اور عملی تربیت۔",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ur" dir="rtl" className="scroll-smooth">
      <body className="min-h-screen bg-white text-gray-900 antialiased dark:bg-gray-950 dark:text-gray-100">
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
