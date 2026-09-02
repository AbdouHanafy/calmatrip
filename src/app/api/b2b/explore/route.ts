import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import type { Session } from "next-auth";
import { isApprovedPartner } from "@/lib/access";
import { createNotification } from "@/lib/notifications";
import { sanitizeHtml } from "@/lib/sanitize";
import {
  createExploreListing,
  getOwnedExploreListings,
} from "@/repositories/exploreListingRepository";

function requireAgency(session: Session | null) {
  return isApprovedPartner(session, "AGENCY");
}

// GET /api/b2b/explore — the agency's own Explore listings, any submission status
export async function GET() {
  const session = await auth();
  if (!requireAgency(session)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const listings = await getOwnedExploreListings(session!.user.id);

  return NextResponse.json({ listings });
}

// POST /api/b2b/explore — create a new Explore listing, always starts pending review
export async function POST(req: NextRequest) {
  const session = await auth();
  if (!requireAgency(session)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const json = await req.json();
    if (!json.title || !json.category || !json.city || !json.description) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const listing = await createExploreListing({
      title: json.title,
      description: sanitizeHtml(json.description),
      category: json.category,
      city: json.city,
      address: json.address,
      price: json.price,
      budget: json.budget !== undefined ? Number(json.budget) : undefined,
      duration: json.duration,
      openingHours: json.openingHours,
      capacity:
        json.capacity !== undefined && json.capacity !== null && json.capacity !== ""
          ? Number(json.capacity)
          : null,
      image: json.image,
      ownerId: session!.user.id,
      submissionStatus: "pending",
    });

    await createNotification({
      recipient: "admin",
      type: "b2b_submission",
      title: "Nouvelle annonce Explore à valider",
      body: `${session!.user.name ?? "Une agence"} a soumis « ${json.title} » sur Explore.`,
      link: "/admin/b2b-submissions",
    });

    return NextResponse.json(listing, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to create listing" }, { status: 500 });
  }
}
