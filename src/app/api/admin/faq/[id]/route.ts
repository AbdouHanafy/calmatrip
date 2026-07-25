import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const faqId = parseInt(id);
  if (isNaN(faqId)) {
    return NextResponse.json({ error: "FAQ invalide" }, { status: 400 });
  }

  const body = await req.json().catch(() => ({}));
  const data: Record<string, unknown> = {};
  if (typeof body.question === "string") data.question = body.question.trim();
  if (typeof body.answer === "string") data.answer = body.answer.trim();
  if (typeof body.icon === "string" && body.icon.trim()) data.icon = body.icon.trim();
  if (typeof body.order === "number") data.order = body.order;

  const faq = await prisma.fAQ.update({ where: { id: faqId }, data });
  return NextResponse.json(faq);
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const faqId = parseInt(id);
  if (isNaN(faqId)) {
    return NextResponse.json({ error: "FAQ invalide" }, { status: 400 });
  }

  await prisma.fAQ.delete({ where: { id: faqId } });
  return new NextResponse(null, { status: 204 });
}
