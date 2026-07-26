import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

// GET /api/admin/marketplace/dashboard
export async function GET() {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const [totalProducts, lowStockProducts, totalOrders, orders, products] = await Promise.all([
      prisma.product.count(),
      prisma.product.count({ where: { stock: { lte: 5 } } }),
      prisma.order.count(),
      prisma.order.findMany({ include: { items: true }, orderBy: { createdAt: "desc" }, take: 8 }),
      prisma.product.findMany(),
    ]);

    const revenue = await prisma.order.aggregate({
      _sum: { total: true },
      where: { status: { in: ["confirmed", "shipped", "delivered"] } },
    });

    const pendingOrders = await prisma.order.count({ where: { status: "pending" } });

    // Top produits par quantité vendue (depuis order_items)
    const orderItems = await prisma.orderItem.groupBy({
      by: ["productId", "productName"],
      _sum: { quantity: true },
      orderBy: { _sum: { quantity: "desc" } },
      take: 5,
    });

    const maxQty = orderItems[0]?._sum.quantity || 1;
    const topProducts = orderItems.map((item) => ({
      name: item.productName,
      sold: item._sum.quantity || 0,
      percent: Math.round(((item._sum.quantity || 0) / maxQty) * 100),
    }));

    const categoriesCount = products.reduce((acc: Record<string, number>, p) => {
      acc[p.category] = (acc[p.category] || 0) + 1;
      return acc;
    }, {});

    return NextResponse.json({
      stats: {
        totalProducts,
        lowStockProducts,
        totalOrders,
        pendingOrders,
        revenue: revenue._sum.total || 0,
      },
      recentOrders: orders,
      topProducts,
      categoriesCount,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to fetch dashboard" }, { status: 500 });
  }
}
