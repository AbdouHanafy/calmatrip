// app/api/upload/route.ts
// Uploads images to Vercel Blob storage and returns their public URLs.
// Vercel's serverless functions have a read-only filesystem, so writing
// to /public/uploads/ (which worked locally) fails in production — this
// stores files in Vercel Blob instead, which is writable from any environment.

import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { randomUUID } from "crypto";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const MAX_SIZE = 5 * 1024 * 1024; // 5 MB per file

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const files = formData.getAll("files") as File[];

    if (!files || files.length === 0) {
      return NextResponse.json({ error: "No files provided" }, { status: 400 });
    }

    const urls: string[] = [];

    for (const file of files) {
      if (!ALLOWED_TYPES.includes(file.type)) {
        return NextResponse.json(
          { error: `File type ${file.type} is not allowed` },
          { status: 400 }
        );
      }

      if (file.size > MAX_SIZE) {
        return NextResponse.json(
          { error: `File ${file.name} exceeds the 5 MB limit` },
          { status: 400 }
        );
      }

      const ext = file.name.split(".").pop() ?? "jpg";
      const filename = `${randomUUID()}.${ext}`;

      const blob = await put(`uploads/${filename}`, file, {
        access: "public",
        contentType: file.type,
      });

      urls.push(blob.url);
    }

    return NextResponse.json({ urls });
  } catch (error) {
    console.error("[UPLOAD_POST]", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}