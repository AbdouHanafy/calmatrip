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

type Context = { params: Promise<{ id: string }> };
const include = {
  steps: {
    include: { fields: { orderBy: { position: "asc" as const } } },
    orderBy: { position: "asc" as const },
  },
  _count: { select: { submissions: true } },
};

export async function GET(_: NextRequest, { params }: Context) {
  if (!(await requireCmsPermission("cms.read")))
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const form = await prisma.formDefinition.findUnique({
    where: { id: (await params).id },
    include,
  });
  return form
    ? NextResponse.json(form)
    : NextResponse.json({ error: "Form not found" }, { status: 404 });
}

export async function PATCH(request: NextRequest, { params }: Context) {
  const user = await requireCmsPermission("forms.manage");
  if (!user) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const parsed = formInputSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success)
    return NextResponse.json(
      { error: "Invalid form", issues: parsed.error.flatten() },
      { status: 400 },
    );
  if (parsed.data.status === "PUBLISHED" && !(await requireCmsPermission("content.publish")))
    return NextResponse.json({ error: "Publishing permission required" }, { status: 403 });
  const id = (await params).id;
  const before = await prisma.formDefinition.findUnique({ where: { id }, include });
  if (!before) return NextResponse.json({ error: "Form not found" }, { status: 404 });
  const conflict = await prisma.formDefinition.findFirst({
    where: { slug: parsed.data.slug, id: { not: id } },
    select: { id: true },
  });
  if (conflict)
    return NextResponse.json({ error: "A form with this slug already exists" }, { status: 409 });
  const value = parsed.data;
  const updated = await prisma.$transaction(async (tx) => {
    await tx.formStep.deleteMany({ where: { formId: id } });
    return tx.formDefinition.update({
      where: { id },
      data: {
        name: value.name,
        slug: value.slug,
        description: value.description as Prisma.InputJsonValue | undefined,
        status: value.status,
        settings: value.settings as Prisma.InputJsonValue | undefined,
        updatedBy: user.id,
        ...publicationData(value.status, user.id),
        steps: {
          create: value.steps.map((step, stepIndex) => ({
            title: step.title as Prisma.InputJsonValue,
            description: step.description as Prisma.InputJsonValue | undefined,
            position: stepIndex,
            condition: step.condition as Prisma.InputJsonValue | undefined,
            fields: {
              create: step.fields.map((field, fieldIndex) => ({
                key: field.key,
                label: field.label as Prisma.InputJsonValue,
                type: field.type,
                required: field.required,
                position: fieldIndex,
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
      include,
    });
  });
  await createRevision("FormDefinition", id, updated, user.id);
  await auditCmsAction({
    actorId: user.id,
    action: "UPDATE",
    entityType: "FormDefinition",
    entityId: id,
    before,
    after: updated,
  });
  return NextResponse.json(updated);
}

export async function DELETE(_: NextRequest, { params }: Context) {
  const user = await requireCmsPermission("forms.manage");
  if (!user) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const id = (await params).id;
  const before = await prisma.formDefinition.findUnique({
    where: { id },
    include: { _count: { select: { submissions: true } } },
  });
  if (!before) return NextResponse.json({ error: "Form not found" }, { status: 404 });
  if (before._count.submissions)
    return NextResponse.json(
      { error: "Archive forms with submissions instead of deleting them" },
      { status: 409 },
    );
  await prisma.formDefinition.delete({ where: { id } });
  await auditCmsAction({
    actorId: user.id,
    action: "DELETE",
    entityType: "FormDefinition",
    entityId: id,
    before,
  });
  return new NextResponse(null, { status: 204 });
}
