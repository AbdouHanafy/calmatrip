import { beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";

const mocks = vi.hoisted(() => ({
  requireCmsPermission: vi.fn(),
  auditCmsAction: vi.fn(),
  createRevision: vi.fn(),
  contentTypeFindUnique: vi.fn(),
  contentTypeCreate: vi.fn(),
  contentEntryCreate: vi.fn(),
}));

vi.mock("@/features/cms/services/server", () => ({
  requireCmsPermission: mocks.requireCmsPermission,
  auditCmsAction: mocks.auditCmsAction,
  createRevision: mocks.createRevision,
  publicationData: (status: string, userId: string) =>
    status === "PUBLISHED" ? { publishedAt: expect.any(Date), publishedBy: userId } : {},
}));

vi.mock("@/lib/prisma", () => ({
  prisma: {
    contentType: {
      findUnique: mocks.contentTypeFindUnique,
      create: mocks.contentTypeCreate,
    },
    contentEntry: {
      create: mocks.contentEntryCreate,
      findFirst: vi.fn(),
    },
  },
}));

import { POST as createContentType } from "@/app/api/cms/content-types/route";
import { POST as createEntry } from "@/app/api/cms/content-types/[slug]/entries/route";
import { POST as bulkEntries } from "@/app/api/cms/content-types/[slug]/entries/bulk/route";

const request = (body: unknown) =>
  new NextRequest("http://localhost/api/test", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

describe("content management API authorization and validation", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("rejects an unauthenticated collection mutation before database access", async () => {
    mocks.requireCmsPermission.mockResolvedValue(null);
    const response = await createContentType(request({}));
    expect(response.status).toBe(403);
    expect(mocks.contentTypeCreate).not.toHaveBeenCalled();
  });

  it("allows an authorized editor to create a valid draft entry", async () => {
    mocks.requireCmsPermission.mockResolvedValue({ id: "editor-1" });
    mocks.contentTypeFindUnique.mockResolvedValue({
      id: "type-1",
      active: true,
      publishingEnabled: true,
      fields: [
        {
          id: "field-1",
          key: "title",
          label: "Title",
          type: "TEXT",
          required: true,
          unique: false,
          defaultValue: null,
          validation: null,
          options: null,
          relation: null,
        },
      ],
    });
    mocks.contentEntryCreate.mockResolvedValue({
      id: "entry-1",
      slug: "sahara",
      status: "DRAFT",
      data: { title: "Sahara" },
    });

    const response = await createEntry(
      request({ slug: "sahara", locale: "fr", status: "DRAFT", data: { title: "Sahara" } }),
      { params: Promise.resolve({ slug: "destinations" }) },
    );
    expect(response.status).toBe(201);
    expect(mocks.contentEntryCreate).toHaveBeenCalledOnce();
    expect(mocks.createRevision).toHaveBeenCalledOnce();
  });

  it("does not let an editor without publish permission publish", async () => {
    mocks.requireCmsPermission.mockImplementation(async (permission: string) =>
      permission === "content.publish" ? null : { id: "editor-1" },
    );
    const response = await createEntry(
      request({ slug: "sahara", locale: "fr", status: "PUBLISHED", data: {} }),
      { params: Promise.resolve({ slug: "destinations" }) },
    );
    expect(response.status).toBe(403);
    expect(mocks.contentEntryCreate).not.toHaveBeenCalled();
  });

  it("rejects invalid dynamic field data for an authorized administrator", async () => {
    mocks.requireCmsPermission.mockResolvedValue({ id: "admin-1" });
    mocks.contentTypeFindUnique.mockResolvedValue({
      id: "type-1",
      active: true,
      publishingEnabled: true,
      fields: [
        {
          id: "field-1",
          key: "priority",
          label: "Priority",
          type: "NUMBER",
          required: true,
          unique: false,
          defaultValue: null,
          validation: null,
          options: null,
          relation: null,
        },
      ],
    });
    const response = await createEntry(
      request({ slug: "sahara", locale: "fr", status: "DRAFT", data: { priority: "high" } }),
      { params: Promise.resolve({ slug: "destinations" }) },
    );
    expect(response.status).toBe(400);
    expect((await response.json()).fields.priority).toBe("Must be a number");
  });

  it("checks publish permission before executing a bulk publication", async () => {
    mocks.requireCmsPermission.mockImplementation(async (permission: string) =>
      permission === "content.publish" ? null : { id: "editor-1" },
    );
    const response = await bulkEntries(
      request({ ids: ["cm12345678901234567890123"], action: "PUBLISH" }),
      { params: Promise.resolve({ slug: "destinations" }) },
    );
    expect(response.status).toBe(403);
  });
});
