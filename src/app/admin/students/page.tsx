import StudentsTable from "@/components/admin/StudentsTable";

export default function AdminStudentsPage() {
  return (
    <div dir="rtl">
      <h1 className="mb-1 text-2xl font-extrabold text-gray-900 dark:text-gray-50">طلباء</h1>
      <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">طلباء کو تلاش کریں، ترمیم کریں یا معطل کریں</p>
      <StudentsTable />
    </div>
  );
}
