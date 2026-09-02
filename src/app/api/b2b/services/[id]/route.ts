import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import type { Session } from "next-auth";
import { isApprovedPartner } from "@/lib/access";
import { sanitizeHtml } from "@/lib/sanitize";
import { createNotification } from "@/lib/notifications";
import { b2bServiceUpdateSchema } from "@/schemas/service";
import {
  deleteService,
  getOwnedServiceById,
  updateService,
} from "@/repositories/serviceRepository";

function requireArtisan(session: Session | null) {
  return isApprovedPartner(session, "ARTISAN");
}

// PATCH /api/b2b/services/[id] — edit own service; re-queues for review
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!requireArtisan(session)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const existing = await getOwnedServiceById(parseInt(id), session!.user.id);
  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  try {
    const rawBody = await req.json();
    const parsed = b2bServiceUpdateSchema.safeParse(rawBody);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
    }
    const { title, subtitle, description, price, category, duration, image } = parsed.data;

    const service = await updateService(parseInt(id), {
      ...(title !== undefined && { title }),
      ...(subtitle !== undefined && { subtitle }),
      ...(description !== undefined && { description: sanitizeHtml(description) }),
      ...(price !== undefined && { price }),
      ...(category !== undefined && { category }),
      ...(duration !== undefined && { duration }),
      ...(image !== undefined && { image }),
      submissionStatus: "pending",
      rejectionReason: null,
    });

    await createNotification({
      recipient: "admin",
      type: "b2b_submission",
      title: "Service modifié à revalider",
      body: `${session!.user.name ?? "Un artisan"} a modifié le service « ${service.title} ».`,
      link: "/admin/b2b-submissions",
    });

    return NextResponse.json(service);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to update service" }, { status: 500 });
  }
}

// DELETE /api/b2b/services/[id] — remove own service
export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!requireArtisan(session)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const existing = await getOwnedServiceById(parseInt(id), session!.user.id);
  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await deleteService(parseInt(id));
  return NextResponse.json({ success: true });
}
