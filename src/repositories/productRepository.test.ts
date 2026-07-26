import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { prisma } from "@/lib/prisma";
import { getPublicProducts } from "./productRepository";

// Integration test: hits the real Prisma/MySQL connection configured in
// .env (the portable local instance). Creates its own isolated rows with a
// distinctive name marker and deletes exactly those rows afterwards —
// never touches pre-existing data.
const MARKER = "VITEST_productRepository";
const createdIds: number[] = [];

beforeAll(async () => {
  const approvedCheap = await prisma.product.create({
    data: {
      name: `${MARKER} Cheap Rug`,
      price: 20,
      category: `${MARKER}_Home`,
      description: "A cheap test rug",
      stock: 5,
      submissionStatus: "approved",
    },
  });
  const approvedExpensive = await prisma.product.create({
    data: {
      name: `${MARKER} Expensive Vase`,
      price: 200,
      category: `${MARKER}_Decor`,
      description: "An expensive test vase",
      stock: 2,
      submissionStatus: "approved",
    },
  });
  const pending = await prisma.product.create({
    data: {
      name: `${MARKER} Pending Item`,
      price: 50,
      category: `${MARKER}_Home`,
      description: "Should never be publicly visible",
      stock: 1,
      submissionStatus: "pending",
    },
  });
  createdIds.push(approvedCheap.id, approvedExpensive.id, pending.id);
});

afterAll(async () => {
  await prisma.product.deleteMany({ where: { id: { in: createdIds } } });
  await prisma.$disconnect();
});

describe("getPublicProducts", () => {
  it("only returns approved products, never pending ones", async () => {
    const { products } = await getPublicProducts({ search: MARKER });
    const names = products.map((p) => p.name);
    expect(names).toContain(`${MARKER} Cheap Rug`);
    expect(names).toContain(`${MARKER} Expensive Vase`);
    expect(names).not.toContain(`${MARKER} Pending Item`);
  });

  it("filters by category", async () => {
    const { products } = await getPublicProducts({ search: MARKER, category: `${MARKER}_Decor` });
    expect(products).toHaveLength(1);
    expect(products[0].name).toBe(`${MARKER} Expensive Vase`);
  });

  it("filters by search term against name and description", async () => {
    const { products } = await getPublicProducts({ search: "Expensive Vase" });
    const names = products.map((p) => p.name);
    expect(names).toContain(`${MARKER} Expensive Vase`);
    expect(names).not.toContain(`${MARKER} Cheap Rug`);
  });

  it("sorts by price ascending", async () => {
    const { products } = await getPublicProducts({ search: MARKER, sort: "price_asc" });
    const prices = products.map((p) => p.price);
    expect(prices).toEqual([...prices].sort((a, b) => a - b));
  });

  it("sorts by price descending", async () => {
    const { products } = await getPublicProducts({ search: MARKER, sort: "price_desc" });
    const prices = products.map((p) => p.price);
    expect(prices).toEqual([...prices].sort((a, b) => b - a));
  });

  it("returns distinct approved categories only", async () => {
    const { categories } = await getPublicProducts({ search: MARKER });
    expect(categories).toContain(`${MARKER}_Home`);
    expect(categories).toContain(`${MARKER}_Decor`);
    // no duplicates
    expect(new Set(categories).size).toBe(categories.length);
  });
});
