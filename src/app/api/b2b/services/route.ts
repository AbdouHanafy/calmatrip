import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import type { Session } from "next-auth";
import { sanitizeHtml } from "@/lib/sanitize";
import { createNotification } from "@/lib/notifications";
import { b2bServiceCreateSchema } from "@/schemas/service";
import { createService, getOwnedServices } from "@/repositories/serviceRepository";

function requireArtisan(session: Session | null) {
  return session?.user?.role === "B2B" && session.user.b2bType === "ARTISAN";
}

// GET /api/b2b/services — the artisan's own services, any submission status
export async function GET() {
  const session = await auth();
  if (!requireArtisan(session)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const services = await getOwnedServices(session!.user.id);
  return NextResponse.json({ services });
}

// POST /api/b2b/services — create a new service, always starts pending review
export async function POST(req: NextRequest) {
  const session = await auth();
  if (!requireArtisan(session)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const rawBody = await req.json();
    const parsed = b2bServiceCreateSchema.safeParse(rawBody);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
    }
    const { title, subtitle, description, price, category, duration, image } = parsed.data;

    const service = await createService({
      title,
      subtitle: subtitle ?? null,
      description: sanitizeHtml(description),
      price,
      category,
      duration: duration ?? null,
      image: image ?? null,
      active: true,
      ownerId: session!.user.id,
      submissionStatus: "pending",
    });

    await createNotification({
      recipient: "admin",
      type: "b2b_submission",
      title: "Nouveau service à valider",
      body: `${session!.user.name ?? "Un artisan"} a soumis le service « ${title} ».`,
      link: "/admin/b2b-submissions",
    });

    return NextResponse.json(service, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to create service" }, { status: 500 });
  }
}
