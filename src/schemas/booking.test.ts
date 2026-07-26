import { describe, expect, it } from "vitest";
import { bookingSchema } from "./booking";

const validOneWay = {
  serviceId: 1,
  tripType: "one-way" as const,
  date: "2026-08-01",
  time: "10:00",
  fromLocation: "Tunis Airport",
  toLocation: "Hammamet",
  customerName: "Jane Doe",
  customerEmail: "jane@example.com",
};

describe("bookingSchema", () => {
  it("accepts a valid one-way booking", () => {
    expect(bookingSchema.safeParse(validOneWay).success).toBe(true);
  });

  it("rejects a non-positive serviceId", () => {
    const result = bookingSchema.safeParse({ ...validOneWay, serviceId: 0 });
    expect(result.success).toBe(false);
  });

  it("rejects an invalid tripType", () => {
    const result = bookingSchema.safeParse({ ...validOneWay, tripType: "round-way" });
    expect(result.success).toBe(false);
  });

  it("rejects a missing fromLocation", () => {
    const result = bookingSchema.safeParse({ ...validOneWay, fromLocation: "" });
    expect(result.success).toBe(false);
  });

  it("rejects an invalid customer email", () => {
    const result = bookingSchema.safeParse({ ...validOneWay, customerEmail: "not-an-email" });
    expect(result.success).toBe(false);
  });

  it("requires returnDate and returnTime for round-trip bookings", () => {
    const result = bookingSchema.safeParse({
      ...validOneWay,
      tripType: "round-trip",
    });
    expect(result.success).toBe(false);
  });

  it("accepts a round-trip booking with return date and time", () => {
    const result = bookingSchema.safeParse({
      ...validOneWay,
      tripType: "round-trip",
      returnDate: "2026-08-05",
      returnTime: "14:00",
    });
    expect(result.success).toBe(true);
  });

  it("rejects a round-trip booking with only returnDate set", () => {
    const result = bookingSchema.safeParse({
      ...validOneWay,
      tripType: "round-trip",
      returnDate: "2026-08-05",
    });
    expect(result.success).toBe(false);
  });
});
