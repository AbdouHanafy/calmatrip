import { describe, expect, it } from "vitest";
import { valueContainsMediaUrl } from "./mediaUsage";

const URL = "https://res.cloudinary.com/demo/image/upload/v1/calmatrip/uploads/abc123.png";
const OTHER = "https://res.cloudinary.com/demo/image/upload/v1/calmatrip/uploads/other.png";

describe("valueContainsMediaUrl", () => {
  it("matches an exact string value", () => {
    expect(valueContainsMediaUrl(URL, URL)).toBe(true);
  });

  it("does not match a different string", () => {
    expect(valueContainsMediaUrl(OTHER, URL)).toBe(false);
  });

  it("finds the url nested inside an array", () => {
    expect(valueContainsMediaUrl(["a", URL, "b"], URL)).toBe(true);
  });

  it("finds the url nested inside an object", () => {
    expect(valueContainsMediaUrl({ backgroundImage: URL }, URL)).toBe(true);
  });

  it("finds the url deeply nested across blocks (array of objects with array fields)", () => {
    const blocks = [
      { type: "HERO", data: { backgroundImage: OTHER } },
      { type: "GALLERY", data: { images: [{ url: OTHER }, { url: URL }] } },
    ];
    expect(valueContainsMediaUrl(blocks, URL)).toBe(true);
  });

  it("returns false when the url isn't present anywhere in the structure", () => {
    const blocks = [{ type: "HERO", data: { backgroundImage: OTHER } }];
    expect(valueContainsMediaUrl(blocks, URL)).toBe(false);
  });

  it("handles null/undefined/primitive values without throwing", () => {
    expect(valueContainsMediaUrl(null, URL)).toBe(false);
    expect(valueContainsMediaUrl(undefined, URL)).toBe(false);
    expect(valueContainsMediaUrl(42, URL)).toBe(false);
    expect(valueContainsMediaUrl(true, URL)).toBe(false);
  });
});
