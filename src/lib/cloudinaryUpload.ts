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

export const MEDIA_UPLOAD_POLICY = {
  types: ["image/jpeg", "image/png", "image/webp", "image/gif"] as const,
  maxSize: 5 * 1024 * 1024,
  maxFiles: 20,
};

const extensions: Record<(typeof MEDIA_UPLOAD_POLICY.types)[number], readonly string[]> = {
  "image/jpeg": ["jpg", "jpeg"],
  "image/png": ["png"],
  "image/webp": ["webp"],
  "image/gif": ["gif"],
};

export class UploadValidationError extends Error {}

export type UploadedMediaAsset = {
  url: string;
  publicId: string;
  filename: string;
  mimeType: string;
  size: number;
  width?: number;
  height?: number;
};

function hasValidSignature(type: string, bytes: Uint8Array) {
  if (bytes.length < 12) return false;
  if (type === "image/jpeg") return bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
  if (type === "image/png")
    return bytes
      .slice(0, 8)
      .every((byte, index) => byte === [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a][index]);
  if (type === "image/gif")
    return ["GIF87a", "GIF89a"].includes(new TextDecoder().decode(bytes.slice(0, 6)));
  if (type === "image/webp")
    return (
      new TextDecoder().decode(bytes.slice(0, 4)) === "RIFF" &&
      new TextDecoder().decode(bytes.slice(8, 12)) === "WEBP"
    );
  return false;
}

export async function validateMediaFile(file: File) {
  if (!(MEDIA_UPLOAD_POLICY.types as readonly string[]).includes(file.type))
    throw new UploadValidationError(`File type ${file.type || "unknown"} is not allowed`);
  if (!file.size || file.size > MEDIA_UPLOAD_POLICY.maxSize)
    throw new UploadValidationError(
      `File ${file.name || "unnamed"} exceeds the 5 MB limit or is empty`,
    );
  if (
    !file.name ||
    file.name.length > 180 ||
    /[\\/\0-\x1f]/.test(file.name) ||
    file.name === "." ||
    file.name === ".."
  )
    throw new UploadValidationError("Invalid filename");
  const extension = file.name.split(".").pop()?.toLowerCase() ?? "";
  if (!extensions[file.type as keyof typeof extensions]?.includes(extension))
    throw new UploadValidationError("File extension does not match its media type");
  const buffer = Buffer.from(await file.arrayBuffer());
  if (!hasValidSignature(file.type, buffer))
    throw new UploadValidationError("File content does not match its declared media type");
  return buffer;
}

export async function uploadMediaAssets(files: File[]): Promise<UploadedMediaAsset[]> {
  if (!files?.length) throw new UploadValidationError("No files provided");
  if (files.length > MEDIA_UPLOAD_POLICY.maxFiles)
    throw new UploadValidationError(`Upload at most ${MEDIA_UPLOAD_POLICY.maxFiles} files at once`);
  const buffers = await Promise.all(files.map(validateMediaFile));
  const assets: UploadedMediaAsset[] = [];
  try {
    for (const [index, file] of files.entries()) {
      const result = await new Promise<{
        secure_url: string;
        public_id: string;
        bytes: number;
        width?: number;
        height?: number;
      }>((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: "calmatrip/uploads",
            resource_type: "image",
            use_filename: false,
            unique_filename: true,
            overwrite: false,
          },
          (error, value) =>
            error || !value ? reject(error ?? new Error("Upload failed")) : resolve(value as never),
        );
        stream.end(buffers[index]);
      });
      assets.push({
        url: result.secure_url,
        publicId: result.public_id,
        filename: file.name,
        mimeType: file.type,
        size: result.bytes || file.size,
        width: result.width,
        height: result.height,
      });
    }
  } catch (error) {
    await Promise.allSettled(assets.map((asset) => deleteMediaAsset(asset.publicId)));
    throw error;
  }
  return assets;
}

export async function uploadImages(files: File[]): Promise<string[]> {
  return (await uploadMediaAssets(files)).map((asset) => asset.url);
}

export async function deleteMediaAsset(publicId: string) {
  if (!/^calmatrip\/uploads\/[a-zA-Z0-9_-]+$/.test(publicId))
    throw new UploadValidationError("Invalid storage key");
  const result = await cloudinary.uploader.destroy(publicId, {
    resource_type: "image",
    invalidate: true,
  });
  if (!result || !["ok", "not found"].includes(result.result))
    throw new Error("Storage deletion failed");
}

export async function replaceMediaAsset(publicId: string, file: File): Promise<UploadedMediaAsset> {
  if (!/^calmatrip\/uploads\/[a-zA-Z0-9_-]+$/.test(publicId))
    throw new UploadValidationError("Invalid storage key");
  const buffer = await validateMediaFile(file);
  const result = await new Promise<{
    secure_url: string;
    public_id: string;
    bytes: number;
    width?: number;
    height?: number;
  }>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { public_id: publicId, resource_type: "image", overwrite: true, invalidate: true },
      (error, value) =>
        error || !value
          ? reject(error ?? new Error("Replacement failed"))
          : resolve(value as never),
    );
    stream.end(buffer);
  });
  return {
    url: result.secure_url,
    publicId: result.public_id,
    filename: file.name,
    mimeType: file.type,
    size: result.bytes || file.size,
    width: result.width,
    height: result.height,
  };
}
