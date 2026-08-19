import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { deletePost, getPostById } from "@/repositories/communityRepository";

// DELETE /api/community/[id] — admin, or the post's own author
export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const post = await getPostById(Number(id));
  if (!post) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  if (session.user.role !== "ADMIN" && post.authorId !== session.user.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await deletePost(Number(id));

  return NextResponse.json({ success: true });
}
