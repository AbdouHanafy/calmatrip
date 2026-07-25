import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { createNotification } from "@/lib/notifications";

export async function PATCH(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const service = await prisma.service.update({
    where: { id: parseInt(id) },
    data: { submissionStatus: "approved", rejectionReason: null },
  });

  if (service.ownerId) {
    await prisma.user.updateMany({
      where: { id: service.ownerId, b2bStatus: "pending" },
      data: { b2bStatus: "approved" },
    });
    await createNotification({
      recipient: "user",
      userId: service.ownerId,
      type: "b2b_decision",
      title: "Service approuvé",
      body: `Votre service « ${service.title} » est maintenant visible sur Explorer.`,
      link: "/b2b/services",
    });
  }

  return NextResponse.json(service);
}
