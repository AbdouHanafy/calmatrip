import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const subscriberId = parseInt(id);
  if (isNaN(subscriberId)) {
    return NextResponse.json({ error: "Invalide" }, { status: 400 });
  }

  await prisma.newsletterSubscriber.delete({ where: { id: subscriberId } });
  return new NextResponse(null, { status: 204 });
}
