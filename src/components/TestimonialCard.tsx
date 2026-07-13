import { Star } from "lucide-react";

export default function TestimonialCard({
  name,
  role,
  message,
  rating,
}: {
  name: string;
  role?: string | null;
  message: string;
  rating: number;
}) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <div className="mb-3 flex gap-0.5 text-amber-400">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star key={i} size={16} fill={i < rating ? "currentColor" : "none"} />
        ))}
      </div>
      <p className="mb-4 text-sm leading-7 text-gray-700 dark:text-gray-300">"{message}"</p>
      <div>
        <p className="font-bold text-gray-900 dark:text-white">{name}</p>
        {role && <p className="text-xs text-gray-500">{role}</p>}
      </div>
    </div>
  );
}
