"use client";

import Image from "next/image";
import { ImagePlus, Trash2 } from "lucide-react";
import { useState } from "react";
import { MediaPicker } from "./MediaPicker";
import type { MediaAsset } from "./MediaBrowser";

export type GalleryImage = {
  url: string;
  alt?: string;
  caption?: string;
};

function preferredText(value?: Record<string, string> | null) {
  return value?.fr || value?.en || value?.ar || "";
}

export function mediaAssetToGalleryImage(asset: MediaAsset): GalleryImage {
  return {
    url: asset.url,
    alt: preferredText(asset.alt) || asset.title || asset.filename,
    caption: preferredText(asset.caption),
  };
}

export default function MediaFieldPicker({
  value,
  multiple = false,
  onChange,
}: {
  value: string | GalleryImage[];
  multiple?: boolean;
  onChange: (value: string | GalleryImage[]) => void;
}) {
  const [open, setOpen] = useState(false);
  const images = multiple
    ? Array.isArray(value)
      ? value
      : []
    : typeof value === "string" && value
      ? [{ url: value }]
      : [];

  function confirm(items: MediaAsset[]) {
    onChange(multiple ? items.map(mediaAssetToGalleryImage) : (items[0]?.url ?? ""));
    setOpen(false);
  }

  return (
    <div className="space-y-3">
      {images.length > 0 && (
        <div className={multiple ? "grid grid-cols-2 gap-3 sm:grid-cols-4" : "max-w-sm"}>
          {images.map((image, index) => (
            <div
              key={`${image.url}-${index}`}
              className="group relative aspect-video overflow-hidden rounded-lg border border-slate-200 bg-slate-100"
            >
              <Image src={image.url} alt={image.alt ?? ""} fill className="object-cover" />
              <button
                type="button"
                onClick={() =>
                  onChange(multiple ? images.filter((_, imageIndex) => imageIndex !== index) : "")
                }
                className="absolute right-2 top-2 rounded-md bg-slate-950/80 p-1.5 text-white"
                aria-label="Remove image"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-800 hover:bg-slate-50"
      >
        <ImagePlus className="h-4 w-4" />
        {images.length
          ? "Change library selection"
          : multiple
            ? "Choose gallery images"
            : "Choose from library"}
      </button>

      <MediaPicker
        open={open}
        multiple={multiple}
        initialUrls={images.map((image) => image.url)}
        onConfirm={confirm}
        onClose={() => setOpen(false)}
      />
    </div>
  );
}
