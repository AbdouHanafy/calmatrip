import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

interface ProductListFilters {
  search?: string;
  category?: string;
  sort?: string;
}

export async function getPublicProducts({
  search = "",
  category = "",
  sort = "newest",
}: ProductListFilters) {
  const where: Prisma.ProductWhereInput = { submissionStatus: "approved" };
  if (search) {
    where.OR = [{ name: { contains: search } }, { description: { contains: search } }];
  }
  if (category && category !== "all") {
    where.category = category;
  }

  const orderBy: Prisma.ProductOrderByWithRelationInput =
    sort === "price_asc"
      ? { price: "asc" }
      : sort === "price_desc"
        ? { price: "desc" }
        : sort === "name"
          ? { name: "asc" }
          : { createdAt: "desc" };

  const [products, categoryRows] = await Promise.all([
    prisma.product.findMany({ where, orderBy }),
    prisma.product.findMany({
      where: { submissionStatus: "approved" },
      select: { category: true },
      distinct: ["category"],
    }),
  ]);

  return {
    products,
    categories: categoryRows.map((c) => c.category),
  };
}
