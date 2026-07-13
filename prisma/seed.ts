import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const adminEmail = process.env.SEED_ADMIN_EMAIL || "admin@nextgenacademy.pk";
  const adminPassword = process.env.SEED_ADMIN_PASSWORD || "ChangeMe123!";
  const passwordHash = await bcrypt.hash(adminPassword, 12);

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      name: "Super Admin",
      email: adminEmail,
      passwordHash,
      role: "SUPER_ADMIN",
    },
  });

  await prisma.websiteSettings.upsert({
    where: { id: "singleton" },
    update: {},
    create: {
      id: "singleton",
      academyName: "Nextgen Creators Academy",
      heroHeading: "اپنی ڈیجیٹل کامیابی کا سفر آج ہی شروع کریں",
      heroSubheading:
        "Nextgen Creators Academy میں AI، YouTube اور Website Development کی جدید اور عملی تربیت حاصل کریں۔",
      whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "923000000000",
      contactEmail: adminEmail,
      seoTitle: "Nextgen Creators Academy — AI, YouTube اور Web Development سیکھیں",
      seoDescription:
        "پاکستان کی جدید ترین آن لائن اکیڈمی جہاں آپ AI، یوٹیوب کریشن اور ویب ڈویلپمنٹ کی عملی تربیت حاصل کر سکتے ہیں۔",
    },
  });

  const courseData = [
    {
      title: "AI Master Course",
      slug: "ai-master-course",
      description:
        "ChatGPT، Claude، پرامپٹ انجینئرنگ، AI آٹومیشن، AI ایجنٹس اور AI فری لانسنگ سیکھیں — صفر سے پیشہ ورانہ سطح تک۔",
      shortDesc: "AI ٹولز اور فری لانسنگ کا مکمل کورس",
      modules: [
        { title: "ChatGPT بنیادی معلومات", lessons: ["ChatGPT کا تعارف", "اکاؤنٹ سیٹ اپ", "بنیادی استعمال"] },
        { title: "Claude", lessons: ["Claude کا تعارف", "Claude Projects", "Claude Artifacts"] },
        { title: "پرامپٹ انجینئرنگ", lessons: ["پرامپٹ کے اصول", "ایڈوانس پرامپٹنگ", "پریکٹس اسائنمنٹ"] },
        { title: "AI آٹومیشن", lessons: ["ورک فلو آٹومیشن", "n8n سے آٹومیشن"] },
        { title: "AI ایجنٹس", lessons: ["ایجنٹس کا تعارف", "اپنا پہلا ایجنٹ بنائیں"] },
        { title: "AI فری لانسنگ", lessons: ["فری لانسنگ پلیٹ فارمز", "کلائنٹ کیسے ڈھونڈیں"] },
      ],
    },
    {
      title: "YouTube Master Course",
      slug: "youtube-master-course",
      description:
        "چینل سیٹ اپ، کنٹینٹ اسٹریٹجی، SEO، منیٹائزیشن، اینالیٹکس اور گروتھ کے تمام راز اس کورس میں سیکھیں۔",
      shortDesc: "پروفیشنل یوٹیوبر بننے کا مکمل راستہ",
      modules: [
        { title: "چینل سیٹ اپ", lessons: ["چینل بنانا", "برانڈنگ", "چینل آرٹ"] },
        { title: "کنٹینٹ اسٹریٹجی", lessons: ["نیش کا انتخاب", "کنٹینٹ کیلنڈر"] },
        { title: "SEO", lessons: ["ٹائٹل اور ٹیگز", "تھمب نیل SEO"] },
        { title: "منیٹائزیشن", lessons: ["ایڈسینس", "اسپانسرشپ"] },
        { title: "اینالیٹکس اور گروتھ", lessons: ["اسٹوڈیو اینالیٹکس پڑھنا", "گروتھ حکمت عملی"] },
      ],
    },
    {
      title: "Website Development Course",
      slug: "website-development-course",
      description:
        "HTML، CSS، JavaScript، React، Next.js اور ڈیپلائمنٹ سیکھ کر ایک مکمل ویب ڈویلپر بنیں۔",
      shortDesc: "صفر سے فل اسٹیک ویب ڈویلپر بنیں",
      modules: [
        { title: "HTML", lessons: ["HTML بنیادی باتیں", "فارمز اور ٹیبلز"] },
        { title: "CSS", lessons: ["CSS اسٹائلنگ", "Flexbox اور Grid"] },
        { title: "JavaScript", lessons: ["JS بنیادی باتیں", "DOM مینیپولیشن"] },
        { title: "React", lessons: ["React کا تعارف", "Hooks"] },
        { title: "Next.js", lessons: ["App Router", "Server Actions"] },
        { title: "Deployment", lessons: ["Vercel پر ڈیپلائے کرنا", "کسٹم ڈومین"] },
      ],
    },
  ];

  for (const [ci, c] of courseData.entries()) {
    const course = await prisma.course.upsert({
      where: { slug: c.slug },
      update: {},
      create: {
        title: c.title,
        slug: c.slug,
        description: c.description,
        shortDesc: c.shortDesc,
        isFree: true,
        price: 0,
        status: "PUBLISHED",
        order: ci,
        authorId: admin.id,
        seoTitle: c.title,
        seoDescription: c.shortDesc,
      },
    });

    for (const [mi, m] of c.modules.entries()) {
      const existingModule = await prisma.module.findFirst({
        where: { courseId: course.id, title: m.title },
      });
      const mod =
        existingModule ||
        (await prisma.module.create({
          data: { title: m.title, order: mi, courseId: course.id },
        }));

      for (const [li, lessonTitle] of m.lessons.entries()) {
        const existingLesson = await prisma.lesson.findFirst({
          where: { moduleId: mod.id, title: lessonTitle },
        });
        if (!existingLesson) {
          await prisma.lesson.create({
            data: {
              title: lessonTitle,
              type: "VIDEO",
              order: li,
              isPreview: li === 0,
              moduleId: mod.id,
              content: `${lessonTitle} — سبق کا خلاصہ یہاں شامل کریں۔`,
            },
          });
        }
      }
    }
  }

  const testimonials = [
    { name: "احمد رضا", role: "AI Master Course طالب علم", message: "اس اکیڈمی نے میری زندگی بدل دی، اب میں AI فری لانسنگ سے کما رہا ہوں۔", rating: 5 },
    { name: "عائشہ خان", role: "YouTube Master Course طالبہ", message: "بہت عملی اور آسان طریقے سے سکھایا گیا، میرا چینل اب بڑھ رہا ہے۔", rating: 5 },
    { name: "بلال احمد", role: "Web Development طالب علم", message: "استاد کا انداز بہت واضح تھا، میں نے تین ماہ میں ویب سائٹس بنانا سیکھ لیا۔", rating: 5 },
  ];
  for (const t of testimonials) {
    const exists = await prisma.testimonial.findFirst({ where: { name: t.name } });
    if (!exists) await prisma.testimonial.create({ data: t });
  }

  const faqs = [
    { question: "کیا یہ کورسز مفت ہیں؟", answer: "جی ہاں، فی الحال تمام کورسز مکمل مفت ہیں۔" },
    { question: "کیا مجھے سرٹیفکیٹ ملے گا؟", answer: "کورس مکمل کرنے پر آپ کو ڈیجیٹل سرٹیفکیٹ دیا جائے گا جسے آپ ڈاؤن لوڈ کر سکتے ہیں۔" },
    { question: "کیا میں موبائل سے کورس دیکھ سکتا ہوں؟", answer: "جی ہاں، ویب سائٹ مکمل طور پر موبائل فرینڈلی ہے۔" },
  ];
  for (const [i, f] of faqs.entries()) {
    const exists = await prisma.faq.findFirst({ where: { question: f.question } });
    if (!exists) await prisma.faq.create({ data: { ...f, order: i } });
  }

  console.log("✅ Seed complete.");
  console.log(`   Admin login: ${adminEmail} / ${adminPassword}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
