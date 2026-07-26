import { z } from "zod";

export const bookingSchema = z
  .object({
    serviceId: z.number().int().positive(),
    tripType: z.enum(["one-way", "round-trip"]),
    date: z.string().min(1, "Departure date is required."),
    time: z.string().min(1, "Departure time is required."),
    returnDate: z.string().optional(),
    returnTime: z.string().optional(),
    fromLocation: z.string().trim().min(1, "Pickup location is required."),
    toLocation: z.string().trim().min(1, "Drop-off location is required."),
    passengers: z.number().int().positive().optional(),
    hasLuggage: z.boolean().optional(),
    specialRequests: z.string().trim().max(1000).optional(),
    customerName: z.string().trim().min(1, "Name is required."),
    customerEmail: z.string().trim().email("Please enter a valid email address."),
    customerPhone: z.string().trim().optional(),
  })
  .refine((data) => data.tripType !== "round-trip" || (data.returnDate && data.returnTime), {
    message: "Return date and return time are required.",
    path: ["returnDate"],
  });

export type BookingInput = z.infer<typeof bookingSchema>;
