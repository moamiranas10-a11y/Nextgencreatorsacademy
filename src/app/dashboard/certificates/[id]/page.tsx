import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatDateUrdu } from "@/lib/utils";
import PrintButton from "@/components/student/PrintButton";
import { Award } from "lucide-react";

export default async function CertificateDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  const certificate = await prisma.certificate.findUnique({
    where: { id: id },
    include: { course: true, user: true },
  });

  if (!certificate || certificate.userId !== session!.user.id) notFound();

  return (
    <div dir="rtl">
      <div className="mb-6 flex justify-end print:hidden">
        <PrintButton />
      </div>

      <div className="mx-auto max-w-3xl rounded-3xl border-8 border-double border-brand-300 bg-white p-12 text-center shadow-sm dark:border-brand-700 dark:bg-gray-950 print:border-brand-400 print:shadow-none">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-brand-600 text-white">
          <Award size={30} />
        </div>
        <p className="mb-1 text-sm font-bold tracking-widest text-brand-600">CERTIFICATE OF COMPLETION</p>
        <h1 className="mb-8 text-3xl font-extrabold text-gray-900 dark:text-gray-50">Nextgen Creators Academy</h1>

        <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">یہ سرٹیفکیٹ عطا کیا جاتا ہے</p>
        <h2 className="mb-6 text-4xl font-extrabold text-brand-700 dark:text-brand-400">{certificate.user.name}</h2>
        <p className="mb-8 leading-8 text-gray-600 dark:text-gray-400">
          کو، جنہوں نے کامیابی کے ساتھ کورس <span className="font-bold text-gray-900 dark:text-gray-50">"{certificate.course.title}"</span> مکمل کیا۔
        </p>

        <div className="mx-auto mb-8 h-1 w-40 rounded-full bg-path-gradient" />

        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
          <span>سرٹیفکیٹ نمبر: {certificate.certificateNo}</span>
          <span>تاریخ اجراء: {formatDateUrdu(certificate.issuedAt)}</span>
        </div>
      </div>

      <p className="mx-auto mt-4 max-w-3xl text-center text-xs text-gray-400 print:hidden">
        اس صفحے کو محفوظ کرنے کے لیے پرنٹ بٹن دبائیں اور "Save as PDF" منتخب کریں۔
      </p>
    </div>
  );
}
