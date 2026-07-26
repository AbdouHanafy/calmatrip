import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import type { Session } from "next-auth";
import { createNotification } from "@/lib/notifications";
import { sanitizeHtml } from "@/lib/sanitize";
import { createService, getOwnedServices } from "@/repositories/serviceRepository";

function requireAgency(session: Session | null) {
  return session?.user?.role === "B2B" && session.user.b2bType === "AGENCY";
}

// GET /api/b2b/services — the agency's own services, any submission status
export async function GET() {
  const session = await auth();
  if (!requireAgency(session)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const services = await getOwnedServices(session!.user.id);

  return NextResponse.json({ services });
}

// POST /api/b2b/services — create a new service, always starts pending review
export async function POST(req: NextRequest) {
  const session = await auth();
  if (!requireAgency(session)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const json = await req.json();
    if (!json.title || json.price === undefined || !json.category || !json.description) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const service = await createService({
      title: json.title,
      subtitle: json.subtitle,
      description: sanitizeHtml(json.description),
      price: json.price.toString(),
      category: json.category,
      duration: json.duration,
      icon: json.icon,
      color: json.color,
      image: json.image,
      active: true,
      popular: false,
      ownerId: session!.user.id,
      submissionStatus: "pending",
    });

    await createNotification({
      recipient: "admin",
      type: "b2b_submission",
      title: "Nouveau service à valider",
      body: `${session!.user.name ?? "Une agence"} a soumis le service « ${json.title} ».`,
      link: "/admin/b2b-submissions",
    });

    return NextResponse.json(service, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to create service" }, { status: 500 });
  }
}
