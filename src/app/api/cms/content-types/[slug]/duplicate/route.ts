import { Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import {
  auditCmsAction,
  createRevision,
  requireCmsPermission,
} from "@/features/cms/services/server";

const duplicateSchema = z.object({
  name: z.string().trim().min(2).max(120),
  slug: z
    .string()
    .trim()
    .min(1)
    .max(160)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
});

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const user = await requireCmsPermission("content.manage");
  if (!user) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const parsed = duplicateSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success)
    return NextResponse.json(
      { error: "Invalid duplicate", issues: parsed.error.flatten() },
      { status: 400 },
    );

  const source = await prisma.contentType.findUnique({
    where: { slug: (await params).slug },
    include: { fields: { orderBy: { position: "asc" } } },
  });
  if (!source) return NextResponse.json({ error: "Content type not found" }, { status: 404 });
  if (
    await prisma.contentType.findUnique({ where: { slug: parsed.data.slug }, select: { id: true } })
  ) {
    return NextResponse.json(
      { error: "A collection with this slug already exists" },
      { status: 409 },
    );
  }

  const created = await prisma.contentType.create({
    data: {
      name: parsed.data.name,
      slug: parsed.data.slug,
      description: source.description,
      icon: source.icon,
      listColumns: source.listColumns as Prisma.InputJsonValue | undefined,
      defaultSort: source.defaultSort as Prisma.InputJsonValue | undefined,
      publishingEnabled: source.publishingEnabled,
      localized: source.localized,
      active: false,
      createdBy: user.id,
      updatedBy: user.id,
      fields: {
        create: source.fields.map((field) => ({
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
          relation: field.relation
            ? ({
                ...(field.relation as { contentType: string; multiple?: boolean }),
                contentType:
                  (field.relation as { contentType: string }).contentType === source.slug
                    ? parsed.data.slug
                    : (field.relation as { contentType: string }).contentType,
              } as Prisma.InputJsonValue)
            : undefined,
        })),
      },
    },
    include: { fields: { orderBy: { position: "asc" } } },
  });
  await createRevision("ContentType", created.id, created, user.id);
  await auditCmsAction({
    actorId: user.id,
    action: "DUPLICATE",
    entityType: "ContentType",
    entityId: created.id,
    after: created,
    metadata: { sourceId: source.id },
  });
  return NextResponse.json(created, { status: 201 });
}
