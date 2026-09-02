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

export async function GET() {
  const user = await requireCmsPermission("cms.read");
  if (!user) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  return NextResponse.json(
    await prisma.cmsPage.findMany({
      include: { blocks: { orderBy: { position: "asc" } } },
      orderBy: { updatedAt: "desc" },
    }),
  );
}

export async function POST(request: NextRequest) {
  const user = await requireCmsPermission("content.manage");
  if (!user) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const parsed = pageInputSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success)
    return NextResponse.json(
      { error: "Invalid page", issues: parsed.error.flatten() },
      { status: 400 },
    );
  if (parsed.data.status === "PUBLISHED" && !(await requireCmsPermission("content.publish")))
    return NextResponse.json({ error: "Publishing permission required" }, { status: 403 });
  if (
    await prisma.cmsPage.findFirst({
      where: { slug: parsed.data.slug, locale: parsed.data.locale },
      select: { id: true },
    })
  )
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
  const created = await prisma.cmsPage.create({
    data: {
      title: parsed.data.title,
      slug: parsed.data.slug,
      locale: parsed.data.locale,
      status: parsed.data.status,
      seo: parsed.data.seo as Prisma.InputJsonValue | undefined,
      createdBy: user.id,
      updatedBy: user.id,
      ...publicationData(parsed.data.status, user.id),
      blocks: { create: prepared.blocks },
    },
    include: { blocks: { orderBy: { position: "asc" } } },
  });
  await createRevision("CmsPage", created.id, created, user.id);
  await auditCmsAction({
    actorId: user.id,
    action: "CREATE",
    entityType: "CmsPage",
    entityId: created.id,
    after: created,
  });
  return NextResponse.json(created, { status: 201 });
}
