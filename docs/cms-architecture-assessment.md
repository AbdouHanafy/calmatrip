# CalmaTrip CMS architecture assessment

## Existing architecture

CalmaTrip is a Next.js 15 App Router application using React 18, TypeScript,
NextAuth v5, Prisma 6 and MySQL. API route handlers call repositories or Prisma,
while public and admin views live separately under `src/views`. Authentication is
session based; `/admin` and `/b2b` are protected by middleware and sensitive API
handlers repeat authorization server-side.

## Reusable components and capabilities

- Full-page collection editors and list components already exist under
  `src/components/admin/collection`.
- Admin upload, rich-text, image serialization, filters, status badges,
  confirmation dialogs, notifications and dashboard primitives are reusable.
- `sanitizeHtml` provides an allow-list sanitizer for rich text.
- The App Router already exposes metadata, sitemap, robots and Open Graph entry
  points. `src/lib/seo.ts` contains the current fixed-page metadata helpers.
- FR, EN and AR are supported by the existing client-side language provider,
  including RTL document direction for Arabic. Locale-prefixed URLs do not
  currently exist and the CMS does not introduce them silently.

## Existing business entities

Users, partner profiles, services, explore listings, bookings, time slots,
products, orders and order items are strongly typed. Reviews, community posts,
contacts, notifications, events, museums, guides, FAQs and newsletters also have
dedicated models and existing admin/API flows.

## Existing CMS-like functionality, forms and SEO

Events, museums, guides and FAQs have fixed-schema CRUD. Services and products
have approval flows. Contact, booking and partner onboarding are bespoke forms;
partner onboarding is resumable and multi-step. SEO is currently code-defined,
and public copy is largely held in a large FR/EN/AR TypeScript dictionary.

## Boundary decision

Bookings, orders, payment status, commission snapshots, users, sessions,
products/services used in transactions, and partner approval remain dedicated,
strongly typed workflows. They are never exposed through the generic CMS editor.

Pages, reusable blocks, new editorial collections, general-purpose forms,
navigation, redirects, media metadata, settings, SEO and localized presentation
content become configuration-driven. Dynamic values use JSON only behind field
definitions and server-side validation; administrators cannot supply code, SQL,
imports or executable expressions.

## Additive implementation

The CMS adds stable tables for content types and fields, entries, pages and
blocks, forms/steps/fields/submissions, media, navigation, settings, redirects,
revisions and audit logs. A registry defines allowed fields and blocks. Services
validate definitions and values, enforce safe conditional operators, sanitize
rich text and URLs, and explicitly publish content. The first release coexists
with all current pages so migration can remain incremental.
