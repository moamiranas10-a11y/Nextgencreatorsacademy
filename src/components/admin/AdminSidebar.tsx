"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard,
  BookOpen,
  Users,
  MessageSquareQuote,
  HelpCircle,
  Mail,
  Settings,
  LogOut,
  Globe,
} from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { href: "/admin", label: "ڈیش بورڈ", icon: LayoutDashboard },
  { href: "/admin/courses", label: "کورسز", icon: BookOpen },
  { href: "/admin/students", label: "طلباء", icon: Users },
  { href: "/admin/testimonials", label: "تاثرات", icon: MessageSquareQuote },
  { href: "/admin/faq", label: "سوالات و جوابات", icon: HelpCircle },
  { href: "/admin/messages", label: "پیغامات", icon: Mail },
  { href: "/admin/settings", label: "سیٹنگز", icon: Settings },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-full w-64 shrink-0 flex-col border-l border-gray-800 bg-gray-950 text-gray-100">
      <div className="flex h-16 items-center gap-2 border-b border-gray-800 px-5 font-extrabold text-brand-400">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-white">N</span>
        ایڈمن پینل
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        {items.map((item) => {
          const active = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition",
                active ? "bg-brand-600 text-white" : "text-gray-300 hover:bg-gray-900 hover:text-white"
              )}
            >
              <Icon size={18} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="space-y-1 border-t border-gray-800 px-3 py-4">
        <Link href="/" target="_blank" className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-300 hover:bg-gray-900 hover:text-white">
          <Globe size={18} /> ویب سائٹ دیکھیں
        </Link>
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-red-400 hover:bg-gray-900"
        >
          <LogOut size={18} /> لاگ آؤٹ
        </button>
      </div>
    </aside>
  );
}
