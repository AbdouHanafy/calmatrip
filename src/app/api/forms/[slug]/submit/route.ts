import { Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { evaluateCondition, validateDynamicData } from "@/features/cms/services/validation";
import type { FieldDefinitionInput, SafeCondition } from "@/features/cms/types";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const form = await prisma.formDefinition.findFirst({
    where: { slug, status: "PUBLISHED" },
    include: { steps: { include: { fields: true }, orderBy: { position: "asc" } } },
  });
  if (!form) return NextResponse.json({ error: "Published form not found" }, { status: 404 });
  const body = (await request.json().catch(() => null)) as {
    data?: Record<string, unknown>;
    locale?: string;
    draft?: boolean;
  } | null;
  if (!body?.data || typeof body.data !== "object")
    return NextResponse.json({ error: "Submission data is required" }, { status: 400 });
  const visibleSteps = form.steps.filter(
    (step) => !step.condition || evaluateCondition(step.condition as SafeCondition, body.data!),
  );
  const visibleFields = visibleSteps
    .flatMap((step) => step.fields)
    .filter(
      (field) =>
        !field.condition || evaluateCondition(field.condition as SafeCondition, body.data!),
    );
  const definitions: FieldDefinitionInput[] = visibleFields.map((field) => ({
    key: field.key,
    label: (field.label as Record<string, string>).fr ?? field.key,
    type: field.type as FieldDefinitionInput["type"],
    required: body.draft ? false : field.required,
    defaultValue: field.defaultValue ?? undefined,
    validation: field.validation as FieldDefinitionInput["validation"],
    options: field.options as FieldDefinitionInput["options"],
  }));
  const validation = validateDynamicData(definitions, body.data);
  if (!validation.success)
    return NextResponse.json(
      { error: "Field validation failed", fields: validation.errors },
      { status: 400 },
    );
  const session = await auth();
  const draftToken = body.draft ? crypto.randomUUID() : undefined;
  const created = await prisma.formSubmission.create({
    data: {
      formId: form.id,
      status: body.draft ? "DRAFT" : "NEW",
      locale: ["fr", "en", "ar"].includes(body.locale ?? "") ? body.locale! : "fr",
      data: validation.data as Prisma.InputJsonValue,
      submitterId: session?.user?.id,
      draftToken,
      submittedAt: body.draft ? null : new Date(),
    },
  });
  return NextResponse.json({ id: created.id, status: created.status, draftToken }, { status: 201 });
}
