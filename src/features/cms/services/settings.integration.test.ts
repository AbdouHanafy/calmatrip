import { randomUUID } from "node:crypto";
import { afterEach, describe, expect, it, vi } from "vitest";
import { prisma } from "@/lib/prisma";
import { loadSiteSettings } from "./settings";

// `settingsMutation.ts` pulls in `./server`, which imports `@/auth` (NextAuth) —
// not resolvable in this Vitest node environment (same reason every other CMS
// route-handler test mocks this module rather than importing it for real; see
// mediaApi.test.ts). Audit/revision plumbing itself is exercised for real
// against the DB in settingsApi.test.ts's mocked-request assertions and in
// the CMS's existing server.ts coverage — this file focuses on real
// SiteSetting persistence and default-merging behavior.
vi.mock("./server", () => ({
  auditCmsAction: vi.fn(),
  createRevision: vi.fn(),
}));

// revalidateTag/revalidatePath require a live Next.js request context that
// doesn't exist under Vitest — stub them so the real DB write path can still
// be exercised end-to-end.
vi.mock("next/cache", () => ({
  unstable_cache: (fn: (...args: unknown[]) => unknown) => fn,
  revalidateTag: vi.fn(),
  revalidatePath: vi.fn(),
}));

const { updateSettingsGroup } = await import("./settingsMutation");

describe("site settings — database-to-service integration", () => {
  afterEach(async () => {
    await prisma.siteSetting.deleteMany({
      where: { key: { in: ["general", "branding", "contact", "social", "footer"] } },
    });
  });

  it("falls back to real application defaults when nothing has ever been saved", async () => {
    const settings = await loadSiteSettings();
    expect(settings.general.siteName).toBe("Calma Trip");
    expect(settings.contact.email).toBe("contact@calmatrip.com");
    expect(settings.social.youtube).toBeNull();
  });

  it("persists a partial update and merges it over the defaults", async () => {
    const actorId = `test-actor-${randomUUID()}`;
    await updateSettingsGroup({
      group: "general",
      data: {
        siteName: "Calma Trip Test",
        siteDescription: "A test description.",
        defaultLocale: "en",
        timezone: "Europe/Paris",
      },
      actorId,
    });

    const settings = await loadSiteSettings();
    expect(settings.general.siteName).toBe("Calma Trip Test");
    expect(settings.general.defaultLocale).toBe("en");
    // Other categories remain untouched at their defaults.
    expect(settings.contact.email).toBe("contact@calmatrip.com");
  });

  it("overwrites a previously saved value on a second update to the same group", async () => {
    const actorId = `test-actor-${randomUUID()}`;
    await updateSettingsGroup({
      group: "contact",
      data: { email: "first@calmatrip.com", phone: null, whatsapp: null, address: null },
      actorId,
    });
    await updateSettingsGroup({
      group: "contact",
      data: { email: "second@calmatrip.com", phone: null, whatsapp: null, address: null },
      actorId,
    });
    const settings = await loadSiteSettings();
    expect(settings.contact.email).toBe("second@calmatrip.com");
  });

  it("never lets a malformed stored value crash the public read path", async () => {
    await prisma.siteSetting.create({
      data: { key: "social", group: "social", value: { facebook: "javascript:alert(1)" } },
    });
    const settings = await loadSiteSettings();
    // The malformed row fails schema validation, so the whole group falls
    // back to defaults rather than leaking or crashing on the bad value.
    expect(settings.social.facebook).toBe("https://www.facebook.com/calmatrip");
  });
});
