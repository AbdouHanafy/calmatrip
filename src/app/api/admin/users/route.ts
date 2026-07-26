import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function GET() {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const users = await prisma.user.findMany({
    where: { role: { in: ["USER", "ADMIN"] } },
    select: { id: true, name: true, email: true, role: true, createdAt: true, image: true },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(users);
}
