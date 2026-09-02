import { describe, expect, it } from "vitest";
import { evaluateCondition, validateDynamicData } from "./validation";
import { hasPermission } from "./permissions";
import type { FieldDefinitionInput } from "../types";

const fields: FieldDefinitionInput[] = [
  { key: "title", label: "Title", type: "TEXT", required: true, validation: { min: 3, max: 20 } },
  { key: "email", label: "Email", type: "EMAIL", required: true },
  { key: "website", label: "Website", type: "URL" },
  { key: "body", label: "Body", type: "RICH_TEXT" },
];

describe("dynamic value validation", () => {
  it("validates defined values and strips XSS from rich text", () => {
    const result = validateDynamicData(fields, {
      title: "Sahara",
      email: "hello@example.com",
      website: "https://calmatrip.com",
      body: "<p>Hello</p><script>alert(1)</script><img src=x onerror=alert(1)>",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.body).not.toContain("script");
      expect(result.data.body).not.toContain("onerror");
    }
  });

  it("rejects missing, malformed, malicious URLs and unknown fields", () => {
    const result = validateDynamicData(fields, {
      title: "x",
      email: "bad",
      website: "javascript:alert(1)",
      paymentStatus: "paid",
    });
    expect(result.success).toBe(false);
    if (!result.success)
      expect(Object.keys(result.errors)).toEqual(
        expect.arrayContaining(["title", "email", "website", "paymentStatus"]),
      );
  });

  it("enforces choices, dates, slugs, colors and configured patterns", () => {
    const configured: FieldDefinitionInput[] = [
      {
        key: "kind",
        label: "Kind",
        type: "SELECT",
        options: [{ value: "tour", label: { fr: "Tour" } }],
      },
      {
        key: "tags",
        label: "Tags",
        type: "MULTI_SELECT",
        options: [{ value: "desert", label: { fr: "Desert" } }],
      },
      { key: "date", label: "Date", type: "DATE" },
      { key: "slug", label: "Slug", type: "SLUG" },
      { key: "color", label: "Color", type: "COLOR" },
      { key: "code", label: "Code", type: "TEXT", validation: { pattern: "^CT-[0-9]+$" } },
    ];
    const result = validateDynamicData(configured, {
      kind: "hotel",
      tags: ["unknown"],
      date: "tomorrow",
      slug: "Not valid",
      color: "red",
      code: "wrong",
    });
    expect(result.success).toBe(false);
    if (!result.success)
      expect(Object.keys(result.errors)).toEqual(
        expect.arrayContaining(["kind", "tags", "date", "slug", "color", "code"]),
      );
  });
});

describe("conditions and least privilege", () => {
  it("evaluates only whitelisted declarative operators", () => {
    expect(
      evaluateCondition({ field: "country", operator: "EQUALS", value: "TN" }, { country: "TN" }),
    ).toBe(true);
    expect(
      evaluateCondition(
        { field: "country", operator: "NOT_EQUALS", value: "TN" },
        { country: "FR" },
      ),
    ).toBe(true);
  });

  it("does not grant content staff financial access", () => {
    expect(hasPermission("CONTENT_MANAGER", "content.publish")).toBe(true);
    expect(hasPermission("CONTENT_MANAGER", "payments.read")).toBe(false);
    expect(hasPermission("EDITOR", "content.publish")).toBe(false);
    expect(hasPermission(undefined, "cms.read")).toBe(false);
  });
});
