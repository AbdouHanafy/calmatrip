import { Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { contentEntryInputSchema } from "@/features/cms/schemas/cmsSchemas";
import { validateDynamicData } from "@/features/cms/services/validation";
import {
  toFieldInputs,
  validateRelations,
  validateUniqueValues,
} from "@/features/cms/services/entries";
import {
  auditCmsAction,
  createRevision,
  publicationData,
  requireCmsPermission,
} from "@/features/cms/services/server";

type Context = { params: Promise<{ slug: string; id: string }> };

async function getEntry(slug: string, id: string) {
  return prisma.contentEntry.findFirst({
    where: { id, contentType: { slug } },
    include: { contentType: { include: { fields: { orderBy: { position: "asc" } } } } },
  });
}

export async function GET(_: NextRequest, { params }: Context) {
  const user = await requireCmsPermission("cms.read");
  if (!user) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const { slug, id } = await params;
  const entry = await getEntry(slug, id);
  return entry
    ? NextResponse.json(entry)
    : NextResponse.json({ error: "Entry not found" }, { status: 404 });
}

export async function PATCH(request: NextRequest, { params }: Context) {
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

  const { slug, id } = await params;
  const existing = await getEntry(slug, id);
  if (!existing) return NextResponse.json({ error: "Entry not found" }, { status: 404 });
  if (!existing.contentType.active)
    return NextResponse.json({ error: "This collection is inactive" }, { status: 409 });
  if (parsed.data.status === "PUBLISHED" && !existing.contentType.publishingEnabled)
    return NextResponse.json(
      { error: "Publishing is disabled for this collection" },
      { status: 409 },
    );

  const slugConflict = await prisma.contentEntry.findFirst({
    where: {
      contentTypeId: existing.contentTypeId,
      slug: parsed.data.slug,
      locale: parsed.data.locale,
      id: { not: id },
    },
    select: { id: true },
  });
  if (slugConflict)
    return NextResponse.json(
      { error: "An entry with this slug and language already exists" },
      { status: 409 },
    );

  const definitions = toFieldInputs(existing.contentType.fields);
  const validation = validateDynamicData(definitions, parsed.data.data);
  if (!validation.success)
    return NextResponse.json(
      { error: "Field validation failed", fields: validation.errors },
      { status: 400 },
    );
  const [uniqueErrors, relationErrors] = await Promise.all([
    validateUniqueValues(existing.contentTypeId, definitions, validation.data, id),
    validateRelations(definitions, validation.data),
  ]);
  const semanticErrors = { ...uniqueErrors, ...relationErrors };
  if (Object.keys(semanticErrors).length)
    return NextResponse.json(
      { error: "Field validation failed", fields: semanticErrors },
      { status: 400 },
    );

  const updated = await prisma.contentEntry.update({
    where: { id },
    data: {
      slug: parsed.data.slug,
      locale: parsed.data.locale,
      status: parsed.data.status,
      data: validation.data as Prisma.InputJsonValue,
      seo: parsed.data.seo as Prisma.InputJsonValue | undefined,
      updatedBy: user.id,
      ...publicationData(parsed.data.status, user.id),
    },
  });
  await createRevision("ContentEntry", id, updated, user.id);
  await auditCmsAction({
    actorId: user.id,
    action: "UPDATE",
    entityType: "ContentEntry",
    entityId: id,
    before: existing,
    after: updated,
  });
  return NextResponse.json(updated);
}

export async function DELETE(_: NextRequest, { params }: Context) {
  const user = await requireCmsPermission("content.manage");
  if (!user) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const { slug, id } = await params;
  const existing = await getEntry(slug, id);
  if (!existing) return NextResponse.json({ error: "Entry not found" }, { status: 404 });
  await prisma.contentEntry.delete({ where: { id } });
  await auditCmsAction({
    actorId: user.id,
    action: "DELETE",
    entityType: "ContentEntry",
    entityId: id,
    before: existing,
  });
  return new NextResponse(null, { status: 204 });
}
