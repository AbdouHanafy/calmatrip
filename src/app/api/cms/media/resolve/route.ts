import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireCmsPermission } from "@/features/cms/services/server";
const schema = z.object({ urls: z.array(z.string().url()).max(30) });
export async function POST(request: NextRequest) {
  if (!(await requireCmsPermission("cms.read")))
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid media URLs" }, { status: 400 });
  const found = await prisma.cmsMedia.findMany({ where: { url: { in: parsed.data.urls } } });
  const byUrl = new Map(found.map((item) => [item.url, item]));
  return NextResponse.json(
    parsed.data.urls.flatMap((url) => {
      const item = byUrl.get(url);
      return item ? [item] : [];
    }),
  );
}
