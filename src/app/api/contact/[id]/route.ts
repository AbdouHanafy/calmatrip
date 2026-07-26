import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { deleteContact, updateContactReadStatus } from "@/repositories/contactRepository";

export const dynamic = "force-dynamic";

// PATCH /api/contact/[id]  (admin: marquer comme lu/non lu)
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const id = parseInt((await params).id);
    if (isNaN(id)) {
      return NextResponse.json({ error: "Identifiant invalide" }, { status: 400 });
    }

    const body = await req.json();
    const { isRead } = body;

    if (typeof isRead !== "boolean") {
      return NextResponse.json({ error: "isRead doit être un booléen" }, { status: 400 });
    }

    const contact = await updateContactReadStatus(id, isRead);

    return NextResponse.json(contact);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Échec de la mise à jour" }, { status: 500 });
  }
}

// DELETE /api/contact/[id]  (admin: supprimer un message)
export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const id = parseInt((await params).id, 10);
    if (isNaN(id)) {
      return NextResponse.json({ error: "Identifiant invalide" }, { status: 400 });
    }

    await deleteContact(id);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Échec de la suppression" }, { status: 500 });
  }
}
