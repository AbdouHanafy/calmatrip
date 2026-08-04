import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { createNotification } from "@/lib/notifications";
import { sendWhatsAppMessage } from "@/lib/whatsapp";
import { rejectExploreListing } from "@/repositories/exploreListingRepository";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await req.json().catch(() => ({}));
  const reason = typeof body.reason === "string" ? body.reason.trim() : "";

  const listing = await rejectExploreListing(parseInt(id), reason || null);

  if (listing.ownerId) {
    await createNotification({
      recipient: "user",
      userId: listing.ownerId,
      type: "b2b_decision",
      title: "Annonce Explore refusée",
      body: reason
        ? `Votre annonce « ${listing.title} » n'a pas été approuvée : ${reason}`
        : `Votre annonce « ${listing.title} » n'a pas été approuvée.`,
      link: "/b2b/explore",
    });

    const owner = await prisma.user.findUnique({
      where: { id: listing.ownerId },
      select: { phone: true },
    });
    if (owner?.phone) {
      await sendWhatsAppMessage(
        owner.phone,
        reason
          ? `Votre annonce « ${listing.title} » n'a pas été approuvée : ${reason}`
          : `Votre annonce « ${listing.title} » n'a pas été approuvée.`,
      );
    }
  }

  return NextResponse.json(listing);
}
