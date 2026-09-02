import { Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { contentTypeInputSchema } from "@/features/cms/schemas/cmsSchemas";
import {
  auditCmsAction,
  createRevision,
  requireCmsPermission,
} from "@/features/cms/services/server";

export async function GET() {
  const user = await requireCmsPermission("cms.read");
  if (!user) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  return NextResponse.json(
    await prisma.contentType.findMany({
      include: { fields: { orderBy: { position: "asc" } }, _count: { select: { entries: true } } },
      orderBy: { name: "asc" },
    }),
  );
}

export async function POST(request: NextRequest) {
  const user = await requireCmsPermission("content.manage");
  if (!user) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const parsed = contentTypeInputSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success)
    return NextResponse.json(
      { error: "Invalid content type", issues: parsed.error.flatten() },
      { status: 400 },
    );
  if (
    await prisma.contentType.findUnique({ where: { slug: parsed.data.slug }, select: { id: true } })
  ) {
    return NextResponse.json(
      { error: "A collection with this slug already exists" },
      { status: 409 },
    );
  }
  const relationTargets = [
    ...new Set(parsed.data.fields.map((field) => field.relation?.contentType).filter(Boolean)),
  ] as string[];
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
  const { fields, ...definition } = parsed.data;
  const fieldData: Prisma.FieldDefinitionCreateWithoutContentTypeInput[] = fields.map((field) => ({
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
  }));
  const created = await prisma.contentType.create({
    data: {
      ...definition,
      listColumns: definition.listColumns ?? undefined,
      createdBy: user.id,
      updatedBy: user.id,
      fields: { create: fieldData },
    },
    include: { fields: { orderBy: { position: "asc" } } },
  });
  await createRevision("ContentType", created.id, created, user.id);
  await auditCmsAction({
    actorId: user.id,
    action: "CREATE",
    entityType: "ContentType",
    entityId: created.id,
    after: created,
  });
  return NextResponse.json(created, { status: 201 });
}
