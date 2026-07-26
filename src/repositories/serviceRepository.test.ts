import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { prisma } from "@/lib/prisma";
import { getPublicServices } from "./serviceRepository";

const MARKER = "VITEST_serviceRepository";
const createdIds: number[] = [];

beforeAll(async () => {
  const maxOrder = await prisma.service.aggregate({ _max: { order: true } });
  const base = (maxOrder._max.order ?? 0) + 100;

  const second = await prisma.service.create({
    data: {
      title: `${MARKER} Second`,
      description: "test",
      price: "10 TND",
      category: "Transport",
      submissionStatus: "approved",
      order: base + 2,
    },
  });
  const first = await prisma.service.create({
    data: {
      title: `${MARKER} First`,
      description: "test",
      price: "5 TND",
      category: "Transport",
      submissionStatus: "approved",
      order: base + 1,
    },
  });
  const pending = await prisma.service.create({
    data: {
      title: `${MARKER} Pending`,
      description: "test",
      price: "99 TND",
      category: "Transport",
      submissionStatus: "pending",
      order: base + 3,
    },
  });
  createdIds.push(second.id, first.id, pending.id);
});

afterAll(async () => {
  await prisma.service.deleteMany({ where: { id: { in: createdIds } } });
  await prisma.$disconnect();
});

describe("getPublicServices", () => {
  it("only returns approved services, never pending ones", async () => {
    const services = await getPublicServices();
    const titles = services.map((s) => s.title);
    expect(titles).toContain(`${MARKER} First`);
    expect(titles).toContain(`${MARKER} Second`);
    expect(titles).not.toContain(`${MARKER} Pending`);
  });

  it("orders results by the `order` field ascending", async () => {
    const services = await getPublicServices();
    const ours = services.filter((s) => s.title.startsWith(MARKER));
    expect(ours.map((s) => s.title)).toEqual([`${MARKER} First`, `${MARKER} Second`]);
  });
});
