import { beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";

const mocks = vi.hoisted(() => ({
  permission: vi.fn(),
  record: vi.fn(),
  audit: vi.fn(),
  snapshot: vi.fn(),
  navigationFindMany: vi.fn(),
  navigationFindUnique: vi.fn(),
  navigationFindFirst: vi.fn(),
  navigationCreate: vi.fn(),
  navigationUpdate: vi.fn(),
  navigationDelete: vi.fn(),
  itemFindMany: vi.fn(),
  itemFindUnique: vi.fn(),
  itemFindFirst: vi.fn(),
  itemCreate: vi.fn(),
  itemUpdate: vi.fn(),
  itemDelete: vi.fn(),
  itemCount: vi.fn(),
  pageFindUnique: vi.fn(),
  transaction: vi.fn(),
}));

vi.mock("@/features/cms/services/server", () => ({
  requireCmsPermission: mocks.permission,
  auditCmsAction: mocks.audit,
}));
vi.mock("@/features/cms/services/navigationMutation", () => ({
  recordNavigationChange: mocks.record,
}));
vi.mock("@/features/cms/services/navigation", async () => {
  const actual = await vi.importActual<typeof import("@/features/cms/services/navigation")>(
    "@/features/cms/services/navigation",
  );
  return { ...actual, navigationSnapshot: mocks.snapshot };
});
vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
  revalidateTag: vi.fn(),
  unstable_cache: (fn: unknown) => fn,
}));
vi.mock("@/lib/prisma", () => ({
  prisma: {
    cmsNavigation: {
      findMany: mocks.navigationFindMany,
      findUnique: mocks.navigationFindUnique,
      findFirst: mocks.navigationFindFirst,
      create: mocks.navigationCreate,
      update: mocks.navigationUpdate,
      delete: mocks.navigationDelete,
    },
    cmsNavigationItem: {
      findMany: mocks.itemFindMany,
      findUnique: mocks.itemFindUnique,
      findFirst: mocks.itemFindFirst,
      create: mocks.itemCreate,
      update: mocks.itemUpdate,
      delete: mocks.itemDelete,
      count: mocks.itemCount,
    },
    cmsPage: { findUnique: mocks.pageFindUnique },
    $transaction: mocks.transaction,
  },
}));

import { GET as list, POST as create } from "@/app/api/cms/navigation/route";
import {
  GET as read,
  PATCH as update,
  DELETE as remove,
} from "@/app/api/cms/navigation/[id]/route";
import { POST as createItem } from "@/app/api/cms/navigation/[id]/items/route";
import {
  PATCH as updateItem,
  DELETE as removeItem,
} from "@/app/api/cms/navigation/[id]/items/[itemId]/route";
import { POST as reorder } from "@/app/api/cms/navigation/[id]/reorder/route";

const request = (method: string, body?: unknown) =>
  new NextRequest("http://localhost/test", {
    method,
    ...(body
      ? { headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) }
      : {}),
  });
const context = { params: Promise.resolve({ id: "nav-a" }) };
const itemContext = { params: Promise.resolve({ id: "nav-a", itemId: "item-a" }) };
const validItem = {
  label: { fr: "Services" },
  type: "CUSTOM",
  url: "/services",
  target: "_self",
  visible: true,
  parentId: null,
  position: 0,
};

describe("Navigation Builder API", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.transaction.mockImplementation((values: Promise<unknown>[]) => Promise.all(values));
  });

  it("protects list, create, update and delete server-side", async () => {
    mocks.permission.mockResolvedValue(null);
    expect((await list()).status).toBe(403);
    expect((await create(request("POST", { name: "Main", key: "main" }))).status).toBe(403);
    expect((await update(request("PATCH", { name: "Main" }), context)).status).toBe(403);
    expect((await remove(request("DELETE"), context)).status).toBe(403);
  });

  it("creates and audits a valid navigation", async () => {
    mocks.permission.mockResolvedValue({ id: "admin" });
    mocks.navigationFindUnique.mockResolvedValue(null);
    mocks.navigationCreate.mockResolvedValue({ id: "nav-a" });
    expect((await create(request("POST", { name: "Main", key: "main" }))).status).toBe(201);
    expect(mocks.record).toHaveBeenCalledWith(
      expect.objectContaining({ action: "CREATE", navigationId: "nav-a" }),
    );
  });

  it("reads, updates and deletes only existing navigation IDs", async () => {
    mocks.permission.mockResolvedValue({ id: "admin" });
    mocks.snapshot.mockResolvedValue({ id: "nav-a", status: "DRAFT" });
    mocks.navigationFindUnique.mockResolvedValue({ id: "nav-a", status: "DRAFT" });
    mocks.navigationUpdate.mockResolvedValue({ id: "nav-a", status: "PUBLISHED" });
    expect((await read(request("GET"), context)).status).toBe(200);
    expect((await update(request("PATCH", { status: "PUBLISHED" }), context)).status).toBe(200);
    mocks.navigationDelete.mockResolvedValue({});
    expect((await remove(request("DELETE"), context)).status).toBe(204);
  });

  it("rejects an item whose parent belongs to another navigation", async () => {
    mocks.permission.mockResolvedValue({ id: "admin" });
    mocks.navigationFindUnique.mockResolvedValue({ id: "nav-a" });
    mocks.itemFindUnique.mockResolvedValue({ id: "parent", navigationId: "nav-b" });
    const response = await createItem(
      request("POST", { ...validItem, parentId: "cm1234567890123456789012345" }),
      context,
    );
    expect(response.status).toBe(400);
    expect(mocks.itemCreate).not.toHaveBeenCalled();
  });

  it("rejects a missing page reference and accepts a valid one", async () => {
    mocks.permission.mockResolvedValue({ id: "admin" });
    mocks.navigationFindUnique.mockResolvedValue({ id: "nav-a" });
    mocks.pageFindUnique.mockResolvedValueOnce(null);
    const pageItem = { ...validItem, type: "PAGE", url: "", pageId: "cm1234567890123456789012345" };
    expect((await createItem(request("POST", pageItem), context)).status).toBe(400);
    mocks.pageFindUnique.mockResolvedValue({ id: pageItem.pageId });
    mocks.itemCount.mockResolvedValue(0);
    mocks.itemCreate.mockResolvedValue({ id: "item-a" });
    expect((await createItem(request("POST", pageItem), context)).status).toBe(201);
  });

  it("prevents cross-navigation item update and deletion (IDOR)", async () => {
    mocks.permission.mockResolvedValue({ id: "admin" });
    mocks.itemFindFirst.mockResolvedValue(null);
    expect((await updateItem(request("PATCH", validItem), itemContext)).status).toBe(404);
    expect((await removeItem(request("DELETE"), itemContext)).status).toBe(404);
    expect(mocks.itemUpdate).not.toHaveBeenCalled();
    expect(mocks.itemDelete).not.toHaveBeenCalled();
  });

  it("rejects self-parenting and circular ancestry", async () => {
    mocks.permission.mockResolvedValue({ id: "admin" });
    mocks.itemFindFirst.mockResolvedValue({ id: "item-a", navigationId: "nav-a", parentId: null });
    const response = await updateItem(
      request("PATCH", { ...validItem, parentId: "item-a" }),
      itemContext,
    );
    expect(response.status).toBe(400);
    expect(mocks.itemUpdate).not.toHaveBeenCalled();
  });

  it("updates and deletes valid items with audit/revision recording", async () => {
    mocks.permission.mockResolvedValue({ id: "admin" });
    mocks.itemFindFirst.mockResolvedValue({
      id: "item-a",
      navigationId: "nav-a",
      parentId: null,
      _count: { children: 0 },
    });
    mocks.itemUpdate.mockResolvedValue({ id: "item-a", parentId: null });
    mocks.itemDelete.mockResolvedValue({});
    expect((await updateItem(request("PATCH", validItem), itemContext)).status).toBe(200);
    expect((await removeItem(request("DELETE"), itemContext)).status).toBe(204);
    expect(mocks.record).toHaveBeenCalledWith(
      expect.objectContaining({ navigationId: "nav-a", entityType: "CmsNavigationItem" }),
    );
  });

  it("persists a valid complete tree and rejects foreign IDs", async () => {
    mocks.permission.mockResolvedValue({ id: "admin" });
    mocks.itemFindMany.mockResolvedValue([{ id: "item-a" }, { id: "item-b" }]);
    mocks.itemUpdate.mockResolvedValue({});
    const valid = {
      items: [
        { id: "item-a", parentId: null, position: 0 },
        { id: "item-b", parentId: "item-a", position: 0 },
      ],
    };
    expect((await reorder(request("POST", valid), context)).status).toBe(200);
    expect(mocks.transaction).toHaveBeenCalledOnce();
    const invalid = {
      items: [
        { id: "item-a", parentId: null, position: 0 },
        { id: "foreign", parentId: null, position: 1 },
      ],
    };
    expect((await reorder(request("POST", invalid), context)).status).toBe(400);
  });
});
