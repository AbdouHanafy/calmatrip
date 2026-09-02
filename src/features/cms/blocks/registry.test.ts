import { describe, expect, it } from "vitest";
import {
  BLOCK_REGISTRY,
  REGISTERED_BLOCK_TYPES,
  validateBlockData,
  type EditorField,
} from "./registry";
import { blockSchema } from "../schemas/cmsSchemas";

describe("CMS block registry", () => {
  it("keeps metadata, schema, editor configuration and defaults together", () => {
    expect(REGISTERED_BLOCK_TYPES.length).toBeGreaterThanOrEqual(15);
    for (const type of REGISTERED_BLOCK_TYPES) {
      const block = BLOCK_REGISTRY[type];
      expect(block.label).toBeTruthy();
      expect(block.description).toBeTruthy();
      expect(block.schema).toBeTruthy();
      for (const field of block.fields)
        expect((block.editor as Record<string, EditorField>)[field]).toBeTruthy();
    }
  });

  it("rejects unsafe links and invalid map coordinates", () => {
    expect(validateBlockData("CTA", { buttonUrl: "javascript:alert(1)" }).success).toBe(false);
    expect(validateBlockData("MAP", { latitude: 120, longitude: 10, zoom: 12 }).success).toBe(
      false,
    );
  });

  it("validates structured FAQ content", () => {
    expect(
      blockSchema.safeParse({
        type: "FAQ",
        data: { title: "Questions", items: [{ question: "Where?", answer: "Douz" }] },
      }).success,
    ).toBe(true);
    expect(
      blockSchema.safeParse({ type: "FAQ", data: { items: [{ question: 42 }] } }).success,
    ).toBe(false);
  });

  it("allows incomplete collection blocks as drafts but validates configured slugs", () => {
    expect(validateBlockData("COLLECTION_LIST", {}).success).toBe(true);
    expect(validateBlockData("COLLECTION_LIST", { contentType: "Not valid" }).success).toBe(false);
  });
});
