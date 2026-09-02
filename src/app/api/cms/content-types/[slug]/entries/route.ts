import { Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { contentEntryInputSchema } from "@/features/cms/schemas/cmsSchemas";
import { validateDynamicData } from "@/features/cms/services/validation";
import {
  auditCmsAction,
  createRevision,
  publicationData,
  requireCmsPermission,
} from "@/features/cms/services/server";
import {
  toFieldInputs,
  validateRelations,
  validateUniqueValues,
} from "@/features/cms/services/entries";

const statuses = new Set(["DRAFT", "IN_REVIEW", "PUBLISHED", "ARCHIVED"]);
const locales = new Set(["fr", "en", "ar"]);

export async function GET(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const user = await requireCmsPermission("cms.read");
  if (!user) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const { slug } = await params;
  const contentType = await prisma.contentType.findUnique({
    where: { slug },
    include: { fields: { where: { searchable: true } } },
  });
  if (!contentType) return NextResponse.json({ error: "Content type not found" }, { status: 404 });
  const search = request.nextUrl.searchParams.get("search")?.trim();
  const page = Math.max(1, Number(request.nextUrl.searchParams.get("page")) || 1);
  const take = Math.min(100, Math.max(1, Number(request.nextUrl.searchParams.get("limit")) || 25));
  const status = request.nextUrl.searchParams.get("status");
  const locale = request.nextUrl.searchParams.get("locale");
  const sort = ["slug", "status", "locale", "createdAt", "updatedAt"].includes(
    request.nextUrl.searchParams.get("sort") ?? "",
  )
    ? request.nextUrl.searchParams.get("sort")!
    : "updatedAt";
  const direction = request.nextUrl.searchParams.get("direction") === "asc" ? "asc" : "desc";
  const searchable = contentType.fields.filter((field) =>
    ["TEXT", "TEXTAREA", "RICH_TEXT", "EMAIL", "URL", "SLUG"].includes(field.type),
  );
  const where: Prisma.ContentEntryWhereInput = {
    contentTypeId: contentType.id,
    ...(status && statuses.has(status) ? { status } : {}),
    ...(locale && locales.has(locale) ? { locale } : {}),
    ...(search
      ? {
          OR: [
            { slug: { contains: search } },
            ...searchable.map((field) => ({
              data: { path: `$.${field.key}`, string_contains: search },
            })),
          ],
        }
      : {}),
  };
  const [items, total] = await prisma.$transaction([
    prisma.contentEntry.findMany({
      where,
      orderBy: { [sort]: direction },
      skip: (page - 1) * take,
      take,
    }),
    prisma.contentEntry.count({ where }),
  ]);
  return NextResponse.json({ items, total, page, pages: Math.ceil(total / take) });
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const user = await requireCmsPermission("content.manage");
  if (!user) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const parsed = contentEntryInputSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success)
    return NextResponse.json(
      { error: "Invalid entry", issues: parsed.error.flatten() },
      { status: 400 },
    );
  if (parsed.data.status === "PUBLISHED" && !(await requireCmsPermission("content.publish")))
    return NextResponse.json({ error: "Publishing permission required" }, { status: 403 });
  const { slug } = await params;
  const type = await prisma.contentType.findUnique({
    where: { slug },
    include: { fields: { orderBy: { position: "asc" } } },
  });
  if (!type) return NextResponse.json({ error: "Content type not found" }, { status: 404 });
  if (!type.active)
    return NextResponse.json({ error: "This collection is inactive" }, { status: 409 });
  if (parsed.data.status === "PUBLISHED" && !type.publishingEnabled)
    return NextResponse.json(
      { error: "Publishing is disabled for this collection" },
      { status: 409 },
    );
  const slugConflict = await prisma.contentEntry.findFirst({
    where: { contentTypeId: type.id, slug: parsed.data.slug, locale: parsed.data.locale },
    select: { id: true },
  });
  if (slugConflict)
    return NextResponse.json(
      { error: "An entry with this slug and language already exists" },
      { status: 409 },
    );
  const definitions = toFieldInputs(type.fields);
  const validation = validateDynamicData(definitions, parsed.data.data);
  if (!validation.success)
    return NextResponse.json(
      { error: "Field validation failed", fields: validation.errors },
      { status: 400 },
    );
  const [uniqueErrors, relationErrors] = await Promise.all([
    validateUniqueValues(type.id, definitions, validation.data),
    validateRelations(definitions, validation.data),
  ]);
  const semanticErrors = { ...uniqueErrors, ...relationErrors };
  if (Object.keys(semanticErrors).length)
    return NextResponse.json(
      { error: "Field validation failed", fields: semanticErrors },
      { status: 400 },
    );
  const created = await prisma.contentEntry.create({
    data: {
      contentTypeId: type.id,
      slug: parsed.data.slug,
      locale: parsed.data.locale,
      status: parsed.data.status,
      data: validation.data as Prisma.InputJsonValue,
      seo: parsed.data.seo as Prisma.InputJsonValue | undefined,
      createdBy: user.id,
      updatedBy: user.id,
      ...publicationData(parsed.data.status, user.id),
    },
  });
  await createRevision("ContentEntry", created.id, created, user.id);
  await auditCmsAction({
    actorId: user.id,
    action: "CREATE",
    entityType: "ContentEntry",
    entityId: created.id,
    after: created,
  });
  return NextResponse.json(created, { status: 201 });
}
