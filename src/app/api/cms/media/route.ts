import { Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { deleteMediaAsset, uploadMediaAssets, UploadValidationError } from "@/lib/cloudinaryUpload";
import { auditCmsAction, requireCmsPermission } from "@/features/cms/services/server";

export async function GET(request: NextRequest) {
  if (!(await requireCmsPermission("cms.read")))
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const query = request.nextUrl.searchParams;
  const search = query.get("search")?.trim();
  const folder = query.get("folder");
  const page = Math.max(1, Number(query.get("page")) || 1);
  const take = Math.min(100, Math.max(1, Number(query.get("limit")) || 24));
  const sorts = {
    newest: { createdAt: "desc" },
    oldest: { createdAt: "asc" },
    nameAsc: { filename: "asc" },
    nameDesc: { filename: "desc" },
    largest: { size: "desc" },
    smallest: { size: "asc" },
  } as const;
  const orderBy = sorts[query.get("sort") as keyof typeof sorts] ?? sorts.newest;
  const localizedSearch = search
    ? ["fr", "en", "ar"].flatMap((locale) => [
        { alt: { path: `$.${locale}`, string_contains: search } },
        { caption: { path: `$.${locale}`, string_contains: search } },
        { description: { path: `$.${locale}`, string_contains: search } },
      ])
    : [];
  const where: Prisma.CmsMediaWhereInput = {
    ...(folder === "ROOT" ? { folder: null } : folder ? { folder } : {}),
    ...(search
      ? {
          OR: [
            { filename: { contains: search } },
            { title: { contains: search } },
            ...localizedSearch,
          ],
        }
      : {}),
  };
  const [items, total, folders] = await prisma.$transaction([
    prisma.cmsMedia.findMany({ where, orderBy, skip: (page - 1) * take, take }),
    prisma.cmsMedia.count({ where }),
    prisma.cmsMediaFolder.findMany({ orderBy: { name: "asc" } }),
  ]);
  return NextResponse.json({ items, total, page, pages: Math.ceil(total / take), folders });
}

export async function POST(request: NextRequest) {
  const user = await requireCmsPermission("media.manage");
  if (!user) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const formData = await request.formData();
  const files = formData.getAll("files").filter((value): value is File => value instanceof File);
  const folderValue = formData.get("folder");
  const folder = typeof folderValue === "string" && folderValue.trim() ? folderValue.trim() : null;
  if (folder && !(await prisma.cmsMediaFolder.findUnique({ where: { name: folder } })))
    return NextResponse.json({ error: "Folder not found" }, { status: 400 });
  let uploaded: Awaited<ReturnType<typeof uploadMediaAssets>> = [];
  try {
    uploaded = await uploadMediaAssets(files);
    const created = await prisma.$transaction(
      uploaded.map((asset) =>
        prisma.cmsMedia.create({
          data: {
            filename: asset.filename,
            publicId: asset.publicId,
            url: asset.url,
            mimeType: asset.mimeType,
            size: asset.size,
            width: asset.width,
            height: asset.height,
            folder,
            createdBy: user.id,
          },
        }),
      ),
    );
    await Promise.all(
      created.map((item) =>
        auditCmsAction({
          actorId: user.id,
          action: "UPLOAD",
          entityType: "CmsMedia",
          entityId: item.id,
          after: item,
        }),
      ),
    );
    return NextResponse.json({ items: created }, { status: 201 });
  } catch (error) {
    if (uploaded.length)
      await Promise.allSettled(uploaded.map((asset) => deleteMediaAsset(asset.publicId)));
    if (error instanceof UploadValidationError)
      return NextResponse.json({ error: error.message }, { status: 400 });
    throw error;
  }
}
