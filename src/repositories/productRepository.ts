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

export async function getProductById(id: number) {
  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) return null;

  const related = await prisma.product.findMany({
    where: { category: product.category, id: { not: product.id } },
    take: 4,
  });

  return { product, related };
}

interface CreateProductInput {
  name: string;
  price: number;
  category: string;
  image?: string | null;
  description: string;
  stock?: number;
  sizes?: string[] | typeof Prisma.JsonNull;
}

export async function createProduct(input: CreateProductInput) {
  return prisma.product.create({
    data: {
      name: input.name,
      price: input.price,
      category: input.category,
      image: input.image || "/placeholder-product.png",
      description: input.description,
      stock: input.stock ?? 100,
      sizes: input.sizes,
    },
  });
}

export async function updateProduct(id: number, data: Prisma.ProductUpdateInput) {
  return prisma.product.update({ where: { id }, data });
}

export async function deleteProduct(id: number) {
  return prisma.product.delete({ where: { id } });
}

export async function approveProduct(id: number) {
  return prisma.product.update({
    where: { id },
    data: { submissionStatus: "approved", rejectionReason: null },
  });
}

export async function rejectProduct(id: number, reason: string | null) {
  return prisma.product.update({
    where: { id },
    data: { submissionStatus: "rejected", rejectionReason: reason },
  });
}
