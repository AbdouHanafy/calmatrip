"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { X } from "lucide-react";
import MediaBrowser, { type MediaAsset } from "./MediaBrowser";
export function MediaPicker({
  open,
  multiple = false,
  initialUrls = [],
  onConfirm,
  onClose,
}: {
  open: boolean;
  multiple?: boolean;
  initialUrls?: string[];
  onConfirm: (items: MediaAsset[]) => void;
  onClose: () => void;
}) {
  const [selected, setSelected] = useState<MediaAsset[]>([]);
  const initialUrlsKey = JSON.stringify(initialUrls);
  useEffect(() => {
    if (!open) return;
    const urls = JSON.parse(initialUrlsKey) as string[];
    if (!urls.length) {
      setSelected([]);
      return;
    }
    fetch("/api/cms/media/resolve", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ urls }),
    })
      .then((response) => (response.ok ? response.json() : []))
      .then(setSelected);
  }, [open, initialUrlsKey]);
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-950/40 p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Media picker"
    >
      <div className="flex max-h-[92vh] w-full max-w-6xl flex-col overflow-hidden rounded-xl bg-white shadow-2xl">
        <header className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <div>
            <h2 className="font-semibold">Select media</h2>
            <p className="text-xs text-slate-500">
              {multiple ? "Choose one or more assets" : "Choose one asset"}
            </p>
          </div>
          <button onClick={onClose} aria-label="Close media picker">
            <X className="h-5 w-5" />
          </button>
        </header>
        <div className="flex-1 overflow-y-auto p-5">
          <MediaBrowser multiple={multiple} selected={selected} onSelectionChange={setSelected} />
          {selected.length > 0 && (
            <div className="mt-4 flex gap-2 overflow-x-auto border-t pt-4">
              {selected.map((item) => (
                <div
                  key={item.id}
                  className="relative h-16 w-16 shrink-0 overflow-hidden rounded border"
                >
                  <Image src={item.url} alt="" fill className="object-cover" />
                </div>
              ))}
            </div>
          )}
        </div>
        <footer className="flex items-center justify-between border-t border-slate-200 bg-slate-50 px-5 py-4">
          <span className="text-xs text-slate-500">
            {selected.length || initialUrls.length} selected
          </span>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold"
            >
              Cancel
            </button>
            <button
              disabled={!selected.length}
              onClick={() => onConfirm(selected)}
              className="rounded-lg bg-slate-950 px-4 py-2 text-sm font-semibold text-white disabled:opacity-40"
            >
              Use selected media
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
}
