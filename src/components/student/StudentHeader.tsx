"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import StudentSidebar from "./StudentSidebar";

export default function StudentHeader() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <header className="flex h-16 items-center justify-between border-b border-gray-100 bg-white px-5 dark:border-gray-800 dark:bg-gray-950 lg:hidden">
        <h1 className="font-extrabold text-brand-600">اسٹوڈنٹ پینل</h1>
        <button onClick={() => setOpen(true)} aria-label="مینو کھولیں">
          <Menu />
        </button>
      </header>

      {open && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setOpen(false)} />
          <div className="relative mr-auto">
            <StudentSidebar />
            <button onClick={() => setOpen(false)} className="absolute left-[-44px] top-4 rounded-lg bg-gray-950 p-2 text-white" aria-label="بند کریں">
              <X size={20} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
