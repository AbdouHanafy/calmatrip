import { describe, expect, it } from "vitest";
import { parseImages, serializeImages } from "./imageSerialization";

describe("parseImages", () => {
  it("returns an empty array for null/undefined", () => {
    expect(parseImages(null)).toEqual([]);
    expect(parseImages(undefined)).toEqual([]);
  });

  it("parses a JSON array of URLs", () => {
    const raw = JSON.stringify(["https://a.com/1.jpg", "https://a.com/2.jpg"]);
    expect(parseImages(raw)).toEqual(["https://a.com/1.jpg", "https://a.com/2.jpg"]);
  });

  it("wraps a plain single URL string in an array", () => {
    expect(parseImages("https://a.com/1.jpg")).toEqual(["https://a.com/1.jpg"]);
  });

  it("wraps a non-JSON string instead of throwing", () => {
    expect(parseImages("/placeholder-product.png")).toEqual(["/placeholder-product.png"]);
  });
});

describe("serializeImages", () => {
  it("returns null for an empty array", () => {
    expect(serializeImages([])).toBeNull();
  });

  it("returns the bare URL for a single-image array", () => {
    expect(serializeImages(["https://a.com/1.jpg"])).toBe("https://a.com/1.jpg");
  });

  it("returns a JSON array string for multiple images", () => {
    const result = serializeImages(["https://a.com/1.jpg", "https://a.com/2.jpg"]);
    expect(result).toBe(JSON.stringify(["https://a.com/1.jpg", "https://a.com/2.jpg"]));
  });

  it("round-trips through parseImages", () => {
    const urls = ["https://a.com/1.jpg", "https://a.com/2.jpg", "https://a.com/3.jpg"];
    expect(parseImages(serializeImages(urls))).toEqual(urls);
  });
});
