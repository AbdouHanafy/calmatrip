import { describe, expect, it } from "vitest";
import { evolveEntryData } from "./schemaEvolution";

describe("content schema evolution", () => {
  const previous = [
    { id: "field-title", key: "title", label: "Title", type: "TEXT" as const, required: true },
    { id: "field-legacy", key: "legacy", label: "Legacy", type: "TEXT" as const },
  ];

  it("moves stored values when a field key is renamed and preserves removed data", () => {
    const result = evolveEntryData({ title: "Sahara", legacy: "keep for recovery" }, previous, [
      { id: "field-title", key: "name", label: "Name", type: "TEXT", required: true },
    ]);
    expect(result).toEqual({
      success: true,
      data: { name: "Sahara", legacy: "keep for recovery" },
    });
  });

  it("rejects a type change that invalidates existing entries", () => {
    const result = evolveEntryData({ title: "Sahara" }, previous, [
      { id: "field-title", key: "title", label: "Title", type: "NUMBER", required: true },
    ]);
    expect(result.success).toBe(false);
    if (!result.success) expect(result.errors.title).toBe("Must be a number");
  });

  it("rejects a new required field without a usable default", () => {
    const result = evolveEntryData({ title: "Sahara" }, previous, [
      { id: "field-title", key: "title", label: "Title", type: "TEXT", required: true },
      { key: "country", label: "Country", type: "TEXT", required: true },
    ]);
    expect(result.success).toBe(false);
    if (!result.success) expect(result.errors.country).toBe("Required");
  });
});
