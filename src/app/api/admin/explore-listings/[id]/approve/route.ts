import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { createNotification } from "@/lib/notifications";
import { sendWhatsAppMessage } from "@/lib/whatsapp";
import { approveExploreListing } from "@/repositories/exploreListingRepository";

export async function PATCH(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const listing = await approveExploreListing(parseInt(id));

  if (listing.ownerId) {
    await prisma.user.updateMany({
      where: { id: listing.ownerId, b2bStatus: "pending" },
      data: { b2bStatus: "approved" },
    });
    await createNotification({
      recipient: "user",
      userId: listing.ownerId,
      type: "b2b_decision",
      title: "Annonce Explore approuvée",
      body: `Votre annonce « ${listing.title} » est maintenant visible sur Explore.`,
      link: "/b2b/explore",
    });

    const owner = await prisma.user.findUnique({
      where: { id: listing.ownerId },
      select: { phone: true },
    });
    if (owner?.phone) {
      await sendWhatsAppMessage(
        owner.phone,
        `Bonne nouvelle ! Votre annonce « ${listing.title} » vient d'être approuvée et est maintenant visible sur Calma Trip Explore.`,
      );
    }
  }

  return NextResponse.json(listing);
}
