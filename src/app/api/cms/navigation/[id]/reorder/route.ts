import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { navigationOrderSchema } from "@/features/cms/schemas/navigationSchemas";
import { requireCmsPermission } from "@/features/cms/services/server";
import { recordNavigationChange } from "@/features/cms/services/navigationMutation";
import { validateNavigationOrder } from "@/features/cms/services/navigation";

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await requireCmsPermission("navigation.manage");
  if (!user) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const parsed = navigationOrderSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success)
    return NextResponse.json(
      { error: "Invalid tree", issues: parsed.error.flatten() },
      { status: 400 },
    );
  const navigationId = (await params).id;
  const current = await prisma.cmsNavigationItem.findMany({
    where: { navigationId },
    select: { id: true },
  });
  const error = validateNavigationOrder(
    current.map((item) => item.id),
    parsed.data.items,
  );
  if (error) return NextResponse.json({ error }, { status: 400 });
  await prisma.$transaction(
    parsed.data.items.map((item) =>
      prisma.cmsNavigationItem.update({
        where: { id: item.id },
        data: { parentId: item.parentId, position: item.position },
      }),
    ),
  );
  await recordNavigationChange({
    actorId: user.id,
    action: "REORDER",
    navigationId,
    metadata: { tree: parsed.data.items },
  });
  return NextResponse.json(await prisma.cmsNavigationItem.findMany({ where: { navigationId } }));
}
