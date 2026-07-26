import { NextResponse } from "next/server";
import { getActiveMuseums } from "@/repositories/museumRepository";

export async function GET() {
  try {
    const museums = await getActiveMuseums();
    return NextResponse.json(museums);
  } catch (error) {
    console.error("Failed to fetch museums:", error);
    return NextResponse.json({ error: "Failed to fetch museums" }, { status: 500 });
  }
}
