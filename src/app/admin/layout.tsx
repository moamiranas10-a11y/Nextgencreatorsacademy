import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";
import { Toaster } from "react-hot-toast";

export const metadata = { robots: { index: false, follow: false } };

// Defense in depth: middleware already blocks non-admins from /admin/**,
// but every server component re-checks the session directly too.
export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "SUPER_ADMIN") {
    redirect("/login?callbackUrl=/admin");
  }

  return (
    <div dir="rtl" className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="hidden lg:block">
        <AdminSidebar />
      </div>
      <div className="flex min-h-screen flex-1 flex-col">
        <AdminHeader title="ایڈمن پینل" />
        <main className="flex-1 p-5 lg:p-8">{children}</main>
      </div>
      <Toaster position="top-center" />
    </div>
  );
}
