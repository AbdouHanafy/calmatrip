import { describe, expect, it } from "vitest";
import { reviewSchema } from "./review";

describe("reviewSchema", () => {
  it("accepts a valid review", () => {
    const result = reviewSchema.safeParse({ rating: 5, comment: "Great trip!" });
    expect(result.success).toBe(true);
  });

  it("rejects a rating below 1", () => {
    expect(reviewSchema.safeParse({ rating: 0, comment: "ok" }).success).toBe(false);
  });

  it("rejects a rating above 5", () => {
    expect(reviewSchema.safeParse({ rating: 6, comment: "ok" }).success).toBe(false);
  });

  it("rejects a non-integer rating", () => {
    expect(reviewSchema.safeParse({ rating: 4.5, comment: "ok" }).success).toBe(false);
  });

  // Regression test: the API used to do `if (rating < 1 || rating > 5)`, which
  // silently coerces a string like "5" to a number and lets it through. Zod's
  // z.number() must reject a string outright.
  it("regression: rejects a rating sent as a string (previously accepted via JS coercion)", () => {
    const result = reviewSchema.safeParse({ rating: "5", comment: "Great trip!" });
    expect(result.success).toBe(false);
  });

  it("rejects an empty comment", () => {
    expect(reviewSchema.safeParse({ rating: 5, comment: "" }).success).toBe(false);
  });

  it("rejects a comment over 2000 characters", () => {
    expect(reviewSchema.safeParse({ rating: 5, comment: "a".repeat(2001) }).success).toBe(false);
  });

  it("accepts an optional service label", () => {
    const result = reviewSchema.safeParse({
      rating: 5,
      comment: "Great trip!",
      service: "Airport Transfer",
    });
    expect(result.success).toBe(true);
  });
});
