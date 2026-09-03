import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { navigationInputSchema } from "@/features/cms/schemas/navigationSchemas";
import { requireCmsPermission } from "@/features/cms/services/server";
import { recordNavigationChange } from "@/features/cms/services/navigationMutation";

export async function GET() {
  if (!(await requireCmsPermission("cms.read")))
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  return NextResponse.json(
    await prisma.cmsNavigation.findMany({
      include: { _count: { select: { items: true } } },
      orderBy: { updatedAt: "desc" },
    }),
  );
}

export async function POST(request: NextRequest) {
  const user = await requireCmsPermission("navigation.manage");
  if (!user) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const parsed = navigationInputSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success)
    return NextResponse.json(
      { error: "Invalid navigation", issues: parsed.error.flatten() },
      { status: 400 },
    );
  if (await prisma.cmsNavigation.findUnique({ where: { key: parsed.data.key } }))
    return NextResponse.json(
      { error: "A navigation with this key already exists" },
      { status: 409 },
    );
  const created = await prisma.cmsNavigation.create({
    data: {
      ...parsed.data,
      createdBy: user.id,
      updatedBy: user.id,
      publishedAt: parsed.data.status === "PUBLISHED" ? new Date() : null,
    },
  });
  await recordNavigationChange({ actorId: user.id, action: "CREATE", navigationId: created.id });
  return NextResponse.json(created, { status: 201 });
}
