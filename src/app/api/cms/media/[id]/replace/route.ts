import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { replaceMediaAsset, UploadValidationError } from "@/lib/mediaStorage";
import { auditCmsAction, requireCmsPermission } from "@/features/cms/services/server";
export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await requireCmsPermission("media.manage");
  if (!user) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const id = (await params).id;
  const before = await prisma.cmsMedia.findUnique({ where: { id } });
  if (!before) return NextResponse.json({ error: "Media not found" }, { status: 404 });
  if (!before.publicId)
    return NextResponse.json(
      { error: "Legacy media cannot be replaced in place" },
      { status: 409 },
    );
  const files = (await request.formData())
    .getAll("files")
    .filter((value): value is File => value instanceof File);
  if (files.length !== 1)
    return NextResponse.json({ error: "Upload exactly one replacement" }, { status: 400 });
  if (files[0].type !== before.mimeType)
    return NextResponse.json(
      { error: "Replacement must use the same media format to preserve references" },
      { status: 400 },
    );
  try {
    const asset = await replaceMediaAsset(before.publicId, files[0]);
    const updated = await prisma.cmsMedia.update({
      where: { id },
      data: {
        filename: asset.filename,
        url: asset.url,
        mimeType: asset.mimeType,
        size: asset.size,
        width: asset.width,
        height: asset.height,
      },
    });
    await auditCmsAction({
      actorId: user.id,
      action: "REPLACE",
      entityType: "CmsMedia",
      entityId: id,
      before,
      after: updated,
    });
    return NextResponse.json(updated);
  } catch (error) {
    if (error instanceof UploadValidationError)
      return NextResponse.json({ error: error.message }, { status: 400 });
    console.error("Media replacement failed:", error);
    return NextResponse.json(
      { error: "The media storage service is unavailable. Please try again shortly." },
      { status: 502 },
    );
  }
}
