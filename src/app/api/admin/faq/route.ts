import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function GET() {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const faqs = await prisma.fAQ.findMany({ orderBy: { order: "asc" } });
  return NextResponse.json(faqs);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  const question = typeof body.question === "string" ? body.question.trim() : "";
  const answer = typeof body.answer === "string" ? body.answer.trim() : "";
  const icon = typeof body.icon === "string" && body.icon.trim() ? body.icon.trim() : "HelpCircle";

  if (!question || !answer) {
    return NextResponse.json({ error: "Question et réponse requises" }, { status: 400 });
  }

  const maxOrder = await prisma.fAQ.aggregate({ _max: { order: true } });

  const faq = await prisma.fAQ.create({
    data: {
      question,
      answer,
      icon,
      order: (maxOrder._max.order ?? 0) + 1,
    },
  });

  return NextResponse.json(faq, { status: 201 });
}
