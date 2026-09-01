# A Payload-style admin pattern for Calma Trip

Adapted from the same pattern built for `dunes-insolites/admin` — not a
copy-paste, re-derived against this repo's real stack: Next.js 15 App
Router, Prisma (MySQL), NextAuth v5, Zod, and the four-layer API-route
shape already established in `src/app/api/**`. Written by reading this
repo, not assumed — every file path and convention below is real.

---

## 1. What's actually changing

Calma Trip's admin already has real CRUD for every content type
(`AdminEvents`, `AdminMuseums`, `AdminFAQ`, `AdminGuides`, …) — this isn't
a "build an admin from zero" job like `dunes-insolites` was. What's
missing is a specific _shape_:

**Today** (`src/views/admin/AdminEvents.tsx`, and every sibling screen):
a list page with a **modal dialog** for create/edit — `EventModal`
overlays the list, the URL never changes, and there's no separate
document to link to, bookmark, or come back to mid-edit.

**Payload's shape**, which this doc ports over: a **collection list**
(plain page, search box, "+ Create" button linking to a real route) and
a **full-page document editor** — its own URL, a breadcrumb trail back
to the list, main fields on the left, a **sticky sidebar panel** on the
right holding Save / Status / Publish / Delete, separate from the fields
themselves. Nothing is a `<Dialog>`.

This matters most for content that's genuinely long-form (a new
marketing/landing page, a multi-section guide) where a modal is
cramped — and it's the shape you reach for going forward, not a
mandate to rewrite `AdminEvents.tsx` this week. See §7 for the
migration story.

---

## 2. The missing content model: `Page`

Every existing model (`Event`, `Museum`, `FAQ`, `PracticalGuide`,
`Destination`, `TeamMember`) has a **fixed shape** — specific columns,
specific admin form. There's no way today to make a new landing page
(say, a seasonal campaign or a partner-specific page) without a Prisma
migration and a bespoke admin screen. That's the actual gap this pattern
fills: a `Page` model whose content is a **flexible list of typed
blocks**, editable without touching the schema again.

Add to `prisma/schema.prisma`:

```prisma
model Page {
  id              Int       @id @default(autoincrement())
  slug            String    @unique
  title           String
  status          PageStatus @default(DRAFT)
  seoTitle        String?
  metaDescription String?
  ogImage         String?
  blocks          Json      // PageBlock[] — see §3
  publishedAt     DateTime?
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt

  @@index([status])
}

enum PageStatus {
  DRAFT
  PUBLISHED
}
```

Run `npm run db:push` (or a real migration once this is settled) and
`npx prisma generate`.

**Why `Json` for `blocks` and not a relation table:** this repo already
uses `Json` for flexible per-row data (`Booking.selectedOptions`,
`Order` line-item snapshots) — same convention, not a new one. A block
is `{ type: string, data: Record<string, unknown> }[]`; validate its
_shape_ with Zod at the API boundary (§4), not with a schema-enforced
relation.

**Why `status` as an enum column, not a boolean:** matches the existing
`submissionStatus` string pattern on B2B-submitted content
(`pending`/`approved`/`rejected`) — this repo already has the idea of
"exists but isn't public yet," just under a different name for B2B.
`Page` gets its own two-state version because there's no approval step,
just draft → publish.

---

## 3. The block registry

One file, the single source of truth for what block types exist —
mirrors `dunes-insolites/admin/components/pages/blockTypes.tsx`, adapted
to a plain TS module since there's no separate admin app here to import
from:

`src/lib/pageBlocks.ts`

```ts
export type PageBlockType = "hero" | "richText" | "cta" | "faq" | "gallery";

export type PageBlock = {
  type: PageBlockType;
  data: Record<string, unknown>;
};

// Field definitions per block type, consumed by the admin editor (§6) to
// render the right inputs, and by nothing else — the public renderer
// (§4) only cares about `data`'s actual shape at render time.
export const BLOCK_TYPES: {
  type: PageBlockType;
  label: string;
  fields: { key: string; label: string; kind: "text" | "textarea" | "image" | "url" }[];
}[] = [
  {
    type: "hero",
    label: "Hero",
    fields: [
      { key: "heading", label: "Titre", kind: "text" },
      { key: "subheading", label: "Sous-titre", kind: "textarea" },
      { key: "image", label: "Image", kind: "image" },
      { key: "ctaLabel", label: "Bouton — texte", kind: "text" },
      { key: "ctaHref", label: "Bouton — lien", kind: "url" },
    ],
  },
  {
    type: "richText",
    label: "Texte riche",
    fields: [{ key: "html", label: "Contenu", kind: "textarea" }],
  },
  {
    type: "cta",
    label: "Appel à l'action",
    fields: [
      { key: "heading", label: "Titre", kind: "text" },
      { key: "buttonLabel", label: "Bouton — texte", kind: "text" },
      { key: "buttonHref", label: "Bouton — lien", kind: "url" },
    ],
  },
  // faq, gallery — same shape, add as needed. Adding a block type is
  // exactly this: one entry here, one `case` in the renderer below.
];
```

Public renderer, `src/components/pages/PageBlocks.tsx`:

```tsx
import type { PageBlock } from "@/lib/pageBlocks";

export function PageBlocks({ blocks }: { blocks: PageBlock[] }) {
  return (
    <>
      {blocks.map((block, i) => {
        switch (block.type) {
          case "hero":
            return <HeroBlock key={i} data={block.data} />;
          case "richText":
            // User-typed HTML must go through sanitizeHtml() at write
            // time (src/lib/sanitize.ts) — see §4's Zod schema. Never
            // re-sanitize here; trust what already passed the API layer,
            // same as every other rich-text field in this repo.
            return <div key={i} dangerouslySetInnerHTML={{ __html: block.data.html as string }} />;
          case "cta":
            return <CtaBlock key={i} data={block.data} />;
          default:
            return null; // unknown/future block type — render nothing, never crash a public page
        }
      })}
    </>
  );
}
```

**User-supplied HTML in a block's `richText.html`** must pass through
`sanitizeHtml()` (`src/lib/sanitize.ts`) at write time, exactly like
every other rich-text field in this repo (reviews, contact messages) —
do this in the Zod schema's `.transform()` or in the repository's create/
update function, not in the renderer.

---

## 4. API routes — following this repo's own four-layer shape

`src/schemas/page.ts` (Zod, next to its own `page.test.ts` — this repo's
own convention, every schema gets a test file beside it):

```ts
import { z } from "zod";

export const pageBlockSchema = z.object({
  type: z.enum(["hero", "richText", "cta", "faq", "gallery"]),
  data: z.record(z.string(), z.unknown()),
});

export const pageSchema = z.object({
  slug: z
    .string()
    .min(1)
    .regex(/^[a-z0-9-]+$/, "Slug: lettres minuscules, chiffres, tirets"),
  title: z.string().min(1),
  seoTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  ogImage: z.string().url().optional(),
  blocks: z.array(pageBlockSchema),
});
```

`src/repositories/pageRepository.ts` — all Prisma queries live here,
never called directly from a route (this repo's rule, stated in
`CLAUDE.md`):

```ts
import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";

export function getAllPages() {
  return prisma.page.findMany({ orderBy: { updatedAt: "desc" } });
}

export function getPageById(id: number) {
  return prisma.page.findUnique({ where: { id } });
}

export function getPublishedPageBySlug(slug: string) {
  return prisma.page.findFirst({ where: { slug, status: "PUBLISHED" } });
}

export function createPage(data: Prisma.PageCreateInput) {
  return prisma.page.create({ data });
}

export function updatePage(id: number, data: Prisma.PageUpdateInput) {
  return prisma.page.update({ where: { id }, data });
}

export function setPageStatus(id: number, status: "DRAFT" | "PUBLISHED") {
  return prisma.page.update({
    where: { id },
    data: { status, publishedAt: status === "PUBLISHED" ? new Date() : null },
  });
}

export function deletePage(id: number) {
  return prisma.page.delete({ where: { id } });
}
```

`src/app/api/admin/pages/route.ts` — same auth check as
`src/app/api/admin/events/route.ts` line for line, Zod instead of hand
parsing:

```ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { pageSchema } from "@/schemas/page";
import { getAllPages, createPage } from "@/repositories/pageRepository";

export async function GET() {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.json(await getAllPages());
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  const parsed = pageSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
  }

  const page = await createPage(parsed.data);
  return NextResponse.json(page, { status: 201 });
}
```

No `checkRateLimit()` here — that's for public write endpoints per
`CLAUDE.md`'s own description of the four layers; `/api/admin/**` is
already behind the session/role check, same as every other admin route
in this repo.

`src/app/api/admin/pages/[id]/route.ts` — `GET`/`PUT`/`DELETE`, same
shape. `src/app/api/admin/pages/[id]/publish/route.ts` and
`.../unpublish/route.ts` — two tiny `PATCH` handlers calling
`setPageStatus`, nothing else; keep publish a one-click action, not a
detour through the general-purpose update route (same reasoning
`dunes-insolites` used for its own publish/unpublish endpoints — one
clear intent per request, not an overloaded `PUT` with a status field
buried in the body).

**Public route**, `src/app/(site)/[slug]/page.tsx` (adjust to wherever
this repo's catch-all/marketing routes actually live — check for a
conflict with existing static routes like `/services`, `/marketplace`
before wiring this in):

```ts
import { getPublishedPageBySlug } from "@/repositories/pageRepository";
import { PageBlocks } from "@/components/pages/PageBlocks";
import { buildMetadata } from "@/lib/seo";
import { notFound } from "next/navigation";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = await getPublishedPageBySlug(slug);
  if (!page) return { title: "Page introuvable", robots: { index: false } };
  return buildMetadata({
    title: page.seoTitle || page.title,
    description: page.metaDescription ?? undefined,
  });
}

export default async function CmsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = await getPublishedPageBySlug(slug);
  if (!page) notFound();
  return <PageBlocks blocks={page.blocks as never} />;
}
```

A draft page 404s for a public visitor — same "publish is the only way
to affect the live site" guarantee `dunes-insolites` built, for the same
reason: an editor saving mid-edit must never leak to a real visitor.

---

## 5. Admin UI — list + full-page editor

### List: `src/views/admin/AdminPages.tsx`

Table, search box, a real `+ Nouvelle page` **link** (not a button that
opens a dialog) to `/admin/pages/new`:

```tsx
"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";

type PageRow = {
  id: number;
  slug: string;
  title: string;
  status: "DRAFT" | "PUBLISHED";
  updatedAt: string;
};

export default function AdminPages() {
  const [pages, setPages] = useState<PageRow[]>([]);
  const [query, setQuery] = useState("");

  useEffect(() => {
    fetch("/api/admin/pages")
      .then((r) => r.json())
      .then(setPages);
  }, []);

  const filtered = pages.filter((p) => p.title.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-calma-ink">Pages</h1>
        <Link href="/admin/pages/new" className="btn-admin-primary">
          <Plus size={16} /> Nouvelle page
        </Link>
      </div>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Rechercher…"
        className="w-full max-w-sm rounded-xl border border-calma-border px-3 py-2 text-sm focus:border-calma-terracotta focus:outline-none"
      />
      <div className="overflow-hidden rounded-2xl border border-calma-border bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs uppercase tracking-wide text-calma-taupe">
              <th className="px-5 py-3">Titre</th>
              <th className="px-5 py-3">Statut</th>
              <th className="px-5 py-3">Modifiée</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-calma-border">
            {filtered.map((p) => (
              <tr
                key={p.id}
                className="cursor-pointer hover:bg-calma-sand/40"
                onClick={() => (window.location.href = `/admin/pages/${p.id}`)}
              >
                <td className="px-5 py-3">{p.title}</td>
                <td className="px-5 py-3">
                  <StatusPill status={p.status} />
                </td>
                <td className="px-5 py-3 text-calma-taupe">
                  {new Date(p.updatedAt).toLocaleDateString("fr-FR")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
```

(`StatusPill` — a small colored-dot badge, exactly the pattern in §8.)

### Editor route: `src/app/admin/pages/[id]/page.tsx` + `src/app/admin/pages/new/page.tsx`

Thin server pages, matching this repo's own Page/View split
(`CLAUDE.md`'s stated convention) — fetch nothing fancy here beyond what
the view needs:

```tsx
// src/app/admin/pages/[id]/page.tsx
import PagesEditor from "@/views/admin/PagesEditor";
import { getPageById } from "@/repositories/pageRepository";
import { notFound } from "next/navigation";

export default async function EditPagePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const page = await getPageById(Number(id));
  if (!page) notFound();
  return <PagesEditor page={page} />;
}
```

```tsx
// src/app/admin/pages/new/page.tsx
import PagesEditor from "@/views/admin/PagesEditor";
export default function NewPagePage() {
  return <PagesEditor page={null} />;
}
```

### `src/views/admin/PagesEditor.tsx` — the actual document editor

Two-column grid, sidebar panel sticky on the right — this is the piece
that's genuinely new to this repo:

```tsx
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";
import { BLOCK_TYPES, type PageBlock } from "@/lib/pageBlocks";
import { StatusPill } from "@/components/admin/StatusPill";
import { Breadcrumb } from "@/components/admin/Breadcrumb";

export default function PagesEditor({ page }: { page: PageRow | null }) {
  const router = useRouter();
  const isEdit = !!page;
  const [title, setTitle] = useState(page?.title ?? "");
  const [slug, setSlug] = useState(page?.slug ?? "");
  const [blocks, setBlocks] = useState<PageBlock[]>((page?.blocks as PageBlock[]) ?? []);
  const [busy, setBusy] = useState(false);

  async function onSave() {
    setBusy(true);
    const url = isEdit ? `/api/admin/pages/${page!.id}` : "/api/admin/pages";
    const res = await fetch(url, {
      method: isEdit ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, slug, blocks }),
    });
    setBusy(false);
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      toast.error(data.error ?? "Une erreur est survenue.");
      return;
    }
    toast.success(isEdit ? "Modifié avec succès" : "Créé avec succès");
    router.push("/admin/pages");
    router.refresh();
  }

  async function setStatus(action: "publish" | "unpublish") {
    if (!page) return;
    setBusy(true);
    const res = await fetch(`/api/admin/pages/${page.id}/${action}`, { method: "PATCH" });
    setBusy(false);
    if (res.ok) {
      toast.success(action === "publish" ? "Page publiée" : "Page dépubliée");
      router.refresh();
    } else {
      toast.error("Action impossible.");
    }
  }

  return (
    <div className="flex flex-col gap-5">
      <div>
        <Breadcrumb
          items={[
            { label: "Pages", href: "/admin/pages" },
            { label: isEdit ? title || "Modifier" : "Nouvelle" },
          ]}
        />
        <h1 className="mt-1 text-xl font-bold text-calma-ink">
          {isEdit ? title || "Modifier" : "Nouvelle page"}
        </h1>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_280px]">
        <div className="flex flex-col gap-4 rounded-2xl border border-calma-border bg-white p-6">
          {/* title/slug fields, block list + add/remove/reorder — same
              shape as dunes-insolites' PageBuilder.tsx, using BLOCK_TYPES
              from §3 to render the right inputs per block */}
        </div>

        <aside className="h-fit xl:sticky xl:top-20">
          <div className="flex flex-col gap-4 rounded-2xl border border-calma-border bg-white p-5">
            <button
              onClick={onSave}
              disabled={busy}
              className="btn-admin-primary w-full justify-center"
            >
              {busy ? "Enregistrement…" : isEdit ? "Enregistrer" : "Créer"}
            </button>
            <Link href="/admin/pages" className="btn-admin-secondary w-full justify-center">
              Annuler
            </Link>
            {isEdit && (
              <>
                <div className="border-t border-calma-border pt-4">
                  <p className="text-[11px] font-bold uppercase tracking-wide text-calma-taupe">
                    Statut
                  </p>
                  <StatusPill status={page.status} className="mt-1.5" />
                </div>
                {page.status === "PUBLISHED" ? (
                  <button
                    onClick={() => setStatus("unpublish")}
                    disabled={busy}
                    className="btn-admin-secondary w-full justify-center"
                  >
                    Dépublier
                  </button>
                ) : (
                  <button
                    onClick={() => setStatus("publish")}
                    disabled={busy}
                    className="btn-admin-success-outline w-full justify-center"
                  >
                    Publier
                  </button>
                )}
              </>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
```

---

## 6. The design pieces, using what's already installed

This is the part that's genuinely different from the `dunes-insolites`
version: that admin app had **no** toast library and hand-rolled one.
**Calma Trip already has `sonner` in `package.json` — currently unused
nowhere in `src/`.** Use it instead of building a second one.

### Toasts

One line in the root layout (`src/app/layout.tsx`), once:

```tsx
import { Toaster } from "sonner";
// ...inside the returned JSX, once:
<Toaster richColors position="top-right" />;
```

Then `toast.success("…")` / `toast.error("…")` from any client
component, as used in `PagesEditor.tsx` above. That's the entire
integration — no context/provider to write, unlike the bespoke one built
for `dunes-insolites/admin`.

### Breadcrumbs

`src/components/admin/Breadcrumb.tsx` — small and bespoke, same as
`dunes-insolites`' version (no MUI import needed even though MUI is a
dependency; keeping this in plain Tailwind matches every other admin
screen in this repo, which don't use MUI components despite it being
installed):

```tsx
import Link from "next/link";

export function Breadcrumb({ items }: { items: { label: string; href?: string }[] }) {
  return (
    <nav className="flex items-center gap-1.5 text-[13px]">
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-1.5">
          {i > 0 && <span className="text-calma-taupe/50">/</span>}
          {item.href && i < items.length - 1 ? (
            <Link href={item.href} className="font-medium text-calma-taupe hover:text-calma-ink">
              {item.label}
            </Link>
          ) : (
            <span className="font-semibold text-calma-ink">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
```

### Buttons — extend the admin-olive palette, not the public terracotta one

`AdminDashboard.tsx`'s own comment already calls the admin space "deep
olive, the admin space's identity color" — distinct from the public
site's terracotta, on purpose (same split `dunes-insolites` made between
its navy/gold admin and terracotta/orange vitrine). Buttons _inside_
`/admin` should key off `calma-olive`, not `calma-terracotta` — using
terracotta in the admin would blur that intentional separation.

Add to `src/styles/index.css`, alongside the existing `@theme` block:

```css
.btn-admin-primary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  border-radius: 0.75rem;
  padding: 0.625rem 1.125rem;
  font-size: 0.875rem;
  font-weight: 600;
  background: var(--color-calma-olive);
  color: white;
  transition:
    background 0.15s ease,
    transform 0.1s ease;
}
.btn-admin-primary:hover:not(:disabled) {
  background: var(--color-calma-olive-deep);
}
.btn-admin-primary:active:not(:disabled) {
  transform: scale(0.98);
}
.btn-admin-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-admin-secondary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  border-radius: 0.75rem;
  padding: 0.625rem 1.125rem;
  font-size: 0.875rem;
  font-weight: 600;
  background: white;
  color: var(--color-calma-ink);
  border: 1px solid var(--color-calma-border);
  transition: background 0.15s ease;
}
.btn-admin-secondary:hover:not(:disabled) {
  background: var(--color-calma-sand);
}

.btn-admin-danger-outline {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  border-radius: 0.75rem;
  padding: 0.625rem 1.125rem;
  font-size: 0.875rem;
  font-weight: 600;
  background: transparent;
  color: #c0392b;
  border: 1px solid rgba(192, 57, 43, 0.3);
}
.btn-admin-danger-outline:hover:not(:disabled) {
  background: rgba(192, 57, 43, 0.08);
}

.btn-admin-success-outline {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  border-radius: 0.75rem;
  padding: 0.625rem 1.125rem;
  font-size: 0.875rem;
  font-weight: 600;
  background: transparent;
  color: #1a8a5a;
  border: 1px solid rgba(26, 138, 90, 0.3);
}
.btn-admin-success-outline:hover:not(:disabled) {
  background: rgba(26, 138, 90, 0.08);
}
```

Existing screens like `AdminEvents.tsx` (line 278) currently reach for
`bg-calma-terracotta` on an admin button — that's the terracotta/olive
split not yet applied consistently. Not something to mass-fix in one
pass (see §7), but new admin work should use `.btn-admin-*`, not
`bg-calma-terracotta`.

### Status pill

`src/components/admin/StatusPill.tsx`:

```tsx
export function StatusPill({
  status,
  className = "",
}: {
  status: "DRAFT" | "PUBLISHED";
  className?: string;
}) {
  const published = status === "PUBLISHED";
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[12px] font-semibold ${published ? "bg-emerald-100 text-emerald-700" : "bg-calma-sand text-calma-taupe"} ${className}`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${published ? "bg-emerald-600" : "bg-calma-taupe"}`}
      />
      {published ? "Publiée" : "Brouillon"}
    </span>
  );
}
```

---

## 7. Migration story — don't rewrite what already works

`AdminEvents`, `AdminMuseums`, `AdminFAQ`, `AdminGuides`,
`AdminMarketplace` etc. all work today via modal dialogs. **Nothing here
requires touching them.** The plan:

1. Build `Page` + its full-page editor as described above — it's new
   functionality (flexible landing pages), not a replacement for
   anything.
2. Mount `<Toaster />` once (§6) — every _new_ toast call anywhere in the
   app benefits immediately, existing modal screens included, with zero
   further changes to them.
3. If/when an existing modal screen grows real pain (a form too long for
   a dialog, a real "I wanted to bookmark this specific edit" need),
   migrate _that one_ to the full-page shape — `AdminEvents.tsx`'s
   `EventModal` becomes `src/app/admin/events/[id]/page.tsx` +
   `src/views/admin/EventEditor.tsx`, same shape as `PagesEditor.tsx`
   above, the modal deleted. One screen at a time, verified live each
   time (`npm run dev`, click through it for real), never a blanket
   rewrite.

---

## 8. What NOT to port from `dunes-insolites` verbatim

- **No MapStruct/DTO-mapper layer** — this repo has no separate backend
  service; a Prisma model _is_ the shape a route returns, filtered by
  what `select`/`omit` the repository function uses. Don't invent a
  mapping layer that doesn't exist here.
- **No bespoke Toast component** — `sonner` is already installed, use it
  (§6).
- **No separate admin app / BFF proxy** — `dunes-insolites/admin` is a
  second Next.js app proxying to a Spring Boot API, which is why it
  needed `app/api/proxy/**`. Calma Trip is one app; admin routes call
  Prisma through repositories directly, no proxy layer needed.
- **Auth check is `session?.user?.role !== "ADMIN"`**, not a Spring
  `@PreAuthorize` annotation — copy the exact line from
  `src/app/api/admin/events/route.ts`, not a re-derived equivalent.
