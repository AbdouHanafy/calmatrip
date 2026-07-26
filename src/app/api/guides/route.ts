import { NextResponse } from "next/server";
import { getPublicGuides } from "@/repositories/guideRepository";

export async function GET() {
  try {
    const guides = await getPublicGuides();
    return NextResponse.json(guides);
  } catch (error) {
    console.error("Failed to fetch guides:", error);
    return NextResponse.json({ error: "Failed to fetch guides" }, { status: 500 });
  }
}
