import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { sanitizeHtml } from "@/lib/sanitize";
import DynamicForm from "@/features/forms/components/DynamicForm";
import { NewsletterBlock } from "./blocks/NewsletterBlock";

type Block = { id?: string; type: string; data: Record<string, unknown> };
type EntryCard = { id: string; slug: string; data: Record<string, unknown> };
const text = (value: unknown) => (typeof value === "string" ? value : "");
const records = (value: unknown) =>
  Array.isArray(value)
    ? value.filter(
        (item): item is Record<string, unknown> => Boolean(item) && typeof item === "object",
      )
    : [];

function cardValue(data: Record<string, unknown>, keys: string[]) {
  for (const key of keys)
    if (typeof data[key] === "string" || typeof data[key] === "number") return String(data[key]);
  return "";
}

async function collectionEntries(data: Record<string, unknown>): Promise<EntryCard[]> {
  const slug = text(data.contentType);
  if (!slug) return [];
  const type = await prisma.contentType.findFirst({
    where: { slug, active: true },
    select: { id: true, fields: { select: { key: true } } },
  });
  if (!type) return [];
  const keys = new Set(type.fields.map((field) => field.key));
  const filterField = text(data.filterField);
  const manualSelection = Array.isArray(data.manualSelection)
    ? data.manualSelection.filter((id): id is string => typeof id === "string").slice(0, 24)
    : [];
  const limit = Math.min(24, Math.max(1, Number(data.limit) || 6));
  const entries = await prisma.contentEntry.findMany({
    where: {
      contentTypeId: type.id,
      status: "PUBLISHED",
      ...(manualSelection.length ? { id: { in: manualSelection } } : {}),
      ...(filterField && keys.has(filterField) && data.filterValue !== undefined
        ? { data: { path: `$.${filterField}`, equals: data.filterValue as never } }
        : {}),
    },
    select: { id: true, slug: true, data: true },
    orderBy: { updatedAt: "desc" },
    take: manualSelection.length
      ? manualSelection.length
      : Math.max(limit, text(data.sortField) ? 100 : limit),
  });
  const sortField = text(data.sortField);
  if (sortField && keys.has(sortField))
    entries.sort(
      (a, b) =>
        String((a.data as Record<string, unknown>)[sortField] ?? "").localeCompare(
          String((b.data as Record<string, unknown>)[sortField] ?? ""),
          undefined,
          { numeric: true },
        ) * (data.sortDirection === "asc" ? 1 : -1),
    );
  if (manualSelection.length)
    entries.sort((a, b) => manualSelection.indexOf(a.id) - manualSelection.indexOf(b.id));
  return entries
    .slice(0, limit)
    .map((entry) => ({ ...entry, data: entry.data as Record<string, unknown> }));
}

function CollectionGrid({
  title,
  description,
  entries,
}: {
  title: string;
  description?: string;
  entries: EntryCard[];
}) {
  return (
    <section className="mx-auto max-w-6xl px-6 py-14">
      {title && <h2 className="font-fraunces text-3xl">{title}</h2>}
      {description && <p className="mt-2 max-w-2xl text-calma-taupe">{description}</p>}
      <div className="mt-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {entries.map((entry) => {
          const imageUrl = cardValue(entry.data, ["image", "coverImage", "thumbnail", "photo"]);
          const label = cardValue(entry.data, ["title", "name", "label"]) || entry.slug;
          return (
            <article
              key={entry.id}
              className="overflow-hidden rounded-2xl border border-calma-border bg-white"
            >
              {imageUrl && (
                <div className="relative aspect-[4/3]">
                  <Image src={imageUrl} alt={label} fill className="object-cover" />
                </div>
              )}
              <div className="p-5">
                <h3 className="font-fraunces text-xl">{label}</h3>
                {cardValue(entry.data, ["description", "excerpt", "summary"]) && (
                  <p className="mt-2 line-clamp-3 text-sm text-calma-taupe">
                    {cardValue(entry.data, ["description", "excerpt", "summary"])}
                  </p>
                )}
              </div>
            </article>
          );
        })}
      </div>
      {!entries.length && (
        <p className="mt-6 text-sm text-calma-taupe">
          No published content is available for this block.
        </p>
      )}
    </section>
  );
}

function videoEmbed(value: string) {
  try {
    const parsed = new URL(value);
    if (parsed.hostname.includes("youtu.be"))
      return `https://www.youtube-nocookie.com/embed/${parsed.pathname.slice(1)}`;
    if (parsed.hostname.includes("youtube.com"))
      return `https://www.youtube-nocookie.com/embed/${parsed.searchParams.get("v") ?? ""}`;
    if (parsed.hostname.includes("vimeo.com"))
      return `https://player.vimeo.com/video/${parsed.pathname.split("/").filter(Boolean).pop()}`;
  } catch {
    return "";
  }
  return "";
}

export async function PageRenderer({
  blocks,
  locale = "fr",
}: {
  blocks: Block[];
  locale?: string;
}) {
  const rendered = await Promise.all(
    blocks.map(async (block, index) => {
      const key = block.id ?? `${block.type}-${index}`;
      if (block.type === "HERO")
        return (
          <section
            key={key}
            className={`relative flex min-h-[420px] items-center overflow-hidden bg-admin-navy-deep px-6 py-24 text-white ${block.data.alignment === "left" ? "justify-start text-left" : "justify-center text-center"}`}
          >
            {text(block.data.backgroundImage) && (
              <Image
                src={text(block.data.backgroundImage)}
                alt=""
                fill
                priority={index === 0}
                className="object-cover opacity-45"
              />
            )}
            <div className="relative mx-auto w-full max-w-6xl">
              <div className="max-w-4xl">
                <h1 className="mb-4 font-fraunces text-5xl">{text(block.data.title)}</h1>
                <p className="text-xl opacity-90">{text(block.data.subtitle)}</p>
                {text(block.data.description) && (
                  <p className="mt-4 max-w-2xl opacity-80">{text(block.data.description)}</p>
                )}
                {text(block.data.primaryButtonUrl) && (
                  <Link
                    className="mt-8 inline-block rounded-xl bg-admin-gold px-6 py-3 font-semibold text-white"
                    href={text(block.data.primaryButtonUrl)}
                  >
                    {text(block.data.primaryButtonLabel) || "Discover"}
                  </Link>
                )}
              </div>
            </div>
          </section>
        );
      if (block.type === "RICH_TEXT")
        return (
          <section
            key={key}
            className="prose prose-lg mx-auto max-w-3xl px-6 py-14"
            dangerouslySetInnerHTML={{ __html: sanitizeHtml(text(block.data.html)) }}
          />
        );
      if (block.type === "IMAGE")
        return text(block.data.url) ? (
          <figure key={key} className="mx-auto max-w-5xl px-6 py-10">
            <div className="relative aspect-video">
              <Image
                src={text(block.data.url)}
                alt={text(block.data.alt)}
                fill
                className="rounded-2xl object-cover"
              />
            </div>
            {text(block.data.caption) && (
              <figcaption className="mt-3 text-center text-calma-taupe">
                {text(block.data.caption)}
              </figcaption>
            )}
          </figure>
        ) : null;
      if (block.type === "IMAGE_GALLERY")
        return (
          <section key={key} className="mx-auto max-w-6xl px-6 py-14">
            {text(block.data.title) && (
              <h2 className="mb-7 font-fraunces text-3xl">{text(block.data.title)}</h2>
            )}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {records(block.data.images).map(
                (item, itemIndex) =>
                  text(item.url) && (
                    <figure key={itemIndex}>
                      <div className="relative aspect-[4/3]">
                        <Image
                          src={text(item.url)}
                          alt={text(item.alt)}
                          fill
                          className="rounded-xl object-cover"
                        />
                      </div>
                      {text(item.caption) && (
                        <figcaption className="mt-2 text-sm text-calma-taupe">
                          {text(item.caption)}
                        </figcaption>
                      )}
                    </figure>
                  ),
              )}
            </div>
          </section>
        );
      if (
        [
          "EXPERIENCE_GRID",
          "ACCOMMODATION_GRID",
          "TOUR_GRID",
          "COLLECTION_LIST",
          "RELATED_CONTENT",
          "REVIEW_LIST",
          "TESTIMONIAL_SLIDER",
          "COMMUNITY_FEED",
        ].includes(block.type)
      )
        return (
          <CollectionGrid
            key={key}
            title={text(block.data.title)}
            description={text(block.data.description)}
            entries={await collectionEntries(block.data)}
          />
        );
      if (block.type === "FAQ")
        return (
          <section key={key} className="mx-auto max-w-3xl px-6 py-14">
            <h2 className="mb-6 font-fraunces text-3xl">{text(block.data.title)}</h2>
            {records(block.data.items).map((item, itemIndex) => (
              <details key={itemIndex} className="border-b border-calma-border py-4">
                <summary className="cursor-pointer font-semibold">{text(item.question)}</summary>
                <p className="mt-3 text-calma-taupe">{text(item.answer)}</p>
              </details>
            ))}
          </section>
        );
      if (block.type === "CTA")
        return (
          <section
            key={key}
            className="mx-auto my-12 max-w-5xl rounded-3xl bg-admin-navy px-8 py-14 text-center text-white"
          >
            <h2 className="font-fraunces text-4xl">{text(block.data.title)}</h2>
            <p className="mt-3 opacity-80">{text(block.data.description)}</p>
            {text(block.data.buttonUrl) && (
              <Link
                href={text(block.data.buttonUrl)}
                className="mt-7 inline-block rounded-xl bg-admin-gold px-6 py-3 font-semibold"
              >
                {text(block.data.buttonLabel) || "Learn more"}
              </Link>
            )}
          </section>
        );
      if (block.type === "STATS")
        return (
          <section key={key} className="mx-auto max-w-6xl px-6 py-14">
            <h2 className="text-center font-fraunces text-3xl">{text(block.data.title)}</h2>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {records(block.data.items).map((item, itemIndex) => (
                <div key={itemIndex} className="border border-calma-border p-6 text-center">
                  <strong className="block font-fraunces text-4xl">
                    {String(item.value ?? "")}
                  </strong>
                  <span className="mt-2 block text-sm text-calma-taupe">{text(item.label)}</span>
                </div>
              ))}
            </div>
          </section>
        );
      if (block.type === "FEATURE_CARDS")
        return (
          <section key={key} className="mx-auto max-w-6xl px-6 py-14">
            <h2 className="font-fraunces text-3xl">{text(block.data.title)}</h2>
            <div className="mt-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {records(block.data.items).map((item, itemIndex) => (
                <article key={itemIndex} className="rounded-2xl border border-calma-border p-6">
                  <h3 className="font-fraunces text-xl">{text(item.title)}</h3>
                  <p className="mt-2 text-sm text-calma-taupe">{text(item.description)}</p>
                  {text(item.url) && (
                    <Link href={text(item.url)} className="mt-4 inline-block font-semibold">
                      Learn more
                    </Link>
                  )}
                </article>
              ))}
            </div>
          </section>
        );
      if (block.type === "VIDEO") {
        const embed = videoEmbed(text(block.data.url));
        return (
          <section key={key} className="mx-auto max-w-5xl px-6 py-14">
            <h2 className="mb-6 font-fraunces text-3xl">{text(block.data.title)}</h2>
            {embed ? (
              <iframe
                src={embed}
                title={text(block.data.title) || "Video"}
                className="aspect-video w-full rounded-2xl"
                allowFullScreen
              />
            ) : text(block.data.url) ? (
              <Link href={text(block.data.url)} className="underline">
                Open video
              </Link>
            ) : null}
            {text(block.data.caption) && (
              <p className="mt-3 text-sm text-calma-taupe">{text(block.data.caption)}</p>
            )}
          </section>
        );
      }
      if (block.type === "MAP") {
        const lat = Number(block.data.latitude);
        const lng = Number(block.data.longitude);
        const delta = 0.03;
        const mapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${lng - delta}%2C${lat - delta}%2C${lng + delta}%2C${lat + delta}&layer=mapnik&marker=${lat}%2C${lng}`;
        return (
          <section key={key} className="mx-auto max-w-6xl px-6 py-14">
            <h2 className="mb-6 font-fraunces text-3xl">{text(block.data.title)}</h2>
            <iframe
              src={mapUrl}
              title={text(block.data.title) || "Map"}
              className="h-[420px] w-full rounded-2xl border border-calma-border"
              loading="lazy"
            />
          </section>
        );
      }
      if (["FORM", "CONTACT"].includes(block.type)) {
        const form = await prisma.formDefinition.findFirst({
          where: { slug: text(block.data.formSlug), status: "PUBLISHED" },
          include: {
            steps: {
              include: { fields: { orderBy: { position: "asc" } } },
              orderBy: { position: "asc" },
            },
          },
        });
        return (
          <section key={key} className="mx-auto max-w-3xl px-6 py-14">
            <h2 className="font-fraunces text-3xl">{text(block.data.title)}</h2>
            <p className="mt-2 text-calma-taupe">{text(block.data.description)}</p>
            <div className="mt-8">
              {form ? (
                <DynamicForm slug={form.slug} steps={form.steps} locale={locale} />
              ) : (
                <p className="text-sm text-calma-taupe">This form is not currently available.</p>
              )}
            </div>
          </section>
        );
      }
      if (block.type === "NEWSLETTER")
        return (
          <NewsletterBlock
            key={key}
            title={text(block.data.title)}
            description={text(block.data.description)}
          />
        );
      if (block.type === "BREADCRUMBS")
        return (
          <nav
            key={key}
            aria-label="Breadcrumb"
            className="mx-auto flex max-w-6xl gap-2 px-6 py-5 text-sm text-calma-taupe"
          >
            {records(block.data.items).map((item, itemIndex) => (
              <span key={itemIndex} className="flex gap-2">
                {itemIndex > 0 && <span>/</span>}
                <Link href={text(item.url)}>{text(item.label)}</Link>
              </span>
            ))}
          </nav>
        );
      return null;
    }),
  );
  return <main>{rendered}</main>;
}
