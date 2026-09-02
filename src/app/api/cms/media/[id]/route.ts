import { Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { mediaMetadataSchema } from "@/features/cms/schemas/mediaSchemas";
import { findMediaUsages } from "@/features/cms/services/mediaUsage";
import { auditCmsAction, requireCmsPermission } from "@/features/cms/services/server";
import { deleteMediaAsset } from "@/lib/cloudinaryUpload";

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await requireCmsPermission("cms.read")))
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const item = await prisma.cmsMedia.findUnique({ where: { id: (await params).id } });
  if (!item) return NextResponse.json({ error: "Media not found" }, { status: 404 });
  return NextResponse.json({ ...item, usages: await findMediaUsages(item.url) });
}
export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await requireCmsPermission("media.manage");
  if (!user) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const parsed = mediaMetadataSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success)
    return NextResponse.json(
      { error: "Invalid metadata", issues: parsed.error.flatten() },
      { status: 400 },
    );
  const id = (await params).id;
  const before = await prisma.cmsMedia.findUnique({ where: { id } });
  if (!before) return NextResponse.json({ error: "Media not found" }, { status: 404 });
  if (
    parsed.data.folder &&
    !(await prisma.cmsMediaFolder.findUnique({ where: { name: parsed.data.folder } }))
  )
    return NextResponse.json({ error: "Folder not found" }, { status: 400 });
  const updated = await prisma.cmsMedia.update({
    where: { id },
    data: {
      title: parsed.data.title,
      alt:
        parsed.data.alt === null
          ? Prisma.DbNull
          : (parsed.data.alt as Prisma.InputJsonValue | undefined),
      caption:
        parsed.data.caption === null
          ? Prisma.DbNull
          : (parsed.data.caption as Prisma.InputJsonValue | undefined),
      description:
        parsed.data.description === null
          ? Prisma.DbNull
          : (parsed.data.description as Prisma.InputJsonValue | undefined),
      folder: parsed.data.folder,
    },
  });
  await auditCmsAction({
    actorId: user.id,
    action: before.folder !== updated.folder ? "MOVE" : "UPDATE",
    entityType: "CmsMedia",
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
  const before = await prisma.cmsMedia.findUnique({ where: { id } });
  if (!before) return NextResponse.json({ error: "Media not found" }, { status: 404 });
  const usages = await findMediaUsages(before.url);
  if (usages.length)
    return NextResponse.json({ error: "This media is still in use", usages }, { status: 409 });
  if (!before.publicId)
    return NextResponse.json(
      { error: "This legacy media has no verified storage key and cannot be safely deleted" },
      { status: 409 },
    );
  await prisma.cmsMedia.delete({ where: { id } });
  try {
    await deleteMediaAsset(before.publicId);
  } catch (error) {
    await prisma.cmsMedia.create({
      data: {
        id: before.id,
        filename: before.filename,
        publicId: before.publicId,
        url: before.url,
        mimeType: before.mimeType,
        size: before.size,
        width: before.width,
        height: before.height,
        title: before.title,
        alt: before.alt === null ? Prisma.DbNull : (before.alt as Prisma.InputJsonValue),
        caption:
          before.caption === null ? Prisma.DbNull : (before.caption as Prisma.InputJsonValue),
        description:
          before.description === null
            ? Prisma.DbNull
            : (before.description as Prisma.InputJsonValue),
        folder: before.folder,
        createdBy: before.createdBy,
        createdAt: before.createdAt,
        updatedAt: before.updatedAt,
      },
    });
    return NextResponse.json(
      { error: "Storage deletion failed; the database record was restored" },
      { status: 502 },
    );
  }
  await auditCmsAction({
    actorId: user.id,
    action: "DELETE",
    entityType: "CmsMedia",
    entityId: id,
    before,
  });
  return new NextResponse(null, { status: 204 });
}
