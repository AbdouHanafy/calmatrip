import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

interface BookingListFilters {
  email?: string | null;
  status?: string | null;
}

export async function getBookings({ email, status }: BookingListFilters) {
  const where: Prisma.BookingWhereInput = {};

  if (email) {
    where.customerEmail = email;
  }
  if (status && status !== "all") {
    where.status = status;
  }

  return prisma.booking.findMany({
    where,
    orderBy: { date: "desc" },
    include: {
      review: { select: { id: true, rating: true, comment: true, approved: true } },
    },
  });
}

interface CreateBookingInput {
  serviceId: number;
  tripType: string;
  date: Date;
  time: string;
  returnDate: Date | null;
  returnTime?: string;
  fromLocation: string;
  toLocation: string;
  passengers: number;
  hasLuggage: boolean;
  specialRequests?: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
}

export async function createBooking(input: CreateBookingInput) {
  return prisma.$transaction(async (tx) => {
    const service = await tx.service.findUnique({
      where: { id: input.serviceId },
      include: { owner: { select: { commissionRate: true } } },
    });

    if (!service || !service.active) {
      throw new Error("Service not found or inactive");
    }

    // Commission only applies to services owned by a B2B partner — house
    // services (ownerId null) never carry a commission.
    const commissionRate = service.ownerId ? (service.owner?.commissionRate ?? 10) : null;
    const priceNumeric = parseFloat(service.price.replace(/[^\d.]/g, "") || "0");
    const commissionAmount =
      commissionRate !== null && !isNaN(priceNumeric)
        ? Math.round(priceNumeric * (commissionRate / 100) * 100) / 100
        : null;

    return tx.booking.create({
      data: {
        service: service.title,
        tripType: input.tripType,
        date: input.date,
        time: input.time,
        returnDate: input.returnDate,
        returnTime: input.tripType === "round-trip" ? input.returnTime : null,
        fromLocation: input.fromLocation,
        toLocation: input.toLocation,
        passengers: input.passengers,
        hasLuggage: input.hasLuggage,
        specialRequests: input.specialRequests,
        customerName: input.customerName,
        customerEmail: input.customerEmail,
        customerPhone: input.customerPhone,
        price: service.price,
        serviceId: service.id,
        ownerId: service.ownerId,
        commissionRate,
        commissionAmount,
        status: "pending",
      },
    });
  });
}
