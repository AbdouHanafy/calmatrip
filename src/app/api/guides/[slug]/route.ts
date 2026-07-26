import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const guide = await prisma.practicalGuide.findUnique({ where: { slug } });

  if (!guide || !guide.active) {
    return NextResponse.json({ error: "Guide introuvable" }, { status: 404 });
  }

  return NextResponse.json(guide);
}
