import { readFile } from "node:fs/promises";
import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import {
  UploadValidationError,
  deleteMediaAsset,
  uploadMediaAssets,
  validateMediaFile,
} from "./mediaStorage";

// Real magic bytes for each allowed format, plus a minimal valid tail so the
// files aren't empty. These are pure validation-logic tests — no network
// call is involved (this backend is local disk, not a remote provider), and
// none of these write a file.
const PNG_BYTES = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0, 0, 0, 0]);
const JPEG_BYTES = Buffer.from([0xff, 0xd8, 0xff, 0xe0, 0, 0, 0, 0, 0, 0, 0, 0]);
const GIF_BYTES = Buffer.from("GIF89a" + "\0".repeat(6));
const WEBP_BYTES = Buffer.concat([
  Buffer.from("RIFF"),
  Buffer.from([0, 0, 0, 0]),
  Buffer.from("WEBP"),
]);

function makeFile(bytes: Buffer, name: string, type: string) {
  return new File([new Uint8Array(bytes)], name, { type });
}

describe("validateMediaFile", () => {
  it("accepts a real PNG with matching extension and signature", async () => {
    const file = makeFile(PNG_BYTES, "photo.png", "image/png");
    await expect(validateMediaFile(file)).resolves.toBeInstanceOf(Buffer);
  });

  it("accepts a real JPEG", async () => {
    const file = makeFile(JPEG_BYTES, "photo.jpg", "image/jpeg");
    await expect(validateMediaFile(file)).resolves.toBeInstanceOf(Buffer);
  });

  it("accepts a real GIF", async () => {
    const file = makeFile(GIF_BYTES, "photo.gif", "image/gif");
    await expect(validateMediaFile(file)).resolves.toBeInstanceOf(Buffer);
  });

  it("accepts a real WebP", async () => {
    const file = makeFile(WEBP_BYTES, "photo.webp", "image/webp");
    await expect(validateMediaFile(file)).resolves.toBeInstanceOf(Buffer);
  });

  it("rejects a disallowed MIME type (e.g. SVG) outright", async () => {
    const file = makeFile(Buffer.from("<svg></svg>"), "image.svg", "image/svg+xml");
    await expect(validateMediaFile(file)).rejects.toBeInstanceOf(UploadValidationError);
  });

  it("rejects a file over the size limit", async () => {
    const big = Buffer.concat([PNG_BYTES, Buffer.alloc(6 * 1024 * 1024)]);
    const file = makeFile(big, "huge.png", "image/png");
    await expect(validateMediaFile(file)).rejects.toThrow(/5 MB/);
  });

  it("rejects an empty file", async () => {
    const file = makeFile(Buffer.alloc(0), "empty.png", "image/png");
    await expect(validateMediaFile(file)).rejects.toBeInstanceOf(UploadValidationError);
  });

  it("rejects a path-traversal filename", async () => {
    const file = makeFile(PNG_BYTES, "../../etc/passwd.png", "image/png");
    await expect(validateMediaFile(file)).rejects.toThrow(/Invalid filename/);
  });

  it("rejects a filename that is just a path segment", async () => {
    const file = makeFile(PNG_BYTES, "..", "image/png");
    await expect(validateMediaFile(file)).rejects.toThrow(/Invalid filename/);
  });

  it("rejects a filename with a null byte", async () => {
    const file = makeFile(PNG_BYTES, "photo.png\0.exe", "image/png");
    await expect(validateMediaFile(file)).rejects.toThrow(/Invalid filename/);
  });

  it("rejects a filename whose extension does not match the declared MIME type", async () => {
    const file = makeFile(PNG_BYTES, "photo.exe", "image/png");
    await expect(validateMediaFile(file)).rejects.toThrow(/extension/);
  });

  it("rejects content whose real bytes don't match the declared/extension type (spoofed upload)", async () => {
    // Declares PNG but the bytes are actually a JPEG signature — this is
    // exactly the "browser MIME type can't be trusted" attack this check
    // exists for.
    const file = makeFile(JPEG_BYTES, "photo.png", "image/png");
    await expect(validateMediaFile(file)).rejects.toThrow(/content does not match/);
  });

  it("rejects an executable renamed with an image extension and a spoofed MIME type", async () => {
    const exeBytes = Buffer.from([0x4d, 0x5a, 0x90, 0x00, 0, 0, 0, 0, 0, 0, 0, 0]); // "MZ" header
    const file = makeFile(exeBytes, "totally-a-photo.png", "image/png");
    await expect(validateMediaFile(file)).rejects.toBeInstanceOf(UploadValidationError);
  });
});

describe("deleteMediaAsset — storage key validation", () => {
  it("rejects a storage key that attempts path traversal", async () => {
    await expect(deleteMediaAsset("media/../../etc/passwd")).rejects.toThrow(/Invalid storage key/);
  });

  it("rejects a storage key outside the expected media/ namespace", async () => {
    await expect(deleteMediaAsset("some-other-dir/asset.png")).rejects.toThrow(
      /Invalid storage key/,
    );
  });

  it("rejects a storage key that isn't our generated hex-name shape (never derived from user input)", async () => {
    await expect(deleteMediaAsset("media/my-original-filename.png")).rejects.toThrow(
      /Invalid storage key/,
    );
  });

  it("rejects a storage key with shell-metacharacters or spaces", async () => {
    await expect(deleteMediaAsset("media/abc; rm -rf /.png")).rejects.toThrow(
      /Invalid storage key/,
    );
  });

  it("silently succeeds deleting an already-gone (but validly-shaped) key — never claims failure for a no-op", async () => {
    await expect(deleteMediaAsset(`media/${"0".repeat(30)}ff.png`)).resolves.toBeUndefined();
  });
});

// Minimal-but-real PNG with an explicit IHDR chunk (width=7, height=5, no
// compressed pixel data needed since only the header is read for either
// signature validation or dimension detection).
function makePng(width: number, height: number) {
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData.writeUInt8(8, 8); // bit depth
  ihdrData.writeUInt8(2, 9); // color type: truecolor
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]), // signature
    Buffer.from([0, 0, 0, 13]), // IHDR length
    Buffer.from("IHDR"),
    ihdrData,
    Buffer.from([0, 0, 0, 0]), // CRC (unchecked by the reader)
  ]);
}

describe("uploadMediaAssets / deleteMediaAsset — real local-disk round trip", () => {
  const written: string[] = [];
  afterEach(async () => {
    await Promise.allSettled(written.splice(0).map((key) => deleteMediaAsset(key)));
  });

  it("writes the file under public/uploads/media, returns a same-origin URL, and reads real dimensions", async () => {
    const bytes = makePng(7, 5);
    const file = new File([new Uint8Array(bytes)], "photo.png", { type: "image/png" });
    const [asset] = await uploadMediaAssets([file]);
    written.push(asset.publicId);

    expect(asset.publicId).toMatch(/^media\/[a-f0-9]{32}\.png$/);
    expect(asset.url).toBe(`/uploads/${asset.publicId}`);
    expect(asset.width).toBe(7);
    expect(asset.height).toBe(5);

    const onDisk = await readFile(path.join(process.cwd(), "public", "uploads", asset.publicId));
    expect(onDisk.equals(bytes)).toBe(true);
  });

  it("actually removes the file from disk on delete, not just the database row", async () => {
    const bytes = makePng(2, 2);
    const file = new File([new Uint8Array(bytes)], "photo.png", { type: "image/png" });
    const [asset] = await uploadMediaAssets([file]);
    const diskPath = path.join(process.cwd(), "public", "uploads", asset.publicId);
    await expect(readFile(diskPath)).resolves.toBeInstanceOf(Buffer);

    await deleteMediaAsset(asset.publicId);
    await expect(readFile(diskPath)).rejects.toThrow();
  });

  it("gives every upload a distinct, unguessable storage key", async () => {
    const bytes = makePng(1, 1);
    const fileA = new File([new Uint8Array(bytes)], "a.png", { type: "image/png" });
    const fileB = new File([new Uint8Array(bytes)], "b.png", { type: "image/png" });
    const [a, b] = await uploadMediaAssets([fileA, fileB]);
    written.push(a.publicId, b.publicId);
    expect(a.publicId).not.toBe(b.publicId);
  });
});
