import { Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { contentTypeInputSchema } from "@/features/cms/schemas/cmsSchemas";
import {
  auditCmsAction,
  createRevision,
  requireCmsPermission,
} from "@/features/cms/services/server";
import { evolveEntryData } from "@/features/cms/services/schemaEvolution";
import type { FieldDefinitionInput } from "@/features/cms/types";

export async function GET(_: Request, { params }: { params: Promise<{ slug: string }> }) {
  const user = await requireCmsPermission("cms.read");
  if (!user) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const item = await prisma.contentType.findUnique({
    where: { slug: (await params).slug },
    include: { fields: { orderBy: { position: "asc" } } },
  });
  return item
    ? NextResponse.json(item)
    : NextResponse.json({ error: "Not found" }, { status: 404 });
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const user = await requireCmsPermission("content.manage");
  if (!user) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const parsed = contentTypeInputSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success)
    return NextResponse.json(
      { error: "Invalid content type", issues: parsed.error.flatten() },
      { status: 400 },
    );

  const currentSlug = (await params).slug;
  const existing = await prisma.contentType.findUnique({
    where: { slug: currentSlug },
    include: {
      fields: { orderBy: { position: "asc" } },
      entries: { select: { id: true, data: true } },
    },
  });
  if (!existing) return NextResponse.json({ error: "Content type not found" }, { status: 404 });
  if (parsed.data.slug !== currentSlug) {
    const slugOwner = await prisma.contentType.findUnique({
      where: { slug: parsed.data.slug },
      select: { id: true },
    });
    if (slugOwner)
      return NextResponse.json(
        { error: "A collection with this slug already exists" },
        { status: 409 },
      );
  }

  const existingIds = new Set(existing.fields.map((field) => field.id));
  if (parsed.data.fields.some((field) => field.id && !existingIds.has(field.id))) {
    return NextResponse.json(
      { error: "A field does not belong to this content type" },
      { status: 400 },
    );
  }

  const relationTargets = [
    ...new Set(parsed.data.fields.map((field) => field.relation?.contentType).filter(Boolean)),
  ].filter((target) => target !== currentSlug && target !== parsed.data.slug) as string[];
  if (relationTargets.length) {
    const targets = await prisma.contentType.count({
      where: { slug: { in: relationTargets }, active: true },
    });
    if (targets !== relationTargets.length)
      return NextResponse.json(
        { error: "One or more relation targets are invalid" },
        { status: 400 },
      );
  }

  const previousFields = existing.fields.map((field) => ({
    id: field.id,
    key: field.key,
    label: field.label,
    type: field.type as FieldDefinitionInput["type"],
    required: field.required,
    unique: field.unique,
    defaultValue: field.defaultValue ?? undefined,
    validation: field.validation as FieldDefinitionInput["validation"],
    options: field.options as FieldDefinitionInput["options"],
    relation: field.relation as FieldDefinitionInput["relation"],
  }));
  const evolvedEntries: Array<{ id: string; data: Record<string, unknown> }> = [];
  for (const entry of existing.entries) {
    const result = evolveEntryData(
      entry.data as Record<string, unknown>,
      previousFields,
      parsed.data.fields,
    );
    if (!result.success) {
      return NextResponse.json(
        {
          error: "Schema change is incompatible with existing entries",
          entryId: entry.id,
          fields: result.errors,
        },
        { status: 409 },
      );
    }
    evolvedEntries.push({ id: entry.id, data: result.data });
  }

  const relationReferences = await prisma.fieldDefinition.findMany({
    where: { type: { in: ["RELATION", "MULTI_RELATION"] }, contentTypeId: { not: existing.id } },
    select: { id: true, relation: true },
  });

  const nextIds = parsed.data.fields.flatMap((field) => (field.id ? [field.id] : []));
  const { fields, ...definition } = parsed.data;
  const updated = await prisma.$transaction(async (tx) => {
    await tx.fieldDefinition.deleteMany({
      where: { contentTypeId: existing.id, ...(nextIds.length ? { id: { notIn: nextIds } } : {}) },
    });
    for (const field of fields) {
      const data = {
        key: field.key,
        label: field.label,
        type: field.type,
        required: field.required,
        unique: field.unique,
        localized: field.localized,
        searchable: field.searchable,
        sortable: field.sortable,
        position: field.position,
        placeholder: field.placeholder as Prisma.InputJsonValue | undefined,
        helpText: field.helpText as Prisma.InputJsonValue | undefined,
        defaultValue: field.defaultValue as Prisma.InputJsonValue | undefined,
        validation: field.validation as Prisma.InputJsonValue | undefined,
        options: field.options as Prisma.InputJsonValue | undefined,
        visibility: field.visibility as Prisma.InputJsonValue | undefined,
        relation: field.relation as Prisma.InputJsonValue | undefined,
      };
      if (field.id) await tx.fieldDefinition.update({ where: { id: field.id }, data });
      else await tx.fieldDefinition.create({ data: { ...data, contentTypeId: existing.id } });
    }
    for (const entry of evolvedEntries) {
      await tx.contentEntry.update({
        where: { id: entry.id },
        data: { data: entry.data as Prisma.InputJsonValue, updatedBy: user.id },
      });
    }
    if (definition.slug !== currentSlug) {
      for (const reference of relationReferences) {
        const relation = reference.relation as { contentType?: string; multiple?: boolean } | null;
        if (relation?.contentType === currentSlug) {
          await tx.fieldDefinition.update({
            where: { id: reference.id },
            data: { relation: { ...relation, contentType: definition.slug } },
          });
        }
      }
    }
    return tx.contentType.update({
      where: { id: existing.id },
      data: { ...definition, listColumns: definition.listColumns ?? undefined, updatedBy: user.id },
      include: { fields: { orderBy: { position: "asc" } }, _count: { select: { entries: true } } },
    });
  });

  await createRevision("ContentType", updated.id, updated, user.id);
  await auditCmsAction({
    actorId: user.id,
    action: "UPDATE",
    entityType: "ContentType",
    entityId: updated.id,
    before: existing,
    after: updated,
  });
  return NextResponse.json(updated);
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const user = await requireCmsPermission("content.manage");
  if (!user) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const slug = (await params).slug;
  const existing = await prisma.contentType.findUnique({
    where: { slug },
    include: { _count: { select: { entries: true } } },
  });
  if (!existing) return NextResponse.json({ error: "Content type not found" }, { status: 404 });
  if (existing._count.entries > 0)
    return NextResponse.json(
      { error: "Deactivate populated collections instead of deleting them" },
      { status: 409 },
    );
  const relationFields = await prisma.fieldDefinition.findMany({
    where: { type: { in: ["RELATION", "MULTI_RELATION"] } },
    select: { relation: true },
  });
  const referenced = relationFields.some(
    (field) => (field.relation as { contentType?: string } | null)?.contentType === slug,
  );
  if (referenced)
    return NextResponse.json(
      { error: "This collection is referenced by another collection and cannot be deleted" },
      { status: 409 },
    );
  await prisma.contentType.delete({ where: { id: existing.id } });
  await auditCmsAction({
    actorId: user.id,
    action: "DELETE",
    entityType: "ContentType",
    entityId: existing.id,
    before: existing,
  });
  return new NextResponse(null, { status: 204 });
}
