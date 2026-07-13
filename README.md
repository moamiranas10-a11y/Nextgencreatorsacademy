# Nextgen Creators Academy — Online Academy Management System

A complete, production-ready LMS for **Nextgen Creators Academy** — built with Next.js 15 (App Router), TypeScript, Tailwind CSS, PostgreSQL, and Prisma. Fully Urdu (RTL), 100% free/open-source stack: **no OpenAI/Anthropic/Gemini keys, no Stripe/PayPal, no paid third-party services required.**

## 1. Tech stack

| Layer          | Choice                                                      |
|----------------|--------------------------------------------------------------|
| Frontend       | Next.js 15 (App Router), React 18, TypeScript, Tailwind CSS, Framer Motion |
| Backend        | Next.js Route Handlers (`/api/**`) + Server Components        |
| Database       | PostgreSQL                                                    |
| ORM            | Prisma                                                         |
| Auth           | NextAuth (Auth.js) — Credentials provider, JWT sessions, bcrypt |
| File storage   | Local `/public/uploads` (swap for UploadThing later if you want) |
| Hosting        | Vercel (free tier) + any free Postgres (Neon / Supabase / Railway) |

No paid API keys are referenced anywhere in the codebase. Video lessons are stored as embeddable URLs (e.g. a YouTube unlisted link or any self-hosted video URL) rather than uploaded binaries, so there is no video-processing cost.

## 2. Project structure

```
prisma/schema.prisma        # Full data model (11 models, see below)
prisma/seed.ts               # Seeds an admin account, the 3 courses, testimonials, FAQ
middleware.ts                 # Role-based route protection (/admin, /dashboard)
src/lib/                      # prisma client, auth config, zod validation, rate limiter, utils
src/app/
  page.tsx, about/, courses/, contact/, privacy-policy/, terms/   # Public site
  login/, register/                                               # Auth pages
  api/**                                                           # All REST endpoints
  admin/**                                                         # Super Admin dashboard
  dashboard/**                                                     # Student dashboard
src/components/
  (site components), admin/, student/                             # UI building blocks
```

## 3. Database schema (high level)

`User` (role: SUPER_ADMIN | STUDENT) · `Course` · `Module` · `Lesson` · `Enrollment` · `LessonProgress` · `Certificate` · `Testimonial` · `FAQ` · `ContactMessage` · `WebsiteSettings`

Key relationships: a `Course` has many `Module`s, each `Module` has many `Lesson`s. A `User` enrolls in a `Course` (`Enrollment`), and per-lesson completion is tracked in `LessonProgress`. When every lesson in a course is marked complete, the system **automatically issues a `Certificate`** with a unique certificate number — no manual step required.

## 4. Security implemented

- Passwords hashed with **bcrypt** (12 rounds), never stored or logged in plain text.
- **JWT sessions** via NextAuth, httpOnly + `secure` cookies in production, `sameSite=lax`.
- **Role-based access control** enforced twice: in `middleware.ts` (edge, fast reject) and again inside every `/admin` and `/dashboard` server layout and every admin API route (defense in depth).
- **Zod validation** on every API input (`src/lib/validations.ts`) — nothing touches the database unvalidated.
- **In-memory rate limiting** on `/api/auth/register` and `/api/contact` (5 requests / 10 minutes / IP) to blunt automated abuse, with no external Redis dependency.
- Prisma's parameterized queries eliminate SQL injection by construction.
- Suspended accounts (`isSuspended`) are blocked at the `authorize()` step of login.
- `/admin` and `/dashboard` are excluded from the sitemap and marked `noindex`.

## 5. Local development

```bash
git clone <your-repo-url>
cd nextgen-creators-academy
npm install

cp .env.example .env
# edit .env: set DATABASE_URL, NEXTAUTH_SECRET (openssl rand -base64 32)

npm run db:push      # create tables from prisma/schema.prisma
npm run db:seed      # create the Super Admin + 3 courses + sample content
npm run dev           # http://localhost:3000
```

Default seeded admin login (change `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD` in `.env` before seeding on a real deployment):

```
Email:    admin@nextgenacademy.pk
Password: ChangeMe123!
```

**Change this password immediately after your first login**, either from `/dashboard/profile`-style flow (add one for admin if desired) or directly with `npm run db:studio`.

## 6. Deploying for free (GitHub + Neon + Vercel)

### Step 1 — Push to GitHub
```bash
git init && git add . && git commit -m "Initial commit"
git remote add origin https://github.com/<you>/nextgen-creators-academy.git
git push -u origin main
```

### Step 2 — Create a free PostgreSQL database
Pick **one** free provider:
- **Neon** (neon.tech) — recommended, generous free tier, serverless Postgres.
- **Supabase** (supabase.com) — free tier includes Postgres + dashboard.
- **Railway** (railway.app) — free trial credits, Postgres plugin.

Copy the connection string it gives you (must include `?sslmode=require` for Neon/Supabase).

### Step 3 — Deploy to Vercel
1. Go to vercel.com → **New Project** → import your GitHub repo.
2. In **Environment Variables**, add:
   - `DATABASE_URL` — the connection string from Step 2
   - `NEXTAUTH_SECRET` — output of `openssl rand -base64 32`
   - `NEXTAUTH_URL` — `https://your-project.vercel.app`
   - `NEXT_PUBLIC_SITE_URL` — same as above
   - `NEXT_PUBLIC_ACADEMY_NAME`, `NEXT_PUBLIC_WHATSAPP_NUMBER` — optional branding
3. Deploy. Vercel runs `prisma generate` automatically via the `postinstall` script.

### Step 4 — Create tables + seed on the production database
From your local machine, temporarily point `.env` at the **production** `DATABASE_URL` and run:
```bash
npm run db:push
npm run db:seed
```
(Or run these from Vercel's CLI / a one-off GitHub Action — any environment that can reach the database works, since there's no paid migration service involved.)

### Step 5 — Log in
Visit `https://your-project.vercel.app/login` with the seeded admin credentials, then **change the password** and update branding under **Admin → Settings**.

Vercel's free (Hobby) tier, Neon/Supabase's free Postgres tier, and GitHub's free repos together cost **$0/month** for the traffic levels a new academy typically sees.

## 7. Content workflow (what the Super Admin can do)

- **Courses**: create/edit/publish/draft/delete, set price or mark free, SEO title & description per course.
- **Lessons**: inside a course → "اسباق منظم کریں", add modules, add lessons (video URL, PDF URL, assignment/text content), mark a lesson as a free preview, reorder modules, delete lessons/modules.
- **Students**: search, edit name/phone, suspend/reactivate, delete.
- **Testimonials / FAQ**: add, edit, publish/unpublish, delete — reflected live on the home page.
- **Messages**: every contact-form submission is saved straight to the database (no email service needed); mark read/delete from the admin panel.
- **Settings**: academy name, logo, hero heading/subheading, WhatsApp number, social links, contact info, SEO defaults — all editable without touching code.

## 8. Student workflow

Register → browse `/dashboard/courses` → enroll (instant for free courses) → watch lessons, mark each complete → progress bar updates automatically → once 100% complete, a certificate is issued automatically and can be viewed/printed (browser "Save as PDF") from `/dashboard/certificates`.

## 9. Extending later (optional, still free)

- Swap local upload fields for **UploadThing**'s free tier if you want direct file uploads instead of pasting URLs.
- Add a `PENDING` enrollment status + manual bank-transfer confirmation flow if you introduce paid courses without a payment gateway.
- Add e-mail notifications with a free SMTP tier (e.g. Brevo/Sendinblue free plan) — currently the system deliberately has zero external service dependencies.

---
Built for Nextgen Creators Academy — AI، YouTube اور Web Development سیکھیں۔
