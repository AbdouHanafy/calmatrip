import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireCmsPermission } from "@/features/cms/services/server";

export async function GET(request: NextRequest) {
  const user = await requireCmsPermission("forms.submissions.read");
  if (!user) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const status = request.nextUrl.searchParams.get("status") ?? undefined;
  const form = request.nextUrl.searchParams.get("form") ?? undefined;
  const search = request.nextUrl.searchParams.get("search")?.trim();
  const page = Math.max(1, Number(request.nextUrl.searchParams.get("page")) || 1);
  const take = Math.min(100, Math.max(1, Number(request.nextUrl.searchParams.get("limit")) || 25));
  const allowed = new Set([
    "DRAFT",
    "NEW",
    "IN_PROGRESS",
    "WAITING",
    "RESOLVED",
    "REJECTED",
    "ARCHIVED",
  ]);
  const where = {
    ...(status && allowed.has(status) ? { status } : {}),
    ...(form ? { form: { slug: form } } : {}),
    ...(search
      ? {
          OR: [
            { id: { contains: search } },
            { assignedTo: { contains: search } },
            { form: { name: { contains: search } } },
          ],
        }
      : {}),
  };
  const [items, total] = await prisma.$transaction([
    prisma.formSubmission.findMany({
      where,
      include: { form: { select: { name: true, slug: true } } },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * take,
      take,
    }),
    prisma.formSubmission.count({ where }),
  ]);
  return NextResponse.json({ items, total, page, pages: Math.ceil(total / take) });
}
