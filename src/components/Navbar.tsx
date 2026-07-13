"use client";

import Link from "next/link";
import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { Menu, X, User, LogOut, LayoutDashboard } from "lucide-react";

const links = [
  { href: "/", label: "ہوم" },
  { href: "/courses", label: "کورسز" },
  { href: "/about", label: "ہمارے بارے میں" },
  { href: "/contact", label: "رابطہ" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { data: session } = useSession();

  return (
    <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/80 backdrop-blur-md dark:border-gray-800 dark:bg-gray-950/80">
      <nav className="container-x flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-lg font-extrabold text-brand-700 dark:text-brand-400">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-600 text-white">N</span>
          Nextgen Creators Academy
        </Link>

        <ul className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <li key={l.href}>
              <Link href={l.href} className="text-sm font-medium text-gray-700 transition hover:text-brand-600 dark:text-gray-300">
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="hidden items-center gap-3 md:flex">
          {session ? (
            <>
              <Link
                href={session.user.role === "SUPER_ADMIN" ? "/admin" : "/dashboard"}
                className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-semibold text-brand-700 hover:bg-brand-50 dark:text-brand-400 dark:hover:bg-brand-950"
              >
                <LayoutDashboard size={16} /> ڈیش بورڈ
              </Link>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
              >
                <LogOut size={16} /> لاگ آؤٹ
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="rounded-lg px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800">
                لاگ ان
              </Link>
              <Link href="/register" className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700">
                رجسٹر کریں
              </Link>
            </>
          )}
        </div>

        <button className="md:hidden" onClick={() => setOpen(!open)} aria-label="مینو کھولیں">
          {open ? <X /> : <Menu />}
        </button>
      </nav>

      {open && (
        <div className="border-t border-gray-100 bg-white px-4 py-4 md:hidden dark:border-gray-800 dark:bg-gray-950">
          <ul className="flex flex-col gap-3">
            {links.map((l) => (
              <li key={l.href}>
                <Link href={l.href} onClick={() => setOpen(false)} className="block py-1 text-sm font-medium">
                  {l.label}
                </Link>
              </li>
            ))}
            <li className="flex flex-col gap-2 pt-2">
              {session ? (
                <>
                  <Link href={session.user.role === "SUPER_ADMIN" ? "/admin" : "/dashboard"} className="rounded-lg bg-brand-50 px-4 py-2 text-center text-sm font-semibold text-brand-700 flex items-center justify-center gap-1.5">
                    <User size={16} /> ڈیش بورڈ
                  </Link>
                  <button onClick={() => signOut({ callbackUrl: "/" })} className="rounded-lg border px-4 py-2 text-sm font-semibold">
                    لاگ آؤٹ
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" className="rounded-lg border px-4 py-2 text-center text-sm font-semibold">
                    لاگ ان
                  </Link>
                  <Link href="/register" className="rounded-lg bg-brand-600 px-4 py-2 text-center text-sm font-semibold text-white">
                    رجسٹر کریں
                  </Link>
                </>
              )}
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
