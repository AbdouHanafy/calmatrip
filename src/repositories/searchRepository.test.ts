import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { prisma } from "@/lib/prisma";
import { searchCatalog } from "./searchRepository";

const MARKER = "VITESTsearchRepo";
const ids = {
  services: [] as number[],
  listings: [] as number[],
  products: [] as number[],
  destinations: [] as number[],
};
let linkedId = 0;
let everywhereId = 0;
let elsewhereId = 0;

beforeAll(async () => {
  const [here, there] = await Promise.all([
    prisma.destination.create({ data: { name: `${MARKER}Here`, description: "" } }),
    prisma.destination.create({ data: { name: `${MARKER}There`, description: "" } }),
  ]);
  ids.destinations.push(here.id, there.id);

  const base = { description: "test", price: "10 TND", submissionStatus: "approved" };
  const linked = await prisma.service.create({
    data: { ...base, title: `${MARKER} linked`, destinations: { connect: { id: here.id } } },
  });
  const everywhere = await prisma.service.create({
    data: { ...base, title: `${MARKER} everywhere` },
  });
  const elsewhere = await prisma.service.create({
    data: { ...base, title: `${MARKER} elsewhere`, destinations: { connect: { id: there.id } } },
  });
  const pending = await prisma.service.create({
    data: { ...base, title: `${MARKER} pending`, submissionStatus: "pending" },
  });
  const inactive = await prisma.service.create({
    data: { ...base, title: `${MARKER} inactive`, active: false },
  });
  linkedId = linked.id;
  everywhereId = everywhere.id;
  elsewhereId = elsewhere.id;
  ids.services.push(linked.id, everywhere.id, elsewhere.id, pending.id, inactive.id);

  // Matches on city only — the title doesn't contain the marker.
  const listing = await prisma.exploreListing.create({
    data: {
      title: "Some listing",
      description: "test",
      category: "Sight",
      city: `${MARKER}Here`,
      submissionStatus: "approved",
    },
  });
  ids.listings.push(listing.id);

  const product = await prisma.product.create({
    data: {
      name: "Some product",
      price: 10,
      category: `${MARKER}Ceramics`,
      description: "test",
      submissionStatus: "approved",
    },
  });
  ids.products.push(product.id);
});

afterAll(async () => {
  await prisma.service.deleteMany({ where: { id: { in: ids.services } } });
  await prisma.exploreListing.deleteMany({ where: { id: { in: ids.listings } } });
  await prisma.product.deleteMany({ where: { id: { in: ids.products } } });
  await prisma.destination.deleteMany({ where: { id: { in: ids.destinations } } });
  await prisma.$disconnect();
});

const serviceIds = (r: Awaited<ReturnType<typeof searchCatalog>>) =>
  r.services.map((s) => s.id).filter((id) => ids.services.includes(id));

describe("searchCatalog — text", () => {
  it("returns only approved, active services", async () => {
    const found = serviceIds(await searchCatalog({ q: MARKER }));
    expect(found.sort()).toEqual([linkedId, everywhereId, elsewhereId].sort());
  });

  it("matches explore listings on their city", async () => {
    const { listings } = await searchCatalog({ q: MARKER });
    expect(listings.map((l) => l.id)).toEqual(ids.listings);
  });

  it("matches products on their category", async () => {
    const { products } = await searchCatalog({ q: MARKER });
    expect(products.map((p) => p.id)).toEqual(ids.products);
  });

  it("is case-insensitive", async () => {
    expect(serviceIds(await searchCatalog({ q: MARKER.toLowerCase() }))).toContain(linkedId);
  });
});

describe("searchCatalog — destination", () => {
  it("returns services linked to it plus services with no destination", async () => {
    const found = serviceIds(await searchCatalog({ destination: `${MARKER}Here` }));
    expect(found).toContain(linkedId);
    expect(found).toContain(everywhereId);
    expect(found).not.toContain(elsewhereId);
  });

  it("filters listings by city", async () => {
    const { listings } = await searchCatalog({ destination: `${MARKER}There` });
    expect(listings.map((l) => l.id)).not.toContain(ids.listings[0]);
  });

  it("never returns products without a text query", async () => {
    const { products } = await searchCatalog({ destination: `${MARKER}Here` });
    expect(products).toEqual([]);
  });

  it("respects the take limit", async () => {
    const { services } = await searchCatalog({ take: 1 });
    expect(services.length).toBeLessThanOrEqual(1);
  });
});
