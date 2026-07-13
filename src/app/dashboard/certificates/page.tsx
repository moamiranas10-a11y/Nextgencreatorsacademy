import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Award } from "lucide-react";
import { formatDateUrdu } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function CertificatesPage() {
  const session = await getServerSession(authOptions);
  const certificates = await prisma.certificate.findMany({
    where: { userId: session!.user.id },
    include: { course: true },
    orderBy: { issuedAt: "desc" },
  });

  return (
    <div dir="rtl">
      <h1 className="mb-1 text-2xl font-extrabold text-gray-900 dark:text-gray-50">سرٹیفکیٹس</h1>
      <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">آپ کے حاصل کردہ تمام سرٹیفکیٹس</p>

      {certificates.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-10 text-center dark:border-gray-700 dark:bg-gray-950">
          <Award className="mx-auto mb-3 text-gray-300" size={40} />
          <p className="text-sm text-gray-500 dark:text-gray-400">کورس مکمل کریں تاکہ آپ کا پہلا سرٹیفکیٹ یہاں شائع ہو۔</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {certificates.map((c) => (
            <Link key={c.id} href={`/dashboard/certificates/${c.id}`} className="flex items-center gap-4 rounded-2xl border border-gray-100 bg-white p-5 transition hover:border-brand-300 dark:border-gray-800 dark:bg-gray-950">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-600 text-white"><Award size={22} /></div>
              <div>
                <h3 className="font-bold text-gray-900 dark:text-gray-50">{c.course.title}</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">{c.certificateNo} • {formatDateUrdu(c.issuedAt)}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
