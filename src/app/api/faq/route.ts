import { NextResponse } from "next/server";
import { getPublicFaqs } from "@/repositories/faqRepository";

export async function GET() {
  try {
    const faqs = await getPublicFaqs();
    return NextResponse.json(faqs);
  } catch (error) {
    console.error("Failed to fetch FAQs:", error);
    return NextResponse.json({ error: "Failed to fetch FAQs" }, { status: 500 });
  }
}
