import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import StudentSidebar from "@/components/student/StudentSidebar";
import StudentHeader from "@/components/student/StudentHeader";
import { Toaster } from "react-hot-toast";

export const metadata = { robots: { index: false, follow: false } };

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login?callbackUrl=/dashboard");

  return (
    <div dir="rtl" className="flex min-h-screen bg-gray-50 dark:bg-gray-900 print:bg-white">
      <div className="hidden lg:block print:hidden">
        <StudentSidebar />
      </div>
      <div className="flex min-h-screen flex-1 flex-col">
        <div className="print:hidden">
          <StudentHeader />
        </div>
        <main className="flex-1 p-5 lg:p-8 print:p-0">{children}</main>
      </div>
      <div className="print:hidden">
        <Toaster position="top-center" />
      </div>
    </div>
  );
}
