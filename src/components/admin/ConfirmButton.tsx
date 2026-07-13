"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Loader2, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export default function ConfirmButton({
  url,
  method = "DELETE",
  confirmText = "کیا آپ واقعی حذف کرنا چاہتے ہیں؟",
  successText = "کامیابی سے حذف ہو گیا",
  label,
  icon: Icon,
  className,
  body,
}: {
  url: string;
  method?: "DELETE" | "PATCH" | "POST";
  confirmText?: string;
  successText?: string;
  label?: string;
  icon?: LucideIcon;
  className?: string;
  body?: Record<string, unknown>;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    if (!confirm(confirmText)) return;
    setLoading(true);
    try {
      const res = await fetch(url, {
        method,
        headers: body ? { "Content-Type": "application/json" } : undefined,
        body: body ? JSON.stringify(body) : undefined,
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error || "کارروائی ناکام ہوئی");
      toast.success(successText);
      router.refresh();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className={cn("flex items-center gap-1.5 disabled:opacity-50", className)}
    >
      {loading ? <Loader2 size={16} className="animate-spin" /> : Icon && <Icon size={16} />}
      {label}
    </button>
  );
}
