# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Calma Trip — a Tunisian travel booking site (transfers, excursions, marketplace) built with Next.js 15 (App Router), React 18, TypeScript, Prisma (MySQL), NextAuth v5, Tailwind CSS v4, and MUI + Radix UI components. Deployed as a PWA (next-pwa, disabled in dev). No test suite exists.

## Commands

```bash
npm run dev          # start dev server (auto-starts local MySQL first, see below)
npm run build        # prisma migrate deploy + next build (also auto-starts local MySQL)
npm run lint         # next lint
npm run db:start     # start the portable local MySQL instance
npm run db:stop      # stop it
npm run db:push      # prisma db push (sync schema without migration)
npm run db:seed      # npx tsx prisma/seed.ts
npm run db:studio    # prisma studio
```

`postinstall` runs `prisma generate` — rerun it (or `npx prisma generate`) after editing `prisma/schema.prisma`. Requires `DATABASE_URL` (MySQL) in `.env`.

### Local database (this machine)
`DATABASE_URL` points at `localhost:3306`. The Windows `MySQL93` service that used to back this had its binaries deleted from `C:\Program Files\MySQL\MySQL Server 9.3\bin` (empty folder, only `configurator_settings.xml` left) while the service registration survived — `Start-Service MySQL93` fails even as admin. Do not try to repair or re-register that service.

Local MySQL now runs as a **portable, admin-free instance** instead:
- Binaries: `C:\Users\abdou\mysql-portable\mysql-9.3.0-winx64\`
- Data dir: `C:\Users\abdou\mysql-portable\data\` (root@localhost, empty password — matches `DATABASE_URL`)
- `npm run db:start` / `npm run db:stop` — start/stop it manually (`scripts/db-start.cjs`, `scripts/db-stop.cjs`); PID and logs land in `scripts/.mysql-portable.*` (gitignored).
- `npm run dev` and `npm run build` auto-start it via `predev`/`prebuild` hooks — you shouldn't need to think about this day to day.
- Override paths/port with `MYSQL_PORTABLE_HOME`, `MYSQL_PORTABLE_DATA`, `MYSQL_PORTABLE_PORT` env vars if this ever moves to another machine.

After a fresh checkout on this machine: `npm run db:start` → `npx prisma migrate deploy` → `npm run db:seed`.

## Architecture

### Page/View split
Every route in `src/app/**/page.tsx` is a thin server component that exports `metadata` (often via `buildMetadata()` from `src/lib/seo.ts`) and renders a client component from `src/views/`. All real UI logic lives in `src/views/` (public pages at the root, admin screens in `src/views/admin/`). Follow this pattern when adding pages: server page for SEO metadata, client view for the UI.

### Auth & roles
- `src/auth.ts` — NextAuth v5 with Google provider, Prisma adapter, JWT sessions. User `role` ("USER" | "ADMIN") is embedded in the JWT; emails in the `ADMIN_EMAILS` env var become admins.
- `src/middleware.ts` — route protection (Node runtime, not Edge): `/admin/*` requires ADMIN, `/dashboard` requires login, admins are redirected `/dashboard` → `/admin`, logged-in users are bounced away from `/login`/`/register`.
- Session type augmentation is in `src/types/next-auth.d.ts`.

### Data layer
- Prisma schema in `prisma/schema.prisma` (MySQL). Core models: User, Service, Booking, TimeSlot, Product, Order/OrderItem, Review, Contact, Notification, PushSubscription.
- Singleton client in `src/lib/prisma.ts` — import `prisma` from `@/lib/prisma`, never instantiate `PrismaClient` directly.
- API routes live in `src/app/api/` (public: bookings, orders, reviews, contact, availability; admin-only under `src/app/api/admin/`).

### Cross-cutting services (`src/lib/`)
- `seo.ts` — centralised SEO config (`SITE` constant, `buildMetadata()`); use it for every new page's metadata. Site URL is `https://www.calmatrip.com`.
- `notifications.ts` + `push.ts` — in-app notifications (Notification model) and Web Push (VAPID env vars, `usePushSubscription` hook, `ServiceWorkerRegister` component).
- `mail.ts` — nodemailer SMTP transport (SMTP_* env vars documented in the file header).
- `cron.ts` — node-cron cleanup job started from `instrumentation.ts`, Node.js runtime only (guards against Edge and hot-reload double-start).

### Other conventions
- Path alias: `@/*` → `src/*`.
- Images are hosted on Cloudinary (`res.cloudinary.com` is the only allowed remote image host; uploads via `src/app/api/admin/upload`).
- `next.config.ts` also sets security headers and a non-www → www redirect.
- Code comments are a mix of French and English; either is acceptable.
