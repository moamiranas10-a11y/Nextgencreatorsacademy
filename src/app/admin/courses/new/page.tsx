import CourseForm from "@/components/admin/CourseForm";

export default function NewCoursePage() {
  return (
    <div dir="rtl">
      <h1 className="mb-6 text-2xl font-extrabold text-gray-900 dark:text-gray-50">نیا کورس بنائیں</h1>
      <CourseForm />
    </div>
  );
}
