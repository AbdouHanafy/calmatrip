"use client";
import { useRef, useState } from "react";
import { Plus, X, Loader2, Upload, GripVertical } from "lucide-react";
import type { ImageEntry } from "./imageEntry";

interface ImageUploadZoneProps {
  images: ImageEntry[];
  onChange: (images: ImageEntry[]) => void;
}

export function ImageUploadZone({ images, onChange }: ImageUploadZoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const dragItem = useRef<number | null>(null);

  const addFiles = (files: FileList | null) => {
    if (!files) return;
    const newEntries: ImageEntry[] = Array.from(files)
      .filter((f) => f.type.startsWith("image/"))
      .map((file) => ({
        id: `${Date.now()}-${Math.random()}`,
        url: URL.createObjectURL(file),
        file,
      }));
    onChange([...images, ...newEntries]);
  };

  const removeImage = (id: string) => {
    onChange(images.filter((img) => img.id !== id));
  };

  // Drag-and-drop from desktop
  const onDropZone = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    addFiles(e.dataTransfer.files);
  };

  // Reorder drag-and-drop between thumbnails
  const onDragStartThumb = (index: number) => {
    dragItem.current = index;
  };
  const onDragEnterThumb = (index: number) => {
    setDragOverIndex(index);
  };
  const onDragEndThumb = () => {
    if (dragItem.current === null || dragOverIndex === null || dragItem.current === dragOverIndex) {
      dragItem.current = null;
      setDragOverIndex(null);
      return;
    }
    const reordered = [...images];
    const [moved] = reordered.splice(dragItem.current, 1);
    reordered.splice(dragOverIndex, 0, moved);
    onChange(reordered);
    dragItem.current = null;
    setDragOverIndex(null);
  };

  return (
    <div className="space-y-3">
      {/* Drop zone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDropZone}
        onClick={() => inputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center gap-3 cursor-pointer transition-all duration-200 ${
          dragging
            ? "border-[#F2994A] bg-[#F2994A]/5 scale-[1.01]"
            : "border-calma-border hover:border-[#F2994A] hover:bg-[#F2994A]/5"
        }`}
      >
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#F2994A]/20 to-[#5E8B63]/20 flex items-center justify-center">
          <Upload className="w-6 h-6 text-[#F2994A]" />
        </div>
        <div className="text-center">
          <p className="text-sm font-medium text-calma-ink">
            Drop images here or <span className="text-[#F2994A]">browse</span>
          </p>
          <p className="text-xs text-calma-taupe mt-1">PNG, JPG, WEBP — max 5 MB each</p>
        </div>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => addFiles(e.target.files)}
        />
      </div>

      {/* Thumbnails */}
      {images.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
          {images.map((img, index) => (
            <div
              key={img.id}
              draggable
              onDragStart={() => onDragStartThumb(index)}
              onDragEnter={() => onDragEnterThumb(index)}
              onDragEnd={onDragEndThumb}
              onDragOver={(e) => e.preventDefault()}
              className={`relative group aspect-square rounded-xl overflow-hidden border-2 transition-all duration-200 cursor-grab active:cursor-grabbing ${
                index === 0 ? "border-[#F2994A]" : "border-calma-border"
              } ${dragOverIndex === index && dragItem.current !== index ? "scale-105 border-[#5E8B63]" : ""}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element -- img.url can be a local blob: preview before upload, which next/image cannot render */}
              <img src={img.url} alt="" className="w-full h-full object-cover" />

              {/* Primary badge */}
              {index === 0 && (
                <span className="absolute top-1 left-1 px-1.5 py-0.5 bg-[#F2994A] text-white text-[10px] font-bold rounded-md">
                  Main
                </span>
              )}

              {/* Uploading overlay */}
              {img.uploading && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <Loader2 className="w-5 h-5 text-white animate-spin" />
                </div>
              )}

              {/* Error overlay */}
              {img.error && (
                <div className="absolute inset-0 bg-red-500/70 flex items-center justify-center p-1">
                  <p className="text-white text-[10px] text-center">{img.error}</p>
                </div>
              )}

              {/* Drag handle */}
              <div className="absolute bottom-1 left-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <GripVertical className="w-4 h-4 text-white drop-shadow" />
              </div>

              {/* Remove button */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  removeImage(img.id);
                }}
                aria-label="Supprimer l'image"
                className="absolute top-1 right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
              >
                <X className="w-3 h-3 text-white" />
              </button>
            </div>
          ))}

          {/* Add more tile */}
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="aspect-square rounded-xl border-2 border-dashed border-calma-border hover:border-[#F2994A] hover:bg-[#F2994A]/5 flex flex-col items-center justify-center gap-1 transition-all"
          >
            <Plus className="w-5 h-5 text-calma-taupe" />
            <span className="text-[10px] text-calma-taupe">Add more</span>
          </button>
        </div>
      )}

      {images.length > 1 && (
        <p className="text-xs text-calma-taupe flex items-center gap-1">
          <GripVertical className="w-3 h-3" />
          Drag thumbnails to reorder — first image is the main one
        </p>
      )}
    </div>
  );
}
