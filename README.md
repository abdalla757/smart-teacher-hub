# Smart Teacher Hub (المعلم الذكي)

The web app for the Smart Teacher project: a platform for teachers and tutoring centers in Egypt who run large groups of students. It is part of a graduation project. The Arabic, right-to-left interface lets a teacher sign up, sign in, and move around a dashboard. The planning for the whole system (registration, QR attendance, exams, grades, parent communication) lives in the companion repo [smart-teacher-mvp](https://github.com/abdalla757/smart-teacher-mvp).

> **Status: early foundation.** Authentication, the app shell and the database schema exist. The feature pages (students, groups, attendance, exams, grades, settings) are placeholders. The dashboard shows empty stat cards, and no feature page reads or writes data yet.

## What works today

- Sign up (full name, email, password) and sign in with Supabase Auth, with Arabic error messages. A new auth user gets a teacher profile through a database trigger.
- A protected dashboard layout with a responsive RTL sidebar. Signed-in users reach it; the pages sit under one `_dashboard` layout route.
- Navigation for seven sections: dashboard, students, groups, attendance, exams, grades, settings.
- A database schema for teachers, groups, students, group memberships, attendance sessions and records, exams and grades, with row level security so each teacher only touches their own rows, plus triggers that check a student and a group belong to the same teacher.
- A few unit tests (auth error messages, app routing).

## Not built yet

QR attendance scanning, exam and grade entry, student management screens, student ID cards, WhatsApp or other parent messaging, and automation workflows. The schema reserves a `qr_token_hash` and a `photo_path` on students for later use; nothing uses them yet.

## Tech stack

- TanStack Start and TanStack Router (file-based routing), React 19, TypeScript
- Vite, Tailwind CSS 4, shadcn/ui style components on Radix UI
- Supabase (Postgres, Auth, row level security) through `@supabase/supabase-js`
- React Hook Form and Zod, TanStack Query, Recharts
- Vitest and Testing Library for tests
- Scaffolded with [Lovable](https://lovable.dev)

## Project layout

```
src/
  routes/          file-based routes (login, signup, _dashboard.*)
  components/      layout (sidebar, page header), auth shell, ui components
  integrations/supabase/   client, auth middleware, generated types
  lib/             auth error messages and helpers
supabase/
  config.toml
  migrations/      schema, RLS policies and triggers
```

## Run it locally

You need Node.js and npm, and a Supabase project.

1. Install dependencies: `npm install`
2. Apply the SQL files in `supabase/migrations/` to your Supabase project.
3. Create a `.env` file (it is not tracked by git) with your own project values:
   ```
   VITE_SUPABASE_URL=...
   VITE_SUPABASE_PUBLISHABLE_KEY=...
   SUPABASE_URL=...
   SUPABASE_PUBLISHABLE_KEY=...
   ```
   Use the project's publishable (anon) key only. Never put a service role key in this file.
4. Start the dev server: `npm run dev`

Other scripts: `npm run build`, `npm run test`, `npm run lint`.

## Author

Abdalla Elsayed, Faculty of Computers and Information, Suez Canal University. Part of the Arab Automators team.
