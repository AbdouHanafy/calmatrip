import { Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { formInputSchema } from "@/features/cms/schemas/cmsSchemas";
import {
  auditCmsAction,
  createRevision,
  publicationData,
  requireCmsPermission,
} from "@/features/cms/services/server";

export async function GET() {
  const user = await requireCmsPermission("cms.read");
  if (!user) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  return NextResponse.json(
    await prisma.formDefinition.findMany({
      include: {
        steps: {
          include: { fields: { orderBy: { position: "asc" } } },
          orderBy: { position: "asc" },
        },
        _count: { select: { submissions: true } },
      },
      orderBy: { updatedAt: "desc" },
    }),
  );
}

export async function POST(request: NextRequest) {
  const user = await requireCmsPermission("forms.manage");
  if (!user) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const parsed = formInputSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success)
    return NextResponse.json(
      { error: "Invalid form", issues: parsed.error.flatten() },
      { status: 400 },
    );
  if (
    await prisma.formDefinition.findUnique({
      where: { slug: parsed.data.slug },
      select: { id: true },
    })
  )
    return NextResponse.json({ error: "A form with this slug already exists" }, { status: 409 });
  const value = parsed.data;
  const created = await prisma.formDefinition.create({
    data: {
      name: value.name,
      slug: value.slug,
      description: value.description as Prisma.InputJsonValue | undefined,
      status: value.status,
      settings: value.settings as Prisma.InputJsonValue | undefined,
      createdBy: user.id,
      updatedBy: user.id,
      ...publicationData(value.status, user.id),
      steps: {
        create: value.steps.map((step) => ({
          title: step.title as Prisma.InputJsonValue,
          description: step.description as Prisma.InputJsonValue | undefined,
          position: step.position,
          condition: step.condition as Prisma.InputJsonValue | undefined,
          fields: {
            create: step.fields.map((field) => ({
              ...field,
              label: field.label as Prisma.InputJsonValue,
              placeholder: field.placeholder as Prisma.InputJsonValue | undefined,
              helpText: field.helpText as Prisma.InputJsonValue | undefined,
              defaultValue: field.defaultValue as Prisma.InputJsonValue | undefined,
              validation: field.validation as Prisma.InputJsonValue | undefined,
              options: field.options as Prisma.InputJsonValue | undefined,
              condition: field.condition as Prisma.InputJsonValue | undefined,
            })),
          },
        })),
      },
    },
    include: { steps: { include: { fields: true } } },
  });
  await createRevision("FormDefinition", created.id, created, user.id);
  await auditCmsAction({
    actorId: user.id,
    action: "CREATE",
    entityType: "FormDefinition",
    entityId: created.id,
    after: created,
  });
  return NextResponse.json(created, { status: 201 });
}
