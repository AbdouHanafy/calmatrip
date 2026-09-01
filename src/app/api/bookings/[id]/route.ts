import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

// GET /api/bookings/[id]
export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    const { id } = await params;
    const booking = await prisma.booking.findUnique({
      where: { id: parseInt(id) },
    });
    if (!booking) return NextResponse.json({ error: "Booking not found" }, { status: 404 });

    const isOwner = session?.user?.email?.toLowerCase() === booking.customerEmail?.toLowerCase();
    const isAdmin = session?.user?.role === "ADMIN";
    if (!isOwner && !isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json(booking);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to fetch booking" }, { status: 500 });
  }
}

// PUT /api/bookings/[id]  (admin: update status, driver, vehicle)
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = await req.json();
    const booking = await prisma.booking.update({
      where: { id: parseInt(id) },
      data: {
        ...(body.status !== undefined && { status: body.status }),
        ...(body.paymentStatus !== undefined && { paymentStatus: body.paymentStatus }),
        ...(body.driver !== undefined && { driver: body.driver }),
        ...(body.vehicle !== undefined && { vehicle: body.vehicle }),
      },
    });
    return NextResponse.json(booking);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to update booking" }, { status: 500 });
  }
}
