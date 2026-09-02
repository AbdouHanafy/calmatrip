import { Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { auditCmsAction, requireCmsPermission } from "@/features/cms/services/server";

const updateSchema = z
  .object({
    status: z
      .enum(["NEW", "IN_PROGRESS", "WAITING", "RESOLVED", "REJECTED", "ARCHIVED"])
      .optional(),
    assignedTo: z.string().trim().max(120).nullable().optional(),
    note: z.string().trim().min(1).max(5_000).optional(),
  })
  .refine(
    (value) =>
      value.status !== undefined || value.assignedTo !== undefined || value.note !== undefined,
    "No changes supplied",
  );
export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await requireCmsPermission("forms.submissions.read")))
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const id = (await params).id;
  const [item, history] = await Promise.all([
    prisma.formSubmission.findUnique({
      where: { id },
      include: {
        form: {
          include: {
            steps: {
              include: { fields: { orderBy: { position: "asc" } } },
              orderBy: { position: "asc" },
            },
          },
        },
      },
    }),
    prisma.cmsAuditLog.findMany({
      where: { entityType: "FormSubmission", entityId: id },
      orderBy: { createdAt: "desc" },
      take: 100,
    }),
  ]);
  return item
    ? NextResponse.json({ ...item, history })
    : NextResponse.json({ error: "Submission not found" }, { status: 404 });
}
export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await requireCmsPermission("forms.submissions.manage");
  if (!user) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const parsed = updateSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success)
    return NextResponse.json(
      { error: "Invalid update", issues: parsed.error.flatten() },
      { status: 400 },
    );
  const id = (await params).id;
  const before = await prisma.formSubmission.findUnique({ where: { id } });
  if (!before) return NextResponse.json({ error: "Submission not found" }, { status: 404 });
  const notes = Array.isArray(before.notes) ? (before.notes as Array<Record<string, unknown>>) : [];
  const nextNotes = parsed.data.note
    ? [
        ...notes,
        {
          id: crypto.randomUUID(),
          text: parsed.data.note,
          actorId: user.id,
          createdAt: new Date().toISOString(),
        },
      ]
    : notes;
  const updated = await prisma.formSubmission.update({
    where: { id },
    data: {
      status: parsed.data.status,
      assignedTo: parsed.data.assignedTo,
      notes: nextNotes as Prisma.InputJsonValue,
    },
  });
  await auditCmsAction({
    actorId: user.id,
    action: "UPDATE",
    entityType: "FormSubmission",
    entityId: id,
    before,
    after: updated,
  });
  return NextResponse.json(updated);
}
