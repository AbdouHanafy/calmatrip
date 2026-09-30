import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { destinationUpdateSchema } from "@/schemas/destination";
import { deleteDestination, updateDestination } from "@/repositories/destinationRepository";

type Params = { params: Promise<{ id: string }> };

export async function PUT(req: NextRequest, { params }: Params) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const id = parseInt((await params).id);
  if (isNaN(id)) {
    return NextResponse.json({ error: "Destination invalide" }, { status: 400 });
  }

  const parsed = destinationUpdateSchema.safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
  }

  const destination = await updateDestination(id, parsed.data);
  return NextResponse.json(destination);
}

// Deleting only unlinks services (the join rows cascade); the services themselves stay.
export async function DELETE(_req: NextRequest, { params }: Params) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const id = parseInt((await params).id);
  if (isNaN(id)) {
    return NextResponse.json({ error: "Destination invalide" }, { status: 400 });
  }

  await deleteDestination(id);
  return new NextResponse(null, { status: 204 });
}
