import { NextRequest, NextResponse } from "next/server";
import type { Prisma } from "@prisma/client";
import { auth } from "@/auth";
import { deleteFaq, updateFaq } from "@/repositories/faqRepository";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
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
  const data: Prisma.FAQUpdateInput = {};
  if (typeof body.question === "string") data.question = body.question.trim();
  if (typeof body.answer === "string") data.answer = body.answer.trim();
  if (typeof body.icon === "string" && body.icon.trim()) data.icon = body.icon.trim();
  if (typeof body.order === "number") data.order = body.order;

  const faq = await updateFaq(faqId, data);
  return NextResponse.json(faq);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const faqId = parseInt(id);
  if (isNaN(faqId)) {
    return NextResponse.json({ error: "FAQ invalide" }, { status: 400 });
  }

  await deleteFaq(faqId);
  return new NextResponse(null, { status: 204 });
}
