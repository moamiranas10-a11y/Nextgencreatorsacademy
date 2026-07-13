import { prisma } from "@/lib/prisma";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import CourseCard from "@/components/CourseCard";
import TestimonialCard from "@/components/TestimonialCard";
import FaqAccordion from "@/components/FaqAccordion";
import ContactForm from "@/components/ContactForm";
import { Brain, Youtube, Code2, ShieldCheck, Award, Users } from "lucide-react";

export const revalidate = 60;

export default async function HomePage() {
  const [settings, courses, testimonials, faqs] = await Promise.all([
    prisma.websiteSettings.findUnique({ where: { id: "singleton" } }),
    prisma.course.findMany({
      where: { status: "PUBLISHED" },
      include: { modules: true },
      orderBy: { order: "asc" },
    }),
    prisma.testimonial.findMany({ where: { isPublished: true }, orderBy: { order: "asc" }, take: 6 }),
    prisma.faq.findMany({ where: { isPublished: true }, orderBy: { order: "asc" } }),
  ]);

  const features = [
    { icon: Brain, title: "عملی AI تربیت", desc: "ChatGPT، Claude اور AI ایجنٹس پر ہاتھوں ہاتھ مشق۔" },
    { icon: Youtube, title: "یوٹیوب گروتھ", desc: "چینل سیٹ اپ سے منیٹائزیشن تک مکمل روڈ میپ۔" },
    { icon: Code2, title: "ویب ڈویلپمنٹ", desc: "HTML سے Next.js تک جدید فل اسٹیک ہنر۔" },
    { icon: ShieldCheck, title: "محفوظ پلیٹ فارم", desc: "آپ کا ڈیٹا مکمل طور پر محفوظ اور خفیہ ہے۔" },
    { icon: Award, title: "سرٹیفکیٹ", desc: "کورس مکمل کرنے پر ڈیجیٹل سرٹیفکیٹ حاصل کریں۔" },
    { icon: Users, title: "کمیونٹی سپورٹ", desc: "ہزاروں طلبہ کے ساتھ سیکھیں اور آگے بڑھیں۔" },
  ];

  return (
    <>
      <Navbar />
      <main>
        <Hero
          heading={settings?.heroHeading || "اپنی ڈیجیٹل کامیابی کا سفر آج ہی شروع کریں"}
          subheading={
            settings?.heroSubheading ||
            "Nextgen Creators Academy میں AI، YouTube اور Website Development کی جدید اور عملی تربیت حاصل کریں۔"
          }
        />

        {/* Features */}
        <section className="container-x py-20">
          <h2 className="mb-2 text-center text-3xl font-extrabold">ہم کیوں بہترین ہیں</h2>
          <p className="mx-auto mb-12 max-w-xl text-center text-gray-600 dark:text-gray-400">
            جدید نصاب، عملی مشقیں اور مسلسل سپورٹ کے ساتھ سیکھنے کا بہترین تجربہ۔
          </p>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => (
              <div key={f.title} className="rounded-2xl border border-gray-100 p-6 transition hover:shadow-md dark:border-gray-800">
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-brand-100 text-brand-700 dark:bg-brand-900/40 dark:text-brand-300">
                  <f.icon size={22} />
                </div>
                <h3 className="mb-1.5 font-bold">{f.title}</h3>
                <p className="text-sm leading-6 text-gray-600 dark:text-gray-400">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Courses */}
        <section className="bg-gray-50 py-20 dark:bg-gray-900">
          <div className="container-x">
            <h2 className="mb-2 text-center text-3xl font-extrabold">ہمارے کورسز</h2>
            <p className="mx-auto mb-12 max-w-xl text-center text-gray-600 dark:text-gray-400">
              اپنی دلچسپی کے مطابق کورس منتخب کریں اور سیکھنا شروع کریں۔
            </p>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {courses.map((c) => (
                <CourseCard key={c.id} title={c.title} slug={c.slug} shortDesc={c.shortDesc} moduleCount={c.modules.length} isFree={c.isFree} />
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        {testimonials.length > 0 && (
          <section className="container-x py-20">
            <h2 className="mb-2 text-center text-3xl font-extrabold">طلبہ کی آراء</h2>
            <p className="mx-auto mb-12 max-w-xl text-center text-gray-600 dark:text-gray-400">
              ہمارے طلبہ کا تجربہ ان کی اپنی زبانی۔
            </p>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {testimonials.map((t) => (
                <TestimonialCard key={t.id} name={t.name} role={t.role} message={t.message} rating={t.rating} />
              ))}
            </div>
          </section>
        )}

        {/* FAQ */}
        {faqs.length > 0 && (
          <section className="bg-gray-50 py-20 dark:bg-gray-900">
            <div className="container-x">
              <h2 className="mb-2 text-center text-3xl font-extrabold">اکثر پوچھے گئے سوالات</h2>
              <p className="mx-auto mb-12 max-w-xl text-center text-gray-600 dark:text-gray-400">
                آپ کے سوالات کے جوابات یہاں موجود ہیں۔
              </p>
              <FaqAccordion items={faqs} />
            </div>
          </section>
        )}

        {/* Contact */}
        <section className="container-x py-20">
          <div className="mx-auto max-w-xl">
            <h2 className="mb-2 text-center text-3xl font-extrabold">ہم سے رابطہ کریں</h2>
            <p className="mb-10 text-center text-gray-600 dark:text-gray-400">کوئی سوال ہے؟ ہمیں پیغام بھیجیں۔</p>
            <ContactForm />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
