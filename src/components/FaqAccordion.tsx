"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

export default function FaqAccordion({ items }: { items: { id: string; question: string; answer: string }[] }) {
  const [openId, setOpenId] = useState<string | null>(items[0]?.id ?? null);

  return (
    <div className="mx-auto max-w-3xl divide-y divide-gray-100 rounded-2xl border border-gray-100 bg-white dark:divide-gray-800 dark:border-gray-800 dark:bg-gray-900">
      {items.map((item) => {
        const isOpen = openId === item.id;
        return (
          <div key={item.id} className="p-5">
            <button
              onClick={() => setOpenId(isOpen ? null : item.id)}
              className="flex w-full items-center justify-between text-right"
            >
              <span className="font-bold text-gray-900 dark:text-white">{item.question}</span>
              <ChevronDown className={`transition-transform ${isOpen ? "rotate-180" : ""}`} size={18} />
            </button>
            {isOpen && <p className="mt-3 text-sm leading-7 text-gray-600 dark:text-gray-400">{item.answer}</p>}
          </div>
        );
      })}
    </div>
  );
}
