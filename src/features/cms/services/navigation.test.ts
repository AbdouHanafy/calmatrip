import { describe, expect, it } from "vitest";
import { buildPublicNavigationTree, validateNavigationOrder } from "./navigation";
import { navigationItemInputSchema, navigationInputSchema } from "../schemas/navigationSchemas";

describe("navigation validation", () => {
  const label = { fr: "Accueil" };

  it("accepts stable kebab-case navigation keys", () => {
    expect(navigationInputSchema.safeParse({ name: "Main", key: "main-header" }).success).toBe(
      true,
    );
  });

  it("rejects unsafe or unstable navigation keys", () => {
    expect(navigationInputSchema.safeParse({ name: "Main", key: "Main Header" }).success).toBe(
      false,
    );
  });

  it.each(["https://example.com", "http://localhost:3000/test"])(
    "accepts supported external URL %s",
    (url) => {
      expect(navigationItemInputSchema.safeParse({ label, type: "EXTERNAL", url }).success).toBe(
        true,
      );
    },
  );

  it.each(["javascript:alert(1)", "data:text/html,test", "vbscript:msgbox(1)", "not-a-url"])(
    "rejects dangerous or invalid external URL %s",
    (url) => {
      expect(navigationItemInputSchema.safeParse({ label, type: "EXTERNAL", url }).success).toBe(
        false,
      );
    },
  );

  it("accepts a rooted internal path and rejects protocol-relative paths", () => {
    expect(
      navigationItemInputSchema.safeParse({ label, type: "CUSTOM", url: "/services" }).success,
    ).toBe(true);
    expect(
      navigationItemInputSchema.safeParse({ label, type: "CUSTOM", url: "//evil.test" }).success,
    ).toBe(false);
  });
});

describe("validateNavigationOrder", () => {
  it("accepts deterministic sibling ordering and nesting", () => {
    expect(
      validateNavigationOrder(
        ["a", "b", "c"],
        [
          { id: "a", parentId: null, position: 0 },
          { id: "b", parentId: null, position: 1 },
          { id: "c", parentId: "b", position: 0 },
        ],
      ),
    ).toBeNull();
  });

  it("rejects missing, duplicate and foreign items", () => {
    expect(validateNavigationOrder(["a", "b"], [{ id: "a", parentId: null, position: 0 }])).toMatch(
      /every/i,
    );
    expect(
      validateNavigationOrder(["a"], [{ id: "foreign", parentId: null, position: 0 }]),
    ).toMatch(/invalid|every/i);
  });

  it("rejects self-parenting and circular hierarchies", () => {
    expect(validateNavigationOrder(["a"], [{ id: "a", parentId: "a", position: 0 }])).toMatch(
      /own parent/i,
    );
    expect(
      validateNavigationOrder(
        ["a", "b", "c"],
        [
          { id: "a", parentId: "c", position: 0 },
          { id: "b", parentId: "a", position: 0 },
          { id: "c", parentId: "b", position: 0 },
        ],
      ),
    ).toMatch(/circular/i);
  });

  it("rejects duplicate positions among siblings", () => {
    expect(
      validateNavigationOrder(
        ["a", "b"],
        [
          { id: "a", parentId: null, position: 0 },
          { id: "b", parentId: null, position: 0 },
        ],
      ),
    ).toMatch(/positions/i);
  });
});

describe("public navigation rendering", () => {
  const base = { label: { fr: "Item" }, target: "_self", page: null };

  it("renders published page references with their current slug in saved order", () => {
    const tree = buildPublicNavigationTree([
      { ...base, id: "second", parentId: null, position: 1, type: "CUSTOM", url: "/second" },
      {
        ...base,
        id: "first",
        parentId: null,
        position: 0,
        type: "PAGE",
        url: "",
        page: { slug: "new-slug", locale: "fr", status: "PUBLISHED" },
      },
    ]);
    expect(tree.map((item) => item.id)).toEqual(["first", "second"]);
    expect(tree[0].href).toBe("/new-slug");
  });

  it("hides unpublished, archived and missing page references", () => {
    const tree = buildPublicNavigationTree([
      {
        ...base,
        id: "draft",
        parentId: null,
        position: 0,
        type: "PAGE",
        url: "",
        page: { slug: "draft", locale: "fr", status: "DRAFT" },
      },
      {
        ...base,
        id: "archived",
        parentId: null,
        position: 1,
        type: "PAGE",
        url: "",
        page: { slug: "old", locale: "fr", status: "ARCHIVED" },
      },
      { ...base, id: "missing", parentId: null, position: 2, type: "PAGE", url: "" },
    ]);
    expect(tree).toEqual([]);
  });

  it("builds nested groups and preserves safe external targets", () => {
    const tree = buildPublicNavigationTree([
      { ...base, id: "group", parentId: null, position: 0, type: "GROUP", url: "" },
      {
        ...base,
        id: "child",
        parentId: "group",
        position: 0,
        type: "EXTERNAL",
        url: "https://example.com",
        target: "_blank",
      },
    ]);
    expect(tree[0].href).toBeNull();
    expect(tree[0].children[0]).toMatchObject({ href: "https://example.com", target: "_blank" });
  });
});
