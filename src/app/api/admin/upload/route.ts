// app/api/upload/route.ts
// Saves uploaded images to /public/uploads/ and returns their public URLs.
// No extra dependency needed — uses the built-in File API from Next.js.

import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
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

    const uploadDir = join(process.cwd(), "public", "uploads");
    await mkdir(uploadDir, { recursive: true });

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
      const bytes = await file.arrayBuffer();
      await writeFile(join(uploadDir, filename), Buffer.from(bytes));
      urls.push(`/uploads/${filename}`);
    }

    return NextResponse.json({ urls });
  } catch (error) {
    console.error("[UPLOAD_POST]", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}