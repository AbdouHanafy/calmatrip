import { NextResponse } from "next/server";
import { getActiveEvents } from "@/repositories/eventRepository";

export async function GET() {
  try {
    const events = await getActiveEvents();
    return NextResponse.json(events);
  } catch (error) {
    console.error("Failed to fetch events:", error);
    return NextResponse.json({ error: "Failed to fetch events" }, { status: 500 });
  }
}
