"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { ImagePlus, X, Loader2 } from "lucide-react";

interface SingleImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  endpoint?: string;
}

export function SingleImageUpload({
  value,
  onChange,
  label = "Image",
  endpoint = "/api/admin/upload",
}: SingleImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFile = async (file: File) => {
    setUploading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("files", file);
      const res = await fetch(endpoint, { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok || !data.urls?.[0]) {
        throw new Error(data.error ?? "Échec de l'upload");
      }
      onChange(data.urls[0]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Échec de l'upload");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <label className="mb-1 block text-xs font-medium text-calma-taupe">{label} (optionnel)</label>
      {value ? (
        <div className="relative h-32 w-full overflow-hidden rounded-xl border border-calma-border">
          <Image src={value} alt="" fill className="object-cover" />
          <button
            type="button"
            onClick={() => onChange("")}
            className="absolute right-2 top-2 rounded-full bg-black/60 p-1 text-white transition-colors hover:bg-black/80"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="flex h-32 w-full flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-calma-border text-calma-taupe transition-colors hover:border-admin-gold hover:text-admin-gold disabled:opacity-60"
        >
          {uploading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <ImagePlus className="h-5 w-5" />
          )}
          <span className="text-xs font-medium">
            {uploading ? "Envoi en cours..." : "Choisir une image"}
          </span>
        </button>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
          e.target.value = "";
        }}
      />
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}
