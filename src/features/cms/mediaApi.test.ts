import { beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";

const mocks = vi.hoisted(() => ({
  requireCmsPermission: vi.fn(),
  auditCmsAction: vi.fn(),
  findMediaUsages: vi.fn(),
  uploadMediaAssets: vi.fn(),
  deleteMediaAsset: vi.fn(),
  replaceMediaAsset: vi.fn(),
  cmsMediaFindMany: vi.fn(),
  cmsMediaCount: vi.fn(),
  cmsMediaFindUnique: vi.fn(),
  cmsMediaCreate: vi.fn(),
  cmsMediaUpdate: vi.fn(),
  cmsMediaUpdateMany: vi.fn(),
  cmsMediaDelete: vi.fn(),
  cmsMediaFolderFindMany: vi.fn(),
  cmsMediaFolderFindUnique: vi.fn(),
  cmsMediaFolderFindFirst: vi.fn(),
  cmsMediaFolderCreate: vi.fn(),
  cmsMediaFolderUpdate: vi.fn(),
  cmsMediaFolderDelete: vi.fn(),
}));

vi.mock("@/features/cms/services/server", () => ({
  requireCmsPermission: mocks.requireCmsPermission,
  auditCmsAction: mocks.auditCmsAction,
}));

vi.mock("@/features/cms/services/mediaUsage", () => ({
  findMediaUsages: mocks.findMediaUsages,
}));

vi.mock("@/lib/mediaStorage", async () => {
  const actual = await vi.importActual<typeof import("@/lib/mediaStorage")>("@/lib/mediaStorage");
  return {
    ...actual,
    uploadMediaAssets: mocks.uploadMediaAssets,
    deleteMediaAsset: mocks.deleteMediaAsset,
    replaceMediaAsset: mocks.replaceMediaAsset,
  };
});

vi.mock("@/lib/prisma", () => {
  const client: Record<string, unknown> = {
    cmsMedia: {
      findMany: mocks.cmsMediaFindMany,
      count: mocks.cmsMediaCount,
      findUnique: mocks.cmsMediaFindUnique,
      create: mocks.cmsMediaCreate,
      update: mocks.cmsMediaUpdate,
      updateMany: mocks.cmsMediaUpdateMany,
      delete: mocks.cmsMediaDelete,
    },
    cmsMediaFolder: {
      findMany: mocks.cmsMediaFolderFindMany,
      findUnique: mocks.cmsMediaFolderFindUnique,
      findFirst: mocks.cmsMediaFolderFindFirst,
      create: mocks.cmsMediaFolderCreate,
      update: mocks.cmsMediaFolderUpdate,
      delete: mocks.cmsMediaFolderDelete,
    },
  };
  client.$transaction = vi.fn((arg: unknown) =>
    typeof arg === "function" ? (arg as (tx: unknown) => unknown)(client) : Promise.all(arg as []),
  );
  return { prisma: client };
});

import { GET as listMedia, POST as uploadMedia } from "@/app/api/cms/media/route";
import {
  GET as getMedia,
  PATCH as patchMedia,
  DELETE as deleteMedia,
} from "@/app/api/cms/media/[id]/route";
import { POST as replaceMedia } from "@/app/api/cms/media/[id]/replace/route";
import { GET as listFolders, POST as createFolder } from "@/app/api/cms/media/folders/route";
import {
  PATCH as renameFolder,
  DELETE as deleteFolder,
} from "@/app/api/cms/media/folders/[id]/route";

const jsonRequest = (url: string, method: string, body?: unknown) =>
  new NextRequest(url, {
    method,
    ...(body !== undefined
      ? { headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) }
      : {}),
  });

const PNG_BYTES = new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0, 0, 0, 0]);

function formDataRequest(url: string, files: File[], extra?: Record<string, string>) {
  const formData = new FormData();
  files.forEach((file) => formData.append("files", file));
  Object.entries(extra ?? {}).forEach(([key, value]) => formData.append(key, value));
  return new NextRequest(url, { method: "POST", body: formData });
}

describe("Media Library API — authorization, validation, IDOR", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("GET /api/cms/media (list/search/filter/sort/pagination)", () => {
    it("rejects an unauthenticated read", async () => {
      mocks.requireCmsPermission.mockResolvedValue(null);
      const response = await listMedia(new NextRequest("http://localhost/api/cms/media"));
      expect(response.status).toBe(403);
      expect(mocks.cmsMediaFindMany).not.toHaveBeenCalled();
    });

    it("returns paginated items, total, pages and folders for an authorized read", async () => {
      mocks.requireCmsPermission.mockResolvedValue({ id: "admin-1" });
      mocks.cmsMediaFindMany.mockResolvedValue([{ id: "m1" }]);
      mocks.cmsMediaCount.mockResolvedValue(1);
      mocks.cmsMediaFolderFindMany.mockResolvedValue([{ id: "f1", name: "Hero" }]);

      const response = await listMedia(
        new NextRequest("http://localhost/api/cms/media?page=1&limit=24&sort=newest"),
      );
      expect(response.status).toBe(200);
      const body = await response.json();
      expect(body).toEqual({
        items: [{ id: "m1" }],
        total: 1,
        page: 1,
        pages: 1,
        folders: [{ id: "f1", name: "Hero" }],
      });
    });

    it("never fetches more than the capped page size regardless of client input", async () => {
      mocks.requireCmsPermission.mockResolvedValue({ id: "admin-1" });
      mocks.cmsMediaFindMany.mockResolvedValue([]);
      mocks.cmsMediaCount.mockResolvedValue(0);
      mocks.cmsMediaFolderFindMany.mockResolvedValue([]);

      await listMedia(new NextRequest("http://localhost/api/cms/media?limit=100000"));
      expect(mocks.cmsMediaFindMany).toHaveBeenCalledWith(expect.objectContaining({ take: 100 }));
    });
  });

  describe("POST /api/cms/media (upload)", () => {
    it("rejects an unauthorized upload before touching storage", async () => {
      mocks.requireCmsPermission.mockResolvedValue(null);
      const file = new File([PNG_BYTES], "photo.png", { type: "image/png" });
      const response = await uploadMedia(formDataRequest("http://localhost/api/cms/media", [file]));
      expect(response.status).toBe(403);
      expect(mocks.uploadMediaAssets).not.toHaveBeenCalled();
    });

    it("rejects upload into a folder that does not exist", async () => {
      mocks.requireCmsPermission.mockResolvedValue({ id: "admin-1" });
      mocks.cmsMediaFolderFindUnique.mockResolvedValue(null);
      const file = new File([PNG_BYTES], "photo.png", { type: "image/png" });
      const response = await uploadMedia(
        formDataRequest("http://localhost/api/cms/media", [file], { folder: "Nonexistent" }),
      );
      expect(response.status).toBe(400);
      expect(mocks.uploadMediaAssets).not.toHaveBeenCalled();
    });

    it("surfaces a validation error from the upload layer as 400, not a 500", async () => {
      mocks.requireCmsPermission.mockResolvedValue({ id: "admin-1" });
      const { UploadValidationError } = await import("@/lib/mediaStorage");
      mocks.uploadMediaAssets.mockRejectedValue(new UploadValidationError("File type not allowed"));
      const file = new File([PNG_BYTES], "photo.png", { type: "image/png" });
      const response = await uploadMedia(formDataRequest("http://localhost/api/cms/media", [file]));
      expect(response.status).toBe(400);
      expect((await response.json()).error).toBe("File type not allowed");
    });

    it("creates a media record for each uploaded asset on success and audits it", async () => {
      mocks.requireCmsPermission.mockResolvedValue({ id: "admin-1" });
      mocks.uploadMediaAssets.mockResolvedValue([
        {
          filename: "photo.png",
          publicId: "media/abcdef0123456789abcdef0123456789.png",
          url: "/uploads/media/abcdef0123456789abcdef0123456789.png",
          mimeType: "image/png",
          size: 12,
          width: 10,
          height: 10,
        },
      ]);
      mocks.cmsMediaCreate.mockResolvedValue({ id: "m1" });
      const file = new File([PNG_BYTES], "photo.png", { type: "image/png" });
      const response = await uploadMedia(formDataRequest("http://localhost/api/cms/media", [file]));
      expect(response.status).toBe(201);
      expect(mocks.cmsMediaCreate).toHaveBeenCalledOnce();
      expect(mocks.auditCmsAction).toHaveBeenCalledWith(
        expect.objectContaining({ action: "UPLOAD", entityType: "CmsMedia" }),
      );
    });

    it("rolls back the uploaded storage asset if the database write fails, and reports a clean 502 instead of a raw crash", async () => {
      mocks.requireCmsPermission.mockResolvedValue({ id: "admin-1" });
      const uploaded = [
        {
          filename: "photo.png",
          publicId: "media/abcdef0123456789abcdef0123456789.png",
          url: "/uploads/media/abcdef0123456789abcdef0123456789.png",
          mimeType: "image/png",
          size: 12,
        },
      ];
      mocks.uploadMediaAssets.mockResolvedValue(uploaded);
      mocks.cmsMediaCreate.mockRejectedValue(new Error("DB down"));
      const file = new File([PNG_BYTES], "photo.png", { type: "image/png" });
      const response = await uploadMedia(formDataRequest("http://localhost/api/cms/media", [file]));
      expect(response.status).toBe(502);
      expect(mocks.deleteMediaAsset).toHaveBeenCalledWith(
        "media/abcdef0123456789abcdef0123456789.png",
      );
    });

    it("never claims success when the storage provider itself is unreachable/misconfigured", async () => {
      mocks.requireCmsPermission.mockResolvedValue({ id: "admin-1" });
      mocks.uploadMediaAssets.mockRejectedValue(new Error("Must supply cloud_name"));
      const file = new File([PNG_BYTES], "photo.png", { type: "image/png" });
      const response = await uploadMedia(formDataRequest("http://localhost/api/cms/media", [file]));
      expect(response.status).toBe(502);
      expect((await response.json()).error).toMatch(/unavailable/i);
      expect(mocks.cmsMediaCreate).not.toHaveBeenCalled();
    });
  });

  describe("GET/PATCH/DELETE /api/cms/media/[id] (IDOR + metadata + safe deletion)", () => {
    it("rejects reading a specific media item without permission", async () => {
      mocks.requireCmsPermission.mockResolvedValue(null);
      const response = await getMedia(new NextRequest("http://localhost/x"), {
        params: Promise.resolve({ id: "m1" }),
      });
      expect(response.status).toBe(403);
      expect(mocks.cmsMediaFindUnique).not.toHaveBeenCalled();
    });

    it("returns 404 for a media id that does not exist (no information leak beyond that)", async () => {
      mocks.requireCmsPermission.mockResolvedValue({ id: "admin-1" });
      mocks.cmsMediaFindUnique.mockResolvedValue(null);
      const response = await getMedia(new NextRequest("http://localhost/x"), {
        params: Promise.resolve({ id: "does-not-exist" }),
      });
      expect(response.status).toBe(404);
    });

    it("rejects an unauthorized metadata update (IDOR attempt via arbitrary id)", async () => {
      mocks.requireCmsPermission.mockResolvedValue(null);
      const response = await patchMedia(
        jsonRequest("http://localhost/x", "PATCH", { title: "Hacked" }),
        { params: Promise.resolve({ id: "someone-elses-media" }) },
      );
      expect(response.status).toBe(403);
      expect(mocks.cmsMediaUpdate).not.toHaveBeenCalled();
    });

    it("rejects invalid metadata (e.g. oversized title) with 400", async () => {
      mocks.requireCmsPermission.mockResolvedValue({ id: "admin-1" });
      const response = await patchMedia(
        jsonRequest("http://localhost/x", "PATCH", { title: "a".repeat(500) }),
        { params: Promise.resolve({ id: "m1" }) },
      );
      expect(response.status).toBe(400);
      expect(mocks.cmsMediaUpdate).not.toHaveBeenCalled();
    });

    it("rejects moving media into a folder that does not exist", async () => {
      mocks.requireCmsPermission.mockResolvedValue({ id: "admin-1" });
      mocks.cmsMediaFindUnique.mockResolvedValue({ id: "m1", folder: null });
      mocks.cmsMediaFolderFindUnique.mockResolvedValue(null);
      const response = await patchMedia(
        jsonRequest("http://localhost/x", "PATCH", { folder: "Ghost folder" }),
        { params: Promise.resolve({ id: "m1" }) },
      );
      expect(response.status).toBe(400);
      expect(mocks.cmsMediaUpdate).not.toHaveBeenCalled();
    });

    it("saves valid metadata and audits the update", async () => {
      mocks.requireCmsPermission.mockResolvedValue({ id: "admin-1" });
      mocks.cmsMediaFindUnique.mockResolvedValue({ id: "m1", folder: null });
      mocks.cmsMediaUpdate.mockResolvedValue({ id: "m1", title: "New title", folder: null });
      const response = await patchMedia(
        jsonRequest("http://localhost/x", "PATCH", { title: "New title" }),
        { params: Promise.resolve({ id: "m1" }) },
      );
      expect(response.status).toBe(200);
      expect(mocks.auditCmsAction).toHaveBeenCalledWith(
        expect.objectContaining({ action: "UPDATE" }),
      );
    });

    it("labels the audit action MOVE when the folder actually changes", async () => {
      mocks.requireCmsPermission.mockResolvedValue({ id: "admin-1" });
      mocks.cmsMediaFindUnique.mockResolvedValue({ id: "m1", folder: "Old" });
      mocks.cmsMediaFolderFindUnique.mockResolvedValue({ id: "f2", name: "New" });
      mocks.cmsMediaUpdate.mockResolvedValue({ id: "m1", folder: "New" });
      await patchMedia(jsonRequest("http://localhost/x", "PATCH", { folder: "New" }), {
        params: Promise.resolve({ id: "m1" }),
      });
      expect(mocks.auditCmsAction).toHaveBeenCalledWith(
        expect.objectContaining({ action: "MOVE" }),
      );
    });

    it("rejects an unauthorized deletion", async () => {
      mocks.requireCmsPermission.mockResolvedValue(null);
      const response = await deleteMedia(new NextRequest("http://localhost/x"), {
        params: Promise.resolve({ id: "m1" }),
      });
      expect(response.status).toBe(403);
      expect(mocks.cmsMediaDelete).not.toHaveBeenCalled();
    });

    it("protects a referenced asset from deletion (409) and reports its usages", async () => {
      mocks.requireCmsPermission.mockResolvedValue({ id: "admin-1" });
      mocks.cmsMediaFindUnique.mockResolvedValue({ id: "m1", url: "https://x/img.png" });
      mocks.findMediaUsages.mockResolvedValue([
        { entityType: "CmsPageBlock", entityId: "b1", label: "home", path: "data" },
      ]);
      const response = await deleteMedia(new NextRequest("http://localhost/x"), {
        params: Promise.resolve({ id: "m1" }),
      });
      expect(response.status).toBe(409);
      expect(mocks.cmsMediaDelete).not.toHaveBeenCalled();
      const body = await response.json();
      expect(body.usages).toHaveLength(1);
    });

    it("deletes an unreferenced asset from both the database and storage", async () => {
      mocks.requireCmsPermission.mockResolvedValue({ id: "admin-1" });
      mocks.cmsMediaFindUnique.mockResolvedValue({
        id: "m1",
        url: "https://x/img.png",
        publicId: "media/abcdef0123456789abcdef0123456789.png",
      });
      mocks.findMediaUsages.mockResolvedValue([]);
      mocks.cmsMediaDelete.mockResolvedValue({});
      mocks.deleteMediaAsset.mockResolvedValue(undefined);
      const response = await deleteMedia(new NextRequest("http://localhost/x"), {
        params: Promise.resolve({ id: "m1" }),
      });
      expect(response.status).toBe(204);
      expect(mocks.cmsMediaDelete).toHaveBeenCalledWith({ where: { id: "m1" } });
      expect(mocks.deleteMediaAsset).toHaveBeenCalledWith(
        "media/abcdef0123456789abcdef0123456789.png",
      );
      expect(mocks.auditCmsAction).toHaveBeenCalledWith(
        expect.objectContaining({ action: "DELETE" }),
      );
    });

    it("does not claim success if storage deletion fails after the DB row was removed — restores the record instead", async () => {
      mocks.requireCmsPermission.mockResolvedValue({ id: "admin-1" });
      const before = {
        id: "m1",
        url: "https://x/img.png",
        publicId: "media/abcdef0123456789abcdef0123456789.png",
        filename: "img.png",
        mimeType: "image/png",
        size: 10,
        width: null,
        height: null,
        title: null,
        alt: null,
        caption: null,
        description: null,
        folder: null,
        createdBy: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      mocks.cmsMediaFindUnique.mockResolvedValue(before);
      mocks.findMediaUsages.mockResolvedValue([]);
      mocks.cmsMediaDelete.mockResolvedValue({});
      mocks.deleteMediaAsset.mockRejectedValue(new Error("Storage deletion failed"));
      mocks.cmsMediaCreate.mockResolvedValue(before);
      const response = await deleteMedia(new NextRequest("http://localhost/x"), {
        params: Promise.resolve({ id: "m1" }),
      });
      expect(response.status).toBe(502);
      expect(mocks.cmsMediaCreate).toHaveBeenCalledOnce();
      expect(mocks.auditCmsAction).not.toHaveBeenCalledWith(
        expect.objectContaining({ action: "DELETE" }),
      );
    });
  });

  describe("POST /api/cms/media/[id]/replace (safe replacement)", () => {
    it("rejects an unauthorized replacement", async () => {
      mocks.requireCmsPermission.mockResolvedValue(null);
      const file = new File([PNG_BYTES], "new.png", { type: "image/png" });
      const response = await replaceMedia(formDataRequest("http://localhost/x", [file]), {
        params: Promise.resolve({ id: "m1" }),
      });
      expect(response.status).toBe(403);
      expect(mocks.replaceMediaAsset).not.toHaveBeenCalled();
    });

    it("rejects a replacement that changes the media format (would break existing references)", async () => {
      mocks.requireCmsPermission.mockResolvedValue({ id: "admin-1" });
      mocks.cmsMediaFindUnique.mockResolvedValue({
        id: "m1",
        publicId: "media/abcdef0123456789abcdef0123456789.png",
        mimeType: "image/png",
      });
      const file = new File([PNG_BYTES], "new.jpg", { type: "image/jpeg" });
      const response = await replaceMedia(formDataRequest("http://localhost/x", [file]), {
        params: Promise.resolve({ id: "m1" }),
      });
      expect(response.status).toBe(400);
      expect(mocks.replaceMediaAsset).not.toHaveBeenCalled();
    });

    it("rejects replacing legacy media with no verified storage key", async () => {
      mocks.requireCmsPermission.mockResolvedValue({ id: "admin-1" });
      mocks.cmsMediaFindUnique.mockResolvedValue({
        id: "m1",
        publicId: null,
        mimeType: "image/png",
      });
      const file = new File([PNG_BYTES], "new.png", { type: "image/png" });
      const response = await replaceMedia(formDataRequest("http://localhost/x", [file]), {
        params: Promise.resolve({ id: "m1" }),
      });
      expect(response.status).toBe(409);
    });

    it("never claims success when the storage provider fails during replacement", async () => {
      mocks.requireCmsPermission.mockResolvedValue({ id: "admin-1" });
      mocks.cmsMediaFindUnique.mockResolvedValue({
        id: "m1",
        publicId: "media/abcdef0123456789abcdef0123456789.png",
        mimeType: "image/png",
      });
      mocks.replaceMediaAsset.mockRejectedValue(new Error("Must supply cloud_name"));
      const file = new File([PNG_BYTES], "new.png", { type: "image/png" });
      const response = await replaceMedia(formDataRequest("http://localhost/x", [file]), {
        params: Promise.resolve({ id: "m1" }),
      });
      expect(response.status).toBe(502);
      expect(mocks.cmsMediaUpdate).not.toHaveBeenCalled();
    });

    it("replaces the physical asset and audits it, preserving the media id/reference", async () => {
      mocks.requireCmsPermission.mockResolvedValue({ id: "admin-1" });
      mocks.cmsMediaFindUnique.mockResolvedValue({
        id: "m1",
        publicId: "media/abcdef0123456789abcdef0123456789.png",
        mimeType: "image/png",
      });
      mocks.replaceMediaAsset.mockResolvedValue({
        filename: "new.png",
        url: "/uploads/media/fedcba9876543210fedcba9876543210.png",
        mimeType: "image/png",
        size: 20,
      });
      mocks.cmsMediaUpdate.mockResolvedValue({
        id: "m1",
        url: "/uploads/media/fedcba9876543210fedcba9876543210.png",
      });
      const file = new File([PNG_BYTES], "new.png", { type: "image/png" });
      const response = await replaceMedia(formDataRequest("http://localhost/x", [file]), {
        params: Promise.resolve({ id: "m1" }),
      });
      expect(response.status).toBe(200);
      expect(mocks.cmsMediaUpdate).toHaveBeenCalledWith(
        expect.objectContaining({ where: { id: "m1" } }),
      );
      expect(mocks.auditCmsAction).toHaveBeenCalledWith(
        expect.objectContaining({ action: "REPLACE" }),
      );
    });
  });

  describe("Folders — create/rename/move/safe-delete", () => {
    it("rejects an unauthorized folder listing", async () => {
      mocks.requireCmsPermission.mockResolvedValue(null);
      const response = await listFolders();
      expect(response.status).toBe(403);
    });

    it("rejects unauthorized folder creation", async () => {
      mocks.requireCmsPermission.mockResolvedValue(null);
      const response = await createFolder(
        jsonRequest("http://localhost/x", "POST", { name: "Hero" }),
      );
      expect(response.status).toBe(403);
      expect(mocks.cmsMediaFolderCreate).not.toHaveBeenCalled();
    });

    it("rejects an invalid folder name", async () => {
      mocks.requireCmsPermission.mockResolvedValue({ id: "admin-1" });
      const response = await createFolder(
        jsonRequest("http://localhost/x", "POST", { name: "a/b" }),
      );
      expect(response.status).toBe(400);
      expect(mocks.cmsMediaFolderCreate).not.toHaveBeenCalled();
    });

    it("rejects creating a folder whose name already exists", async () => {
      mocks.requireCmsPermission.mockResolvedValue({ id: "admin-1" });
      mocks.cmsMediaFolderFindUnique.mockResolvedValue({ id: "f1", name: "Hero" });
      const response = await createFolder(
        jsonRequest("http://localhost/x", "POST", { name: "Hero" }),
      );
      expect(response.status).toBe(409);
    });

    it("creates a folder and audits it", async () => {
      mocks.requireCmsPermission.mockResolvedValue({ id: "admin-1" });
      mocks.cmsMediaFolderFindUnique.mockResolvedValue(null);
      mocks.cmsMediaFolderCreate.mockResolvedValue({ id: "f1", name: "Hero" });
      const response = await createFolder(
        jsonRequest("http://localhost/x", "POST", { name: "Hero" }),
      );
      expect(response.status).toBe(201);
      expect(mocks.auditCmsAction).toHaveBeenCalledWith(
        expect.objectContaining({ action: "CREATE", entityType: "CmsMediaFolder" }),
      );
    });

    it("renaming a folder cascades the new name onto every media item that referenced the old name (move)", async () => {
      mocks.requireCmsPermission.mockResolvedValue({ id: "admin-1" });
      mocks.cmsMediaFolderFindUnique.mockResolvedValue({ id: "f1", name: "Old" });
      mocks.cmsMediaFolderFindFirst.mockResolvedValue(null);
      mocks.cmsMediaFolderUpdate.mockResolvedValue({ id: "f1", name: "New" });
      mocks.cmsMediaUpdateMany.mockResolvedValue({ count: 3 });
      const response = await renameFolder(
        jsonRequest("http://localhost/x", "PATCH", { name: "New" }),
        { params: Promise.resolve({ id: "f1" }) },
      );
      expect(response.status).toBe(200);
      expect(mocks.cmsMediaUpdateMany).toHaveBeenCalledWith({
        where: { folder: "Old" },
        data: { folder: "New" },
      });
    });

    it("rejects unauthorized folder deletion", async () => {
      mocks.requireCmsPermission.mockResolvedValue(null);
      const response = await deleteFolder(new NextRequest("http://localhost/x"), {
        params: Promise.resolve({ id: "f1" }),
      });
      expect(response.status).toBe(403);
      expect(mocks.cmsMediaFolderDelete).not.toHaveBeenCalled();
    });

    it("does NOT silently delete media when deleting a non-empty folder — blocks with 409 instead", async () => {
      mocks.requireCmsPermission.mockResolvedValue({ id: "admin-1" });
      mocks.cmsMediaFolderFindUnique.mockResolvedValue({ id: "f1", name: "Hero" });
      mocks.cmsMediaCount.mockResolvedValue(2);
      const response = await deleteFolder(new NextRequest("http://localhost/x"), {
        params: Promise.resolve({ id: "f1" }),
      });
      expect(response.status).toBe(409);
      expect(mocks.cmsMediaFolderDelete).not.toHaveBeenCalled();
    });

    it("deletes an empty folder", async () => {
      mocks.requireCmsPermission.mockResolvedValue({ id: "admin-1" });
      mocks.cmsMediaFolderFindUnique.mockResolvedValue({ id: "f1", name: "Hero" });
      mocks.cmsMediaCount.mockResolvedValue(0);
      mocks.cmsMediaFolderDelete.mockResolvedValue({});
      const response = await deleteFolder(new NextRequest("http://localhost/x"), {
        params: Promise.resolve({ id: "f1" }),
      });
      expect(response.status).toBe(204);
      expect(mocks.cmsMediaFolderDelete).toHaveBeenCalledWith({ where: { id: "f1" } });
    });
  });

  describe("GET /api/cms/media/resolve", () => {
    it("requires read permission", async () => {
      mocks.requireCmsPermission.mockResolvedValue(null);
      const { POST: resolveMedia } = await import("@/app/api/cms/media/resolve/route");
      const response = await resolveMedia(
        jsonRequest("http://localhost/x", "POST", { urls: ["https://x/a.png"] }),
      );
      expect(response.status).toBe(403);
    });
  });
});
