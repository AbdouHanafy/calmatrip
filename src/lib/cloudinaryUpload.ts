// lib/cloudinaryUpload.ts
// Shared image-upload helper — Vercel's serverless functions have a
// read-only filesystem, so this uploads to Cloudinary instead of writing
// to /public/uploads/, which works from any environment.

import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const MAX_SIZE = 5 * 1024 * 1024; // 5 MB per file

export class UploadValidationError extends Error {}

export async function uploadImages(files: File[]): Promise<string[]> {
  if (!files || files.length === 0) {
    throw new UploadValidationError("No files provided");
  }

  const urls: string[] = [];

  for (const file of files) {
    if (!ALLOWED_TYPES.includes(file.type)) {
      throw new UploadValidationError(`File type ${file.type} is not allowed`);
    }
    if (file.size > MAX_SIZE) {
      throw new UploadValidationError(`File ${file.name} exceeds the 5 MB limit`);
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadResult = await new Promise<{ secure_url: string }>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: "calmatrip/uploads", resource_type: "image" },
        (error, result) => {
          if (error || !result) return reject(error ?? new Error("Upload failed"));
          resolve(result as { secure_url: string });
        },
      );
      stream.end(buffer);
    });

    urls.push(uploadResult.secure_url);
  }

  return urls;
}
