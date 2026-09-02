import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { mediaFolderSchema } from "@/features/cms/schemas/mediaSchemas";
import { auditCmsAction, requireCmsPermission } from "@/features/cms/services/server";
export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await requireCmsPermission("media.manage");
  if (!user) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const parsed = mediaFolderSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success)
    return NextResponse.json(
      { error: "Invalid folder", issues: parsed.error.flatten() },
      { status: 400 },
    );
  const id = (await params).id;
  const before = await prisma.cmsMediaFolder.findUnique({ where: { id } });
  if (!before) return NextResponse.json({ error: "Folder not found" }, { status: 404 });
  if (await prisma.cmsMediaFolder.findFirst({ where: { name: parsed.data.name, id: { not: id } } }))
    return NextResponse.json({ error: "Folder already exists" }, { status: 409 });
  const updated = await prisma.$transaction(async (tx) => {
    await tx.cmsMedia.updateMany({
      where: { folder: before.name },
      data: { folder: parsed.data.name },
    });
    return tx.cmsMediaFolder.update({ where: { id }, data: { name: parsed.data.name } });
  });
  await auditCmsAction({
    actorId: user.id,
    action: "RENAME",
    entityType: "CmsMediaFolder",
    entityId: id,
    before,
    after: updated,
  });
  return NextResponse.json(updated);
}
export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await requireCmsPermission("media.manage");
  if (!user) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const id = (await params).id;
  const before = await prisma.cmsMediaFolder.findUnique({ where: { id } });
  if (!before) return NextResponse.json({ error: "Folder not found" }, { status: 404 });
  if (await prisma.cmsMedia.count({ where: { folder: before.name } }))
    return NextResponse.json(
      { error: "Move media out of this folder before deleting it" },
      { status: 409 },
    );
  await prisma.cmsMediaFolder.delete({ where: { id } });
  await auditCmsAction({
    actorId: user.id,
    action: "DELETE",
    entityType: "CmsMediaFolder",
    entityId: id,
    before,
  });
  return new NextResponse(null, { status: 204 });
}
