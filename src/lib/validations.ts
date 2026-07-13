import { z } from "zod";

// All input validation lives here — used by both API routes and
// server actions so untrusted input is never trusted twice.

export const registerSchema = z.object({
  name: z.string().trim().min(2, "نام کم از کم 2 حروف کا ہونا چاہیے").max(100),
  email: z.string().trim().email("درست ای میل درج کریں").max(255),
  password: z
    .string()
    .min(8, "پاسورڈ کم از کم 8 حروف کا ہونا چاہیے")
    .max(100)
    .regex(/[A-Z]/, "پاسورڈ میں کم از کم ایک بڑا حرف ہونا چاہیے")
    .regex(/[0-9]/, "پاسورڈ میں کم از کم ایک عدد ہونا چاہیے"),
  phone: z.string().trim().max(20).optional(),
});

export const loginSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(1),
});

export const contactSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().email(),
  phone: z.string().trim().max(20).optional(),
  subject: z.string().trim().max(200).optional(),
  message: z.string().trim().min(5).max(2000),
});

export const courseSchema = z.object({
  title: z.string().trim().min(3).max(200),
  slug: z.string().trim().min(3).max(200).regex(/^[a-z0-9-]+$/, "Slug صرف چھوٹے حروف اور - پر مشتمل ہو"),
  description: z.string().trim().min(10).max(5000),
  shortDesc: z.string().trim().max(300).optional(),
  thumbnailUrl: z.string().trim().url().optional().or(z.literal("")),
  price: z.number().min(0).default(0),
  isFree: z.boolean().default(true),
  status: z.enum(["DRAFT", "PUBLISHED"]).default("DRAFT"),
  seoTitle: z.string().trim().max(200).optional(),
  seoDescription: z.string().trim().max(300).optional(),
});

export const moduleSchema = z.object({
  title: z.string().trim().min(2).max(200),
  order: z.number().int().min(0).default(0),
  courseId: z.string().cuid(),
});

export const lessonSchema = z.object({
  title: z.string().trim().min(2).max(200),
  type: z.enum(["VIDEO", "PDF", "ASSIGNMENT", "TEXT"]),
  content: z.string().trim().max(10000).optional(),
  videoUrl: z.string().trim().max(1000).optional(),
  pdfUrl: z.string().trim().max(1000).optional(),
  order: z.number().int().min(0).default(0),
  isPreview: z.boolean().default(false),
  moduleId: z.string().cuid(),
});

export const testimonialSchema = z.object({
  name: z.string().trim().min(2).max(100),
  role: z.string().trim().max(150).optional(),
  message: z.string().trim().min(5).max(1000),
  avatarUrl: z.string().trim().max(1000).optional(),
  rating: z.number().int().min(1).max(5).default(5),
  isPublished: z.boolean().default(true),
});

export const faqSchema = z.object({
  question: z.string().trim().min(3).max(300),
  answer: z.string().trim().min(3).max(2000),
  order: z.number().int().min(0).default(0),
  isPublished: z.boolean().default(true),
});

export const settingsSchema = z.object({
  academyName: z.string().trim().min(2).max(150),
  logoUrl: z.string().trim().max(1000).optional(),
  heroHeading: z.string().trim().max(300).optional(),
  heroSubheading: z.string().trim().max(500).optional(),
  whatsappNumber: z.string().trim().max(20).optional(),
  facebookUrl: z.string().trim().max(300).optional(),
  instagramUrl: z.string().trim().max(300).optional(),
  youtubeUrl: z.string().trim().max(300).optional(),
  tiktokUrl: z.string().trim().max(300).optional(),
  contactEmail: z.string().trim().email().optional().or(z.literal("")),
  contactPhone: z.string().trim().max(20).optional(),
  contactAddress: z.string().trim().max(300).optional(),
  seoTitle: z.string().trim().max(200).optional(),
  seoDescription: z.string().trim().max(300).optional(),
});

export const studentUpdateSchema = z.object({
  name: z.string().trim().min(2).max(100).optional(),
  phone: z.string().trim().max(20).optional(),
  isSuspended: z.boolean().optional(),
});
