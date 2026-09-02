import { describe, expect, it } from "vitest";
import {
  conditionSchema,
  contentTypeInputSchema,
  formInputSchema,
  pageInputSchema,
  redirectSchema,
} from "./cmsSchemas";

describe("CMS definition schemas", () => {
  it("accepts an extensible content type without executable configuration", () => {
    const result = contentTypeInputSchema.safeParse({
      name: "Travel Guide",
      slug: "travel-guide",
      fields: [
        { key: "title", label: "Title", type: "TEXT", required: true },
        { key: "cover", label: "Cover", type: "IMAGE" },
      ],
    });
    expect(result.success).toBe(true);
  });

  it("rejects invalid keys, duplicate keys and selects without options", () => {
    expect(
      contentTypeInputSchema.safeParse({
        name: "Bad",
        slug: "bad",
        fields: [{ key: "bad-key", label: "One", type: "TEXT" }],
      }).success,
    ).toBe(false);
    expect(
      contentTypeInputSchema.safeParse({
        name: "Bad",
        slug: "bad",
        fields: [
          { key: "title", label: "One", type: "TEXT" },
          { key: "title", label: "Two", type: "TEXT" },
        ],
      }).success,
    ).toBe(false);
    expect(
      contentTypeInputSchema.safeParse({
        name: "Bad",
        slug: "bad",
        fields: [{ key: "kind", label: "Kind", type: "SELECT" }],
      }).success,
    ).toBe(false);
  });

  it("supports localized multi-step forms and safe conditions", () => {
    const result = formInputSchema.safeParse({
      name: "Partner application",
      slug: "partner-application",
      status: "PUBLISHED",
      steps: [
        {
          title: { fr: "Profil", ar: "الملف" },
          position: 0,
          fields: [
            {
              key: "partnerType",
              label: { fr: "Type" },
              type: "RADIO",
              options: [{ label: { fr: "Artisan" }, value: "ARTISAN" }],
            },
            {
              key: "vat",
              label: { fr: "TVA" },
              type: "TEXT",
              condition: {
                field: "partnerType",
                operator: "EQUALS",
                value: "AGENCY",
                action: "SHOW",
              },
            },
          ],
        },
      ],
    });
    expect(result.success).toBe(true);
  });

  it("rejects duplicate form keys and conditions that reference unknown fields", () => {
    const base = {
      name: "Contact",
      slug: "contact",
      steps: [
        {
          title: { fr: "One" },
          position: 0,
          fields: [
            { key: "name", label: { fr: "Name" }, type: "TEXT" },
            {
              key: "name",
              label: { fr: "Again" },
              type: "TEXT",
              condition: { field: "missing", operator: "EQUALS", value: "x", action: "SHOW" },
            },
          ],
        },
      ],
    };
    expect(formInputSchema.safeParse(base).success).toBe(false);
  });

  it("rejects executable-looking condition operators", () => {
    expect(
      conditionSchema.safeParse({ field: "country", operator: "EVAL", value: "alert(1)" }).success,
    ).toBe(false);
  });

  it("validates pages, SEO and registered blocks", () => {
    expect(
      pageInputSchema.safeParse({
        title: "Sahara",
        slug: "sahara",
        locale: "ar",
        status: "DRAFT",
        blocks: [{ type: "HERO", data: { title: "الصحراء" } }],
        seo: { title: "Sahara", index: true, follow: true },
      }).success,
    ).toBe(true);
    expect(
      pageInputSchema.safeParse({
        title: "X",
        slug: "x",
        blocks: [{ type: "EXECUTE_CODE", data: {} }],
      }).success,
    ).toBe(false);
  });

  it("prevents unsafe and looping redirects", () => {
    expect(
      redirectSchema.safeParse({ source: "/old", destination: "/new", statusCode: 301 }).success,
    ).toBe(true);
    expect(
      redirectSchema.safeParse({ source: "/same", destination: "/same", statusCode: 301 }).success,
    ).toBe(false);
    expect(
      redirectSchema.safeParse({
        source: "/old",
        destination: "javascript:alert(1)",
        statusCode: 302,
      }).success,
    ).toBe(false);
  });
});
