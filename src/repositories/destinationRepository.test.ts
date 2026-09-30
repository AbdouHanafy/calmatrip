import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { prisma } from "@/lib/prisma";
import {
  createDestination,
  getActiveDestinations,
  updateDestination,
} from "./destinationRepository";

const MARKER = "VITEST_destinationRepo";
const ids: number[] = [];

beforeAll(async () => {
  const active = await createDestination({
    name: `${MARKER} Active`,
    description: "",
    active: true,
  });
  const inactive = await createDestination({
    name: `${MARKER} Inactive`,
    description: "",
    active: false,
  });
  ids.push(active.id, inactive.id);
});

afterAll(async () => {
  await prisma.destination.deleteMany({ where: { id: { in: ids } } });
  await prisma.$disconnect();
});

describe("destinationRepository", () => {
  it("createDestination appends after the current last order", async () => {
    const rows = await prisma.destination.findMany({ where: { id: { in: ids } } });
    const [a, b] = ids.map((id) => rows.find((r) => r.id === id)!);
    expect(b.order).toBe(a.order + 1);
  });

  it("getActiveDestinations excludes inactive ones", async () => {
    const names = (await getActiveDestinations()).map((d) => d.name);
    expect(names).toContain(`${MARKER} Active`);
    expect(names).not.toContain(`${MARKER} Inactive`);
  });

  it("reflects an admin toggling a destination on", async () => {
    await updateDestination(ids[1], { active: true });
    const names = (await getActiveDestinations()).map((d) => d.name);
    expect(names).toContain(`${MARKER} Inactive`);
  });
});
