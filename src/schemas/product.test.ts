import { describe, expect, it } from "vitest";
import { productCreateSchema, productUpdateSchema } from "./product";

const validProduct = {
  name: "Handwoven Rug",
  price: "45.50",
  category: "Home",
  description: "A beautiful handwoven rug from Kairouan.",
};

describe("productCreateSchema", () => {
  it("accepts a valid product and coerces price to a number", () => {
    const result = productCreateSchema.safeParse(validProduct);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.price).toBe(45.5);
      expect(typeof result.data.price).toBe("number");
    }
  });

  // Regression test: the API used to do `price: parseFloat(price)` with no
  // validation, so a garbage price silently became NaN and was written to
  // the database. Zod must reject it outright instead.
  it("regression: rejects a non-numeric price instead of silently becoming NaN", () => {
    const result = productCreateSchema.safeParse({ ...validProduct, price: "not-a-number" });
    expect(result.success).toBe(false);
  });

  it("rejects a zero or negative price", () => {
    expect(productCreateSchema.safeParse({ ...validProduct, price: "0" }).success).toBe(false);
    expect(productCreateSchema.safeParse({ ...validProduct, price: "-5" }).success).toBe(false);
  });

  it("regression: rejects a non-numeric stock instead of silently becoming NaN", () => {
    const result = productCreateSchema.safeParse({ ...validProduct, stock: "lots" });
    expect(result.success).toBe(false);
  });

  it("rejects a missing name", () => {
    expect(productCreateSchema.safeParse({ ...validProduct, name: "" }).success).toBe(false);
  });

  it("accepts an optional sizes array", () => {
    const result = productCreateSchema.safeParse({ ...validProduct, sizes: ["S", "M", "L"] });
    expect(result.success).toBe(true);
  });
});

describe("productUpdateSchema", () => {
  it("accepts a partial update with only one field", () => {
    const result = productUpdateSchema.safeParse({ stock: "10" });
    expect(result.success).toBe(true);
  });

  // Regression test: this schema rejected `image: null` until this session's
  // fix, even though clearing a product's images always sends exactly that —
  // serializeImages([]) returns null. Caught live while re-testing the
  // AdminProductsPage refactor.
  it("regression: accepts image: null when a product's images are cleared", () => {
    const result = productUpdateSchema.safeParse({ image: null });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.image).toBeNull();
    }
  });

  it("still accepts a real image URL", () => {
    const result = productUpdateSchema.safeParse({ image: "https://res.cloudinary.com/x/y.jpg" });
    expect(result.success).toBe(true);
  });

  it("accepts an empty object (no fields changed)", () => {
    expect(productUpdateSchema.safeParse({}).success).toBe(true);
  });

  it("rejects a negative stock", () => {
    expect(productUpdateSchema.safeParse({ stock: "-1" }).success).toBe(false);
  });
});
