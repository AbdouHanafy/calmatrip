import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { createFaq, getAllFaqs } from "@/repositories/faqRepository";

export async function GET() {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const faqs = await getAllFaqs();
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

  const faq = await createFaq({ question, answer, icon });

  return NextResponse.json(faq, { status: 201 });
}
