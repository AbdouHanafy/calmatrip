import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import type { Session } from "next-auth";
import { createNotification } from "@/lib/notifications";

function requireAgency(session: Session | null) {
  return session?.user?.role === "B2B" && session.user.b2bType === "AGENCY";
}

// GET /api/b2b/services — the agency's own services, any submission status
export async function GET() {
  const session = await auth();
  if (!requireAgency(session)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const services = await prisma.service.findMany({
    where: { ownerId: session!.user.id },
    orderBy: { createdAt: "desc" },
  });

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

    const maxOrder = await prisma.service.aggregate({ _max: { order: true } });

    const service = await prisma.service.create({
      data: {
        title: json.title,
        subtitle: json.subtitle ?? null,
        description: json.description,
        price: json.price.toString(),
        category: json.category,
        duration: json.duration ?? null,
        icon: json.icon ?? "Car",
        color: json.color ?? null,
        image: json.image ?? null,
        active: true,
        popular: false,
        order: (maxOrder._max.order ?? 0) + 1,
        ownerId: session!.user.id,
        submissionStatus: "pending",
      },
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
