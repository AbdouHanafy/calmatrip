// app/api/b2b/upload/route.ts
// Uploads images to Cloudinary (B2B partners — profile photo, listing photos)
// and returns their public URLs.

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { uploadImages, UploadValidationError } from "@/lib/mediaStorage";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (session?.user?.role !== "B2B") {
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
    console.error("[B2B_UPLOAD_POST]", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
