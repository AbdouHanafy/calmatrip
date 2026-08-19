import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { sanitizeHtml } from "@/lib/sanitize";
import { communityPostSchema } from "@/schemas/community";
import { createPost, getAllPosts, getApprovedPosts } from "@/repositories/communityRepository";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const all = searchParams.get("all"); // admin only

  const session = await auth();

  if (all && session?.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (all) {
    const posts = await getAllPosts();
    return NextResponse.json(posts);
  }

  const posts = await getApprovedPosts();
  return NextResponse.json(posts);
}

export async function POST(req: NextRequest) {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const rawBody = await req.json();
  const parsed = communityPostSchema.safeParse(rawBody);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
  }
  const { content, image } = parsed.data;

  const post = await createPost({
    authorId: session.user.id,
    authorName: session.user.name ?? "Voyageur Calma Trip",
    authorAvatar: session.user.image ?? null,
    content: sanitizeHtml(content),
    image: image ?? null,
  });

  return NextResponse.json(post, { status: 201 });
}
