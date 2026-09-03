import { beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";

const mocks = vi.hoisted(() => ({
  requireCmsPermission: vi.fn(),
  auditCmsAction: vi.fn(),
  createRevision: vi.fn(),
  siteSettingFindMany: vi.fn(),
  siteSettingFindUnique: vi.fn(),
  siteSettingUpsert: vi.fn(),
  cmsMediaFindFirst: vi.fn(),
}));

vi.mock("@/features/cms/services/server", () => ({
  requireCmsPermission: mocks.requireCmsPermission,
  auditCmsAction: mocks.auditCmsAction,
  createRevision: mocks.createRevision,
}));

vi.mock("next/cache", () => ({
  unstable_cache: (fn: (...args: unknown[]) => unknown) => fn,
  revalidateTag: vi.fn(),
  revalidatePath: vi.fn(),
}));

vi.mock("@/lib/prisma", () => ({
  prisma: {
    siteSetting: {
      findMany: mocks.siteSettingFindMany,
      findUnique: mocks.siteSettingFindUnique,
      upsert: mocks.siteSettingUpsert,
    },
    cmsMedia: {
      findFirst: mocks.cmsMediaFindFirst,
    },
  },
}));

import { GET as getSettings, PUT as putSettings } from "@/app/api/cms/settings/route";

function jsonRequest(method: string, body?: unknown) {
  return new NextRequest("http://localhost/api/cms/settings", {
    method,
    ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
    headers: { "Content-Type": "application/json" },
  });
}

describe("GET /api/cms/settings", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.siteSettingFindMany.mockResolvedValue([]);
  });

  it("rejects an unauthenticated request", async () => {
    mocks.requireCmsPermission.mockResolvedValue(null);
    const res = await getSettings();
    expect(res.status).toBe(403);
  });

  it("rejects a user without settings.manage permission", async () => {
    mocks.requireCmsPermission.mockResolvedValue(null);
    const res = await getSettings();
    expect(res.status).toBe(403);
  });

  it("returns defaults merged with any stored rows for an authorized admin", async () => {
    mocks.requireCmsPermission.mockResolvedValue({ id: "admin-1" });
    mocks.siteSettingFindMany.mockResolvedValue([
      { key: "general", value: { siteName: "Custom Name" } },
    ]);
    const res = await getSettings();
    const body = await res.json();
    expect(res.status).toBe(200);
    expect(body.settings.general.siteName).toBe("Custom Name");
    expect(body.settings.contact.email).toBe("contact@calmatrip.com");
  });
});

describe("PUT /api/cms/settings", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.siteSettingFindMany.mockResolvedValue([]);
    mocks.siteSettingFindUnique.mockResolvedValue(null);
    mocks.siteSettingUpsert.mockResolvedValue({ id: "row-1", value: {} });
  });

  it("rejects an unauthenticated request", async () => {
    mocks.requireCmsPermission.mockResolvedValue(null);
    const res = await putSettings(jsonRequest("PUT", { group: "general", data: {} }));
    expect(res.status).toBe(403);
  });

  it("rejects an unknown settings group", async () => {
    mocks.requireCmsPermission.mockResolvedValue({ id: "admin-1" });
    const res = await putSettings(jsonRequest("PUT", { group: "not-a-group", data: {} }));
    expect(res.status).toBe(400);
  });

  it("rejects an invalid email in the contact group", async () => {
    mocks.requireCmsPermission.mockResolvedValue({ id: "admin-1" });
    const res = await putSettings(
      jsonRequest("PUT", {
        group: "contact",
        data: { email: "not-an-email", phone: null, whatsapp: null, address: null },
      }),
    );
    expect(res.status).toBe(400);
  });

  it("rejects a dangerous URL scheme in the social group", async () => {
    mocks.requireCmsPermission.mockResolvedValue({ id: "admin-1" });
    const res = await putSettings(
      jsonRequest("PUT", {
        group: "social",
        data: { facebook: "javascript:alert(1)", instagram: null, tiktok: null, youtube: null },
      }),
    );
    expect(res.status).toBe(400);
  });

  it("rejects a branding update referencing media that does not exist", async () => {
    mocks.requireCmsPermission.mockResolvedValue({ id: "admin-1" });
    mocks.cmsMediaFindFirst.mockResolvedValue(null);
    const res = await putSettings(
      jsonRequest("PUT", {
        group: "branding",
        data: { logoUrl: "/uploads/media/missing.png", faviconUrl: null },
      }),
    );
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toMatch(/not found/i);
  });

  it("accepts a branding update referencing an existing media asset", async () => {
    mocks.requireCmsPermission.mockResolvedValue({ id: "admin-1" });
    mocks.cmsMediaFindFirst.mockResolvedValue({ id: "media-1" });
    const res = await putSettings(
      jsonRequest("PUT", {
        group: "branding",
        data: { logoUrl: "/uploads/media/logo.png", faviconUrl: null },
      }),
    );
    expect(res.status).toBe(200);
    expect(mocks.siteSettingUpsert).toHaveBeenCalled();
  });

  it("persists a valid general settings update and audits it", async () => {
    mocks.requireCmsPermission.mockResolvedValue({ id: "admin-1" });
    const res = await putSettings(
      jsonRequest("PUT", {
        group: "general",
        data: {
          siteName: "Calma Trip",
          siteDescription: "Updated description",
          defaultLocale: "en",
          timezone: "Africa/Tunis",
        },
      }),
    );
    expect(res.status).toBe(200);
    expect(mocks.auditCmsAction).toHaveBeenCalledWith(
      expect.objectContaining({ action: "site_settings.general.updated" }),
    );
  });
});
