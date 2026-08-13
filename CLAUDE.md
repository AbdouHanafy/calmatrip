# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Calma Trip — a Tunisian travel booking site (transfers, excursions, marketplace, explore listings) built with Next.js 15 (App Router), React 18, TypeScript, Prisma (MySQL), NextAuth v5, Tailwind CSS v4, and MUI + Radix UI components. Deployed as a PWA (next-pwa, disabled in dev).

## Commands

```bash
npm run dev          # start dev server (auto-starts local MySQL first, see below)
npm run build        # prisma migrate deploy + next build (also auto-starts local MySQL)
npm run lint         # next lint
npm run test         # vitest run (also auto-starts local MySQL via pretest)
npm run test:watch   # vitest watch mode
npm run format       # prettier --write .
npm run db:start     # start the portable local MySQL instance
npm run db:stop      # stop it
npm run db:push      # prisma db push (sync schema without migration)
npm run db:seed      # npx tsx prisma/seed.ts
npm run db:studio    # prisma studio
```

Run a single test file / test: `npx vitest run src/schemas/booking.test.ts`, `npx vitest run -t "rejects empty name"`.

`postinstall` runs `prisma generate` — rerun it (or `npx prisma generate`) after editing `prisma/schema.prisma`. Requires `DATABASE_URL` (MySQL) in `.env`.

Husky + lint-staged run `eslint --fix` and `prettier --write` on staged files at commit time.

### Local database (this machine)

`DATABASE_URL` points at `localhost:3306`. The Windows `MySQL93` service that used to back this had its binaries deleted from `C:\Program Files\MySQL\MySQL Server 9.3\bin` (empty folder, only `configurator_settings.xml` left) while the service registration survived — `Start-Service MySQL93` fails even as admin. Do not try to repair or re-register that service.

Local MySQL now runs as a **portable, admin-free instance** instead:

- Binaries: `C:\Users\abdou\mysql-portable\mysql-9.3.0-winx64\`
- Data dir: `C:\Users\abdou\mysql-portable\data\` (root@localhost, empty password — matches `DATABASE_URL`)
- `npm run db:start` / `npm run db:stop` — start/stop it manually (`scripts/db-start.cjs`, `scripts/db-stop.cjs`); PID and logs land in `scripts/.mysql-portable.*` (gitignored).
- `npm run dev`, `npm run build` and `npm run test` auto-start it via `predev`/`prebuild`/`pretest` hooks — you shouldn't need to think about this day to day.
- Override paths/port with `MYSQL_PORTABLE_HOME`, `MYSQL_PORTABLE_DATA`, `MYSQL_PORTABLE_PORT` env vars if this ever moves to another machine.

After a fresh checkout on this machine: `npm run db:start` → `npx prisma migrate deploy` → `npm run db:seed`.

## Architecture

### Page/View split

Every route in `src/app/**/page.tsx` is a thin server component that exports `metadata` (often via `buildMetadata()` from `src/lib/seo.ts`) and renders a client component from `src/views/`. All real UI logic lives in `src/views/` (public pages at the root, admin screens in `src/views/admin/`, partner screens in `src/views/b2b/`). Follow this pattern when adding pages: server page for SEO metadata, client view for the UI.

**Detail-page pattern** (`/marketplace/[id]`, `/guides/[slug]`, `/services/[id]`): the server `page.tsx` calls `prisma` directly (not a repository) to build per-item `generateMetadata()` and inline `breadcrumbSchema`/`serviceSchema` JSON-LD, then renders a client view (`ProductDetailPage`, `GuideDetailPage`, `ServiceDetailPage`) that independently fetches the same record client-side via a public `GET` on that resource's `/api/<resource>/[id]` route. Copy this pattern for any new detail page rather than passing the record down as a prop, and add the `noIndex: true` fallback metadata branch for the not-found case.

Any client component that reads `useSearchParams()` (filter/search state seeded from the URL, e.g. `useExploreFilters`, `ServicesContent`) must have a `<Suspense>` boundary between it and its `export default` — see `ExplorePage.tsx` / `Services.tsx`.

### Request pipeline for API routes

API routes in `src/app/api/` are thin and follow a consistent four-layer shape — see `src/app/api/contact/route.ts` as the canonical example:

1. **Rate limit** — `checkRateLimit(key, limit, windowMs)` + `getClientIp(req)` from `src/lib/rateLimit.ts` on public write endpoints (in-memory sliding window, single-instance only).
2. **Validate** — parse the body with a Zod schema from `src/schemas/` via `safeParse`, returning `parsed.error.issues[0].message` with a 400. Every public form has a matching schema, and every schema has a `*.test.ts` beside it.
3. **Authorize** — `const session = await auth()` then check `session?.user?.role`.
4. **Persist** — call a function from `src/repositories/`, never `prisma` directly from the route.

`src/repositories/*.ts` hold all Prisma queries (one file per domain: bookings, orders, products, services, explore listings, guides, museums, events, FAQ, team, clients, contacts, reviews). Put new queries there so routes stay declarative and the repositories stay unit-testable.

User-supplied rich text passes through `sanitizeHtml()` in `src/lib/sanitize.ts` (DOMPurify with a fixed tag/attr allowlist).

### Auth & roles

- Three roles: `USER`, `ADMIN`, `B2B` — stored as a plain string on `User.role`.
- `src/auth.ts` — NextAuth v5 with Google + Credentials (bcryptjs) providers, Prisma adapter, JWT sessions. The session callback **re-reads `role`/`b2bType`/`b2bStatus` from the DB on every call** rather than trusting the JWT, so B2B approvals and role changes take effect without re-login. Emails in `ADMIN_EMAILS` are auto-promoted to ADMIN on sign-in.
- `src/middleware.ts` — route protection (Node runtime, not Edge). Each role has a "home space" (`/admin`, `/b2b`, `/dashboard`); users hitting another role's space are redirected to their own, and logged-in users are bounced away from `/login`/`/register`.
- Session type augmentation is in `src/types/next-auth.d.ts`.

### B2B partner flow

Partners (role `B2B`) manage their own inventory under `/b2b` (products, explore listings, sales, profile). Content they create carries `ownerId` + `submissionStatus` (`pending` / `approved` / `rejected`, with `rejectionReason`) and only surfaces publicly once approved — repository read functions filter on `submissionStatus: "approved"`. Admin moderation lives under `/admin` and `src/app/api/admin/b2b-submissions/`. Booking/order rows snapshot partner details at transaction time so later profile edits don't rewrite history.

### Data layer

- Prisma schema in `prisma/schema.prisma` (MySQL). Core models: User, Service, ExploreListing, Booking, TimeSlot, Product, Order/OrderItem, Review, Favorite, Contact, Notification, PushSubscription, plus content models (TeamMember, Destination, FAQ, Event, Museum, PracticalGuide, NewsletterSubscriber).
- Singleton client in `src/lib/prisma.ts` — import `prisma` from `@/lib/prisma`, never instantiate `PrismaClient` directly.

### Cross-cutting services (`src/lib/`)

- `seo.ts` — centralised SEO config (`SITE` constant, `buildMetadata()`); use it for every new page's metadata. Site URL is `https://www.calmatrip.com`.
- `notifications.ts` + `notificationEvents.ts` + `push.ts` — in-app notifications (Notification model), a module-level `EventEmitter` that streams them to open SSE connections in real time, and Web Push (VAPID env vars, `usePushSubscription` hook, `ServiceWorkerRegister` component). The emitter and the rate limiter are both **per-process** — correct for the current single-instance `next start` deployment, not for serverless/multi-instance.
- `mail.ts` — nodemailer SMTP transport (SMTP_* env vars documented in the file header).
- `whatsapp.ts` — Twilio WhatsApp notifications; degrades to a no-op returning `false` when `TWILIO_*` env vars are unset, so it's safe to import in dev.
- `cron.ts` — node-cron cleanup job started from `instrumentation.ts`, Node.js runtime only (guards against Edge and hot-reload double-start).
- `calma/i18n.tsx` — client-side FR/EN/AR dictionary + provider with RTL handling for the Calma-branded pages.

### Testing

Vitest, `environment: "node"`, `include: ["src/**/*.test.ts"]` — tests sit beside their source. Coverage today is the Zod schemas, repositories, and pure helpers; no component or E2E tests.

### Other conventions

- Path alias: `@/*` → `src/*`.
- Images are hosted on Cloudinary (`res.cloudinary.com` is the only allowed remote image host; uploads via `src/app/api/admin/upload` / `src/lib/cloudinaryUpload.ts`).
- `next.config.ts` also sets security headers and a non-www → www redirect.
- User-facing strings and many code comments are French; comments are a mix of French and English and either is acceptable.
