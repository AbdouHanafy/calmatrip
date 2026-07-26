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
  const commissionRate = Number(body.commissionRate);

  if (isNaN(commissionRate) || commissionRate < 0 || commissionRate > 100) {
    return NextResponse.json(
      { error: "Le taux doit être compris entre 0 et 100." },
      { status: 400 },
    );
  }

  const target = await prisma.user.findUnique({ where: { id }, select: { role: true } });
  if (!target || target.role !== "B2B") {
    return NextResponse.json({ error: "Partenaire introuvable" }, { status: 404 });
  }

  const user = await prisma.user.update({
    where: { id },
    data: { commissionRate },
    select: {
      id: true,
      name: true,
      email: true,
      b2bType: true,
      b2bStatus: true,
      commissionRate: true,
      createdAt: true,
    },
  });

  return NextResponse.json(user);
}
