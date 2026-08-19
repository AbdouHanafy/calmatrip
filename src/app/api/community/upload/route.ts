// app/api/community/upload/route.ts
// Uploads a community post photo to Cloudinary and returns its public URL.
// Open to any authenticated user (not admin/B2B-only, unlike the other upload routes).

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { uploadImages, UploadValidationError } from "@/lib/cloudinaryUpload";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const files = formData.getAll("files") as File[];
    const urls = await uploadImages(files);
    return NextResponse.json({ urls });
  } catch (error) {
    if (error instanceof UploadValidationError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    console.error("[COMMUNITY_UPLOAD_POST]", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
