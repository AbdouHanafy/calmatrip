import { describe, expect, it } from "vitest";
import { mediaFolderSchema, mediaMetadataSchema } from "./mediaSchemas";

describe("mediaFolderSchema", () => {
  it("accepts a plain folder name", () => {
    expect(mediaFolderSchema.safeParse({ name: "Hero images" }).success).toBe(true);
  });

  it("rejects an empty name", () => {
    expect(mediaFolderSchema.safeParse({ name: "" }).success).toBe(false);
  });

  it("rejects a name over the length limit", () => {
    expect(mediaFolderSchema.safeParse({ name: "a".repeat(121) }).success).toBe(false);
  });

  it("rejects a name containing a path separator (folder is stored/matched as a bare name)", () => {
    expect(mediaFolderSchema.safeParse({ name: "a/b" }).success).toBe(false);
    expect(mediaFolderSchema.safeParse({ name: "a\\b" }).success).toBe(false);
  });

  it("rejects a name containing control characters", () => {
    expect(mediaFolderSchema.safeParse({ name: "folder\0name" }).success).toBe(false);
  });
});

describe("mediaMetadataSchema", () => {
  it("accepts a full valid payload", () => {
    const result = mediaMetadataSchema.safeParse({
      title: "Sahara dunes",
      alt: { fr: "Dunes du Sahara", en: "Sahara dunes" },
      caption: { en: "Golden hour" },
      description: null,
      folder: "Hero images",
    });
    expect(result.success).toBe(true);
  });

  it("accepts an empty/partial payload (every field optional)", () => {
    expect(mediaMetadataSchema.safeParse({}).success).toBe(true);
  });

  it("rejects a title over the length limit", () => {
    expect(mediaMetadataSchema.safeParse({ title: "a".repeat(201) }).success).toBe(false);
  });

  it("rejects an alt text value over the per-locale length limit", () => {
    const result = mediaMetadataSchema.safeParse({ alt: { fr: "a".repeat(501) } });
    expect(result.success).toBe(false);
  });

  it("rejects a non-object alt value", () => {
    expect(mediaMetadataSchema.safeParse({ alt: "not an object" }).success).toBe(false);
  });

  it("rejects an empty folder string (must be null to clear, not empty)", () => {
    expect(mediaMetadataSchema.safeParse({ folder: "" }).success).toBe(false);
  });
});
