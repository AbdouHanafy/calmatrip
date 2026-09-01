import { NextResponse } from "next/server";
import type { Prisma } from "@prisma/client";
import { auth } from "@/auth";
import type { Session } from "next-auth";
import { createNotification } from "@/lib/notifications";
import { sanitizeHtml } from "@/lib/sanitize";
import {
  deleteExploreListing,
  getOwnedExploreListingById,
  updateExploreListing,
} from "@/repositories/exploreListingRepository";

function requireAgency(session: Session | null) {
  return session?.user?.role === "B2B" && session.user.b2bType === "AGENCY";
}

// PATCH /api/b2b/explore/[id] — edit own listing; re-queues for review
export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!requireAgency(session)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const id = parseInt((await params).id);
  if (isNaN(id)) {
    return NextResponse.json({ error: "Invalid listing ID" }, { status: 400 });
  }

  const existing = await getOwnedExploreListingById(id, session!.user.id);
  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  try {
    const json = await req.json();
    const data: Prisma.ExploreListingUpdateInput = {
      submissionStatus: "pending",
      rejectionReason: null,
    };

    if (json.title !== undefined) data.title = json.title;
    if (json.description !== undefined) data.description = sanitizeHtml(json.description);
    if (json.category !== undefined) data.category = json.category;
    if (json.city !== undefined) data.city = json.city;
    if (json.address !== undefined) data.address = json.address;
    if (json.price !== undefined) data.price = json.price;
    if (json.budget !== undefined) data.budget = Number(json.budget);
    if (json.duration !== undefined) data.duration = json.duration;
    if (json.openingHours !== undefined) data.openingHours = json.openingHours;
    if (json.capacity !== undefined) {
      data.capacity = json.capacity !== null && json.capacity !== "" ? Number(json.capacity) : null;
    }
    if (json.image !== undefined) data.image = json.image;

    const listing = await updateExploreListing(id, data);

    await createNotification({
      recipient: "admin",
      type: "b2b_submission",
      title: "Annonce Explore modifiée à revalider",
      body: `${session!.user.name ?? "Une agence"} a modifié « ${listing.title} » sur Explore.`,
      link: "/admin/b2b-submissions",
    });

    return NextResponse.json(listing);
  } catch (error) {
    console.error("Failed to update listing:", error);
    return NextResponse.json({ error: "Failed to update listing" }, { status: 500 });
  }
}

// DELETE /api/b2b/explore/[id] — remove own listing
export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!requireAgency(session)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const id = parseInt((await params).id);
  if (isNaN(id)) {
    return NextResponse.json({ error: "Invalid listing ID" }, { status: 400 });
  }

  const existing = await getOwnedExploreListingById(id, session!.user.id);
  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await deleteExploreListing(id);
  return new NextResponse(null, { status: 204 });
}
