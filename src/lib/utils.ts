import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function slugify(text: string) {
  return text
    .toString()
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-");
}

export function generateCertificateNumber() {
  const year = new Date().getFullYear();
  const rand = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `NGCA-${year}-${rand}`;
}

export function formatDateUrdu(date: Date | string) {
  const d = new Date(date);
  return new Intl.DateTimeFormat("ur-PK", { year: "numeric", month: "long", day: "numeric" }).format(d);
}
