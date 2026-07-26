import { describe, expect, it } from "vitest";
import { checkoutSchema } from "./order";

const validOrder = {
  customerName: "Jane Doe",
  customerEmail: "jane@example.com",
  address: "1 Rue de la Paix, Tunis",
  items: [{ productId: 1, quantity: 2 }],
};

describe("checkoutSchema", () => {
  it("accepts a valid checkout payload", () => {
    expect(checkoutSchema.safeParse(validOrder).success).toBe(true);
  });

  it("rejects an empty cart", () => {
    const result = checkoutSchema.safeParse({ ...validOrder, items: [] });
    expect(result.success).toBe(false);
  });

  it("rejects a missing address", () => {
    const result = checkoutSchema.safeParse({ ...validOrder, address: "" });
    expect(result.success).toBe(false);
  });

  it("rejects an invalid customer email", () => {
    const result = checkoutSchema.safeParse({ ...validOrder, customerEmail: "nope" });
    expect(result.success).toBe(false);
  });

  it("rejects a non-positive item quantity", () => {
    const result = checkoutSchema.safeParse({
      ...validOrder,
      items: [{ productId: 1, quantity: 0 }],
    });
    expect(result.success).toBe(false);
  });

  it("rejects a non-integer productId", () => {
    const result = checkoutSchema.safeParse({
      ...validOrder,
      items: [{ productId: 1.5, quantity: 1 }],
    });
    expect(result.success).toBe(false);
  });
});
