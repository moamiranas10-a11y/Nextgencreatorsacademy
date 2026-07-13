"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { LayoutDashboard, BookOpen, Award, User, LogOut, Globe } from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { href: "/dashboard", label: "ڈیش بورڈ", icon: LayoutDashboard },
  { href: "/dashboard/courses", label: "میرے کورسز", icon: BookOpen },
  { href: "/dashboard/certificates", label: "سرٹیفکیٹس", icon: Award },
  { href: "/dashboard/profile", label: "پروفائل", icon: User },
];

export default function StudentSidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-full w-64 shrink-0 flex-col border-l border-gray-100 bg-white dark:border-gray-800 dark:bg-gray-950">
      <div className="flex h-16 items-center gap-2 border-b border-gray-100 px-5 font-extrabold text-brand-600 dark:border-gray-800">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-white">N</span>
        اسٹوڈنٹ پینل
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4">
        {items.map((item) => {
          const active = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition",
                active ? "bg-brand-600 text-white" : "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-900"
              )}
            >
              <Icon size={18} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="space-y-1 border-t border-gray-100 px-3 py-4 dark:border-gray-800">
        <Link href="/" className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-900">
          <Globe size={18} /> ویب سائٹ پر جائیں
        </Link>
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30"
        >
          <LogOut size={18} /> لاگ آؤٹ
        </button>
      </div>
    </aside>
  );
}
