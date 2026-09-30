import { describe, expect, it } from "vitest";
import {
  generalSettingsSchema,
  brandingSettingsSchema,
  contactSettingsSchema,
  socialSettingsSchema,
  footerSettingsSchema,
  searchSettingsSchema,
  isSettingsGroup,
} from "./settingsSchemas";

describe("generalSettingsSchema", () => {
  const valid = {
    siteName: "Calma Trip",
    siteDescription: "Stress-free travel in Tunisia.",
    defaultLocale: "fr",
    timezone: "Africa/Tunis",
  };

  it("accepts a valid payload", () => {
    expect(generalSettingsSchema.safeParse(valid).success).toBe(true);
  });

  it("rejects an empty site name", () => {
    expect(generalSettingsSchema.safeParse({ ...valid, siteName: "" }).success).toBe(false);
  });

  it("rejects a site name over 120 characters", () => {
    expect(generalSettingsSchema.safeParse({ ...valid, siteName: "a".repeat(121) }).success).toBe(
      false,
    );
  });

  it("rejects a locale outside fr/en/ar", () => {
    expect(generalSettingsSchema.safeParse({ ...valid, defaultLocale: "it" }).success).toBe(false);
  });

  it("rejects an invalid IANA timezone", () => {
    expect(generalSettingsSchema.safeParse({ ...valid, timezone: "Not/AZone" }).success).toBe(
      false,
    );
  });

  it("accepts a real IANA timezone other than the default", () => {
    expect(generalSettingsSchema.safeParse({ ...valid, timezone: "Europe/Paris" }).success).toBe(
      true,
    );
  });
});

describe("brandingSettingsSchema", () => {
  it("accepts null/empty logo and favicon", () => {
    const result = brandingSettingsSchema.safeParse({ logoUrl: "", faviconUrl: null });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.logoUrl).toBeNull();
      expect(result.data.faviconUrl).toBeNull();
    }
  });

  it("accepts a same-origin uploaded media path", () => {
    const result = brandingSettingsSchema.safeParse({
      logoUrl: "/uploads/media/abc123.png",
      faviconUrl: undefined,
    });
    expect(result.success).toBe(true);
  });

  it("rejects a javascript: URL", () => {
    expect(
      brandingSettingsSchema.safeParse({ logoUrl: "javascript:alert(1)", faviconUrl: null })
        .success,
    ).toBe(false);
  });

  it("rejects a data: URL", () => {
    expect(
      brandingSettingsSchema.safeParse({ logoUrl: "data:text/html,evil", faviconUrl: null })
        .success,
    ).toBe(false);
  });
});

describe("contactSettingsSchema", () => {
  const base = { email: null, phone: null, whatsapp: null, address: null };

  it("accepts all-empty contact info", () => {
    expect(contactSettingsSchema.safeParse(base).success).toBe(true);
  });

  it("accepts a legitimate international phone number", () => {
    expect(contactSettingsSchema.safeParse({ ...base, phone: "+216 21 622 972" }).success).toBe(
      true,
    );
  });

  it("rejects an invalid email", () => {
    expect(contactSettingsSchema.safeParse({ ...base, email: "not-an-email" }).success).toBe(false);
  });

  it("accepts a valid email", () => {
    expect(
      contactSettingsSchema.safeParse({ ...base, email: "contact@calmatrip.com" }).success,
    ).toBe(true);
  });

  it("rejects an address over 300 characters", () => {
    expect(contactSettingsSchema.safeParse({ ...base, address: "a".repeat(301) }).success).toBe(
      false,
    );
  });
});

describe("socialSettingsSchema", () => {
  const base = { facebook: null, instagram: null, tiktok: null, youtube: null };

  it("accepts all-empty social links", () => {
    expect(socialSettingsSchema.safeParse(base).success).toBe(true);
  });

  it("accepts a valid https URL", () => {
    expect(
      socialSettingsSchema.safeParse({ ...base, facebook: "https://www.facebook.com/calmatrip" })
        .success,
    ).toBe(true);
  });

  it("rejects a javascript: URL", () => {
    expect(
      socialSettingsSchema.safeParse({ ...base, instagram: "javascript:alert(1)" }).success,
    ).toBe(false);
  });

  it("rejects a vbscript: URL", () => {
    expect(socialSettingsSchema.safeParse({ ...base, tiktok: "vbscript:msgbox(1)" }).success).toBe(
      false,
    );
  });

  it("rejects a non-URL string", () => {
    expect(socialSettingsSchema.safeParse({ ...base, youtube: "not a url" }).success).toBe(false);
  });

  it("rejects a non-http(s) scheme like ftp", () => {
    expect(
      socialSettingsSchema.safeParse({ ...base, facebook: "ftp://example.com/calmatrip" }).success,
    ).toBe(false);
  });
});

describe("footerSettingsSchema", () => {
  it("accepts empty footer settings", () => {
    expect(footerSettingsSchema.safeParse({ copyrightText: null, description: null }).success).toBe(
      true,
    );
  });

  it("rejects copyright text over 200 characters", () => {
    expect(
      footerSettingsSchema.safeParse({ copyrightText: "a".repeat(201), description: null }).success,
    ).toBe(false);
  });
});

describe("searchSettingsSchema", () => {
  const valid = { maxParticipants: 20, showDate: true, showParticipants: true };

  it("accepts valid search settings", () => {
    expect(searchSettingsSchema.safeParse(valid).success).toBe(true);
  });

  it("coerces a numeric string from the form input", () => {
    const result = searchSettingsSchema.safeParse({ ...valid, maxParticipants: "12" });
    expect(result.success && result.data.maxParticipants).toBe(12);
  });

  it("rejects zero participants", () => {
    expect(searchSettingsSchema.safeParse({ ...valid, maxParticipants: 0 }).success).toBe(false);
  });

  it("rejects more than 99 participants", () => {
    expect(searchSettingsSchema.safeParse({ ...valid, maxParticipants: 100 }).success).toBe(false);
  });
});

describe("isSettingsGroup", () => {
  it("accepts each known group", () => {
    for (const group of ["general", "branding", "contact", "social", "footer", "search"]) {
      expect(isSettingsGroup(group)).toBe(true);
    }
  });

  it("rejects an unknown group", () => {
    expect(isSettingsGroup("arbitrary")).toBe(false);
  });

  it("rejects a non-string value", () => {
    expect(isSettingsGroup(42)).toBe(false);
  });
});
