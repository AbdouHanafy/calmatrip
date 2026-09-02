import { Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { pageInputSchema } from "@/features/cms/schemas/cmsSchemas";
import {
  auditCmsAction,
  createRevision,
  publicationData,
  requireCmsPermission,
} from "@/features/cms/services/server";
import { preparePageBlocks } from "@/features/cms/services/pageBlocks";

type Context = { params: Promise<{ id: string }> };

export async function GET(_request: NextRequest, { params }: Context) {
  const user = await requireCmsPermission("cms.read");
  if (!user) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { id } = await params;
  const page = await prisma.cmsPage.findUnique({
    where: { id },
    include: { blocks: { orderBy: { position: "asc" } } },
  });
  if (!page) return NextResponse.json({ error: "Page not found" }, { status: 404 });
  return NextResponse.json(page);
}

export async function PATCH(request: NextRequest, { params }: Context) {
  const user = await requireCmsPermission("content.manage");
  if (!user) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const parsed = pageInputSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid page", issues: parsed.error.flatten() },
      { status: 400 },
    );
  }
  if (parsed.data.status === "PUBLISHED" && !(await requireCmsPermission("content.publish"))) {
    return NextResponse.json({ error: "Publishing permission required" }, { status: 403 });
  }

  const { id } = await params;
  const before = await prisma.cmsPage.findUnique({
    where: { id },
    include: { blocks: { orderBy: { position: "asc" } } },
  });
  if (!before) return NextResponse.json({ error: "Page not found" }, { status: 404 });

  const slugConflict = await prisma.cmsPage.findFirst({
    where: { slug: parsed.data.slug, locale: parsed.data.locale, id: { not: id } },
    select: { id: true },
  });
  if (slugConflict)
    return NextResponse.json(
      { error: "A page with this slug and language already exists" },
      { status: 409 },
    );
  const prepared = await preparePageBlocks(parsed.data.blocks, parsed.data.status === "PUBLISHED");
  if (!prepared.success)
    return NextResponse.json(
      { error: `Block ${prepared.block + 1} is invalid`, issues: prepared.issues },
      { status: 400 },
    );

  const updated = await prisma.$transaction(async (tx) => {
    await tx.cmsPageBlock.deleteMany({ where: { pageId: id } });
    return tx.cmsPage.update({
      where: { id },
      data: {
        title: parsed.data.title,
        slug: parsed.data.slug,
        locale: parsed.data.locale,
        status: parsed.data.status,
        seo: parsed.data.seo as Prisma.InputJsonValue | undefined,
        updatedBy: user.id,
        ...publicationData(parsed.data.status, user.id),
        blocks: { create: prepared.blocks },
      },
      include: { blocks: { orderBy: { position: "asc" } } },
    });
  });

  await createRevision("CmsPage", id, updated, user.id);
  await auditCmsAction({
    actorId: user.id,
    action: "UPDATE",
    entityType: "CmsPage",
    entityId: id,
    before,
    after: updated,
  });
  return NextResponse.json(updated);
}
