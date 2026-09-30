import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { destinationSchema } from "@/schemas/destination";
import { createDestination, getAllDestinations } from "@/repositories/destinationRepository";

export async function GET() {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.json(await getAllDestinations());
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const parsed = destinationSchema.safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
  }

  const destination = await createDestination(parsed.data);
  return NextResponse.json(destination, { status: 201 });
}
