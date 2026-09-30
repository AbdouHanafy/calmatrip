import { describe, expect, it } from "vitest";
import { destinationSchema, destinationUpdateSchema } from "./destination";

describe("destinationSchema", () => {
  it("accepts a name alone and fills defaults", () => {
    const result = destinationSchema.safeParse({ name: "Djerba" });
    expect(result.success && result.data).toEqual({
      name: "Djerba",
      description: "",
      active: true,
    });
  });

  it("trims the name", () => {
    const result = destinationSchema.safeParse({ name: "  Sousse " });
    expect(result.success && result.data.name).toBe("Sousse");
  });

  it("rejects an empty name", () => {
    expect(destinationSchema.safeParse({ name: "   " }).success).toBe(false);
  });

  it("rejects a name over 80 characters", () => {
    expect(destinationSchema.safeParse({ name: "x".repeat(81) }).success).toBe(false);
  });

  it("rejects a non-boolean active flag", () => {
    expect(destinationSchema.safeParse({ name: "Tozeur", active: "yes" }).success).toBe(false);
  });
});

describe("destinationUpdateSchema", () => {
  it("accepts a partial update", () => {
    expect(destinationUpdateSchema.safeParse({ active: false }).success).toBe(true);
  });

  it("accepts an order-only update", () => {
    expect(destinationUpdateSchema.safeParse({ order: 3 }).success).toBe(true);
  });

  it("rejects a negative order", () => {
    expect(destinationUpdateSchema.safeParse({ order: -1 }).success).toBe(false);
  });
});
