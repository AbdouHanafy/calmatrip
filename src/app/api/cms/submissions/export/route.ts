import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireCmsPermission } from "@/features/cms/services/server";
const csv = (value: unknown) => `"${String(value ?? "").replaceAll('"', '""')}"`;
export async function GET(request: NextRequest) {
  if (!(await requireCmsPermission("forms.submissions.read")))
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const form = request.nextUrl.searchParams.get("form") ?? undefined;
  const status = request.nextUrl.searchParams.get("status") ?? undefined;
  const items = await prisma.formSubmission.findMany({
    where: { ...(form ? { form: { slug: form } } : {}), ...(status ? { status } : {}) },
    include: { form: { select: { name: true } } },
    orderBy: { createdAt: "desc" },
    take: 10_000,
  });
  const body = [
    "ID,Form,Status,Locale,Assigned,Submitted,Data",
    ...items.map((item) =>
      [
        item.id,
        item.form.name,
        item.status,
        item.locale,
        item.assignedTo,
        item.submittedAt?.toISOString(),
        JSON.stringify(item.data),
      ]
        .map(csv)
        .join(","),
    ),
  ].join("\n");
  return new NextResponse(body, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="submissions-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  });
}
