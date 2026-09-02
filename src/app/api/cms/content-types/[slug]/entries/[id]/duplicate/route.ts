import { Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import {
  auditCmsAction,
  createRevision,
  requireCmsPermission,
} from "@/features/cms/services/server";
import {
  toFieldInputs,
  validateRelations,
  validateUniqueValues,
} from "@/features/cms/services/entries";
import { validateDynamicData } from "@/features/cms/services/validation";

const schema = z.object({
  slug: z
    .string()
    .trim()
    .min(1)
    .max(160)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  locale: z.enum(["fr", "en", "ar"]).optional(),
  data: z.record(z.string(), z.unknown()).optional(),
});

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string; id: string }> },
) {
  const user = await requireCmsPermission("content.manage");
  if (!user) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success)
    return NextResponse.json(
      { error: "Invalid duplicate", issues: parsed.error.flatten() },
      { status: 400 },
    );
  const { slug, id } = await params;
  const source = await prisma.contentEntry.findFirst({
    where: { id, contentType: { slug } },
    include: { contentType: { include: { fields: { orderBy: { position: "asc" } } } } },
  });
  if (!source) return NextResponse.json({ error: "Entry not found" }, { status: 404 });
  if (!source.contentType.active)
    return NextResponse.json({ error: "This collection is inactive" }, { status: 409 });
  const slugConflict = await prisma.contentEntry.findFirst({
    where: {
      contentTypeId: source.contentTypeId,
      slug: parsed.data.slug,
      locale: parsed.data.locale ?? source.locale,
    },
    select: { id: true },
  });
  if (slugConflict)
    return NextResponse.json(
      { error: "An entry with this slug and language already exists" },
      { status: 409 },
    );
  const definitions = toFieldInputs(source.contentType.fields);
  const data = { ...(source.data as Record<string, unknown>), ...(parsed.data.data ?? {}) };
  const validation = validateDynamicData(definitions, data);
  if (!validation.success)
    return NextResponse.json(
      { error: "Invalid content", fields: validation.errors },
      { status: 400 },
    );
  const fieldErrors = {
    ...(await validateUniqueValues(source.contentTypeId, definitions, validation.data)),
    ...(await validateRelations(definitions, validation.data)),
  };
  if (Object.keys(fieldErrors).length)
    return NextResponse.json({ error: "Invalid content", fields: fieldErrors }, { status: 400 });
  const created = await prisma.contentEntry.create({
    data: {
      contentTypeId: source.contentTypeId,
      slug: parsed.data.slug,
      locale: parsed.data.locale ?? source.locale,
      status: "DRAFT",
      data: validation.data as Prisma.InputJsonValue,
      seo: source.seo as Prisma.InputJsonValue | undefined,
      createdBy: user.id,
      updatedBy: user.id,
    },
  });
  await createRevision("ContentEntry", created.id, created, user.id);
  await auditCmsAction({
    actorId: user.id,
    action: "DUPLICATE",
    entityType: "ContentEntry",
    entityId: created.id,
    after: created,
    metadata: { sourceId: source.id },
  });
  return NextResponse.json(created, { status: 201 });
}
