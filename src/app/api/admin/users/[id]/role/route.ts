import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await req.json().catch(() => ({}));
  const role = body.role;

  const allowedRoles = ["USER", "ADMIN", "CONTENT_MANAGER", "EDITOR", "SUPPORT_AGENT"];
  if (!allowedRoles.includes(role)) {
    return NextResponse.json({ error: "Rôle invalide" }, { status: 400 });
  }

  if (id === session.user.id && !["ADMIN", "SUPER_ADMIN"].includes(role)) {
    return NextResponse.json(
      { error: "Vous ne pouvez pas retirer vos propres droits admin." },
      { status: 400 },
    );
  }

  const target = await prisma.user.findUnique({ where: { id }, select: { role: true } });
  if (!target) {
    return NextResponse.json({ error: "Utilisateur introuvable" }, { status: 404 });
  }

  const user = await prisma.user.update({
    where: { id },
    data: { role },
    select: { id: true, name: true, email: true, role: true, createdAt: true, image: true },
  });

  return NextResponse.json(user);
}
