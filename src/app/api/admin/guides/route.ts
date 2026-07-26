import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { sanitizeHtml } from "@/lib/sanitize";

function slugify(title: string): string {
  return title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function GET() {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const guides = await prisma.practicalGuide.findMany({
    orderBy: [{ order: "asc" }, { title: "asc" }],
  });
  return NextResponse.json(guides);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  const title = typeof body.title === "string" ? body.title.trim() : "";
  const summary = typeof body.summary === "string" ? body.summary.trim() : "";
  const content = typeof body.content === "string" ? body.content.trim() : "";

  if (!title || !summary || !content) {
    return NextResponse.json({ error: "Titre, résumé et contenu requis" }, { status: 400 });
  }

  const baseSlug = slugify(title) || "guide";
  let slug = baseSlug;
  let suffix = 1;
  while (await prisma.practicalGuide.findUnique({ where: { slug } })) {
    suffix += 1;
    slug = `${baseSlug}-${suffix}`;
  }

  const guide = await prisma.practicalGuide.create({
    data: {
      title,
      slug,
      summary,
      content: sanitizeHtml(content),
      category: body.category || null,
      icon: body.icon || null,
      image: body.image || null,
      active: body.active ?? true,
    },
  });

  return NextResponse.json(guide, { status: 201 });
}
