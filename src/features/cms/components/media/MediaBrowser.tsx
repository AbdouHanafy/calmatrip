"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, FileImage, Loader2, Search } from "lucide-react";

export type MediaAsset = {
  id: string;
  filename: string;
  publicId?: string | null;
  url: string;
  mimeType: string;
  size: number;
  width?: number | null;
  height?: number | null;
  title?: string | null;
  alt?: Record<string, string> | null;
  caption?: Record<string, string> | null;
  description?: Record<string, string> | null;
  folder?: string | null;
  createdAt: string;
};
type Folder = { id: string; name: string };
export function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 ** 2) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 ** 2).toFixed(1)} MB`;
}

export default function MediaBrowser({
  multiple = false,
  selected,
  onSelectionChange,
  onOpen,
  refreshKey = 0,
}: {
  multiple?: boolean;
  selected: MediaAsset[];
  onSelectionChange: (items: MediaAsset[]) => void;
  onOpen?: (item: MediaAsset) => void;
  refreshKey?: number;
}) {
  const [items, setItems] = useState<MediaAsset[]>([]);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [search, setSearch] = useState("");
  const [debounced, setDebounced] = useState("");
  const [folder, setFolder] = useState("");
  const [sort, setSort] = useState("newest");
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebounced(search.trim());
      setPage(1);
    }, 250);
    return () => window.clearTimeout(timer);
  }, [search]);
  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError("");
    const params = new URLSearchParams({ page: String(page), limit: "24", sort });
    if (debounced) params.set("search", debounced);
    if (folder) params.set("folder", folder);
    fetch(`/api/cms/media?${params}`, { signal: controller.signal })
      .then(async (response) => {
        if (!response.ok) throw new Error("Unable to load media");
        return response.json();
      })
      .then((result) => {
        setItems(result.items);
        setFolders(result.folders);
        setTotal(result.total);
        setPages(Math.max(1, result.pages));
      })
      .catch((reason) => {
        if (reason.name !== "AbortError") setError(reason.message);
      })
      .finally(() => setLoading(false));
    return () => controller.abort();
  }, [debounced, folder, page, refreshKey, sort]);
  function toggle(item: MediaAsset) {
    const exists = selected.some((value) => value.id === item.id);
    if (multiple)
      onSelectionChange(
        exists ? selected.filter((value) => value.id !== item.id) : [...selected, item],
      );
    else onSelectionChange(exists ? [] : [item]);
  }
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <label className="relative min-w-56 flex-1">
          <span className="sr-only">Search media</span>
          <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="h-10 w-full rounded-lg border border-slate-300 pl-9 pr-3 text-sm outline-none focus:border-slate-600"
            placeholder="Search filename, title, alt or caption"
          />
        </label>
        <select
          value={folder}
          onChange={(event) => {
            setFolder(event.target.value);
            setPage(1);
          }}
          aria-label="Filter by folder"
          className="h-10 rounded-lg border border-slate-300 bg-white px-3 text-sm"
        >
          <option value="">All folders</option>
          <option value="ROOT">Unfiled</option>
          {folders.map((item) => (
            <option key={item.id} value={item.name}>
              {item.name}
            </option>
          ))}
        </select>
        <select
          value={sort}
          onChange={(event) => {
            setSort(event.target.value);
            setPage(1);
          }}
          aria-label="Sort media"
          className="h-10 rounded-lg border border-slate-300 bg-white px-3 text-sm"
        >
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
          <option value="nameAsc">Filename A–Z</option>
          <option value="nameDesc">Filename Z–A</option>
          <option value="largest">Largest</option>
          <option value="smallest">Smallest</option>
        </select>
      </div>
      {error && (
        <p role="alert" className="border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </p>
      )}
      {loading ? (
        <div className="flex min-h-64 items-center justify-center">
          <Loader2 className="h-5 w-5 animate-spin" />
        </div>
      ) : items.length ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
          {items.map((item) => {
            const active = selected.some((value) => value.id === item.id);
            return (
              <div
                key={item.id}
                className={`group overflow-hidden rounded-xl border bg-white text-left ${active ? "border-slate-950 ring-2 ring-slate-950/10" : "border-slate-200"}`}
              >
                <button
                  type="button"
                  onClick={() => toggle(item)}
                  aria-pressed={active}
                  className="relative block aspect-square w-full bg-slate-100"
                >
                  {item.mimeType.startsWith("image/") ? (
                    <Image
                      src={item.url}
                      alt={item.alt?.fr ?? item.title ?? ""}
                      fill
                      sizes="(max-width: 640px) 50vw, 200px"
                      className="object-cover"
                    />
                  ) : (
                    <FileImage className="absolute left-1/2 top-1/2 h-8 w-8 -translate-x-1/2 -translate-y-1/2 text-slate-400" />
                  )}
                  {active && (
                    <span className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-slate-950 text-xs text-white">
                      ✓
                    </span>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => onOpen?.(item)}
                  className="block w-full p-3 text-left"
                >
                  <span className="block truncate text-xs font-semibold text-slate-800">
                    {item.title || item.filename}
                  </span>
                  <span className="mt-1 block text-[10px] text-slate-500">
                    {item.width && item.height ? `${item.width}×${item.height} · ` : ""}
                    {formatBytes(item.size)}
                  </span>
                </button>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="flex min-h-64 flex-col items-center justify-center border border-dashed border-slate-300 text-center">
          <FileImage className="h-8 w-8 text-slate-300" />
          <p className="mt-3 text-sm font-semibold">No media found</p>
          <p className="text-xs text-slate-500">Upload an image or change the current filters.</p>
        </div>
      )}
      <div className="flex items-center justify-between text-xs text-slate-500">
        <span>{total} assets</span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={page <= 1}
            onClick={() => setPage((value) => value - 1)}
            className="rounded border p-1 disabled:opacity-30"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span>
            Page {page} of {pages}
          </span>
          <button
            type="button"
            disabled={page >= pages}
            onClick={() => setPage((value) => value + 1)}
            className="rounded border p-1 disabled:opacity-30"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
