"use client";
import Image from "next/image";
import { ChangeEvent, DragEvent, useEffect, useRef, useState } from "react";
import { FolderPlus, Loader2, RefreshCw, Trash2, Upload, X } from "lucide-react";
import MediaBrowser, { formatBytes, type MediaAsset } from "./MediaBrowser";

type Usage = { entityType: string; entityId: string; label: string; path: string };
type Detail = MediaAsset & { usages: Usage[] };
const input =
  "h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm outline-none focus:border-slate-600";
export default function MediaLibrary() {
  const uploadRef = useRef<HTMLInputElement>(null);
  const replaceRef = useRef<HTMLInputElement>(null);
  const [selected, setSelected] = useState<MediaAsset[]>([]);
  const [detail, setDetail] = useState<Detail | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [busy, setBusy] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [message, setMessage] = useState("");
  const [folderName, setFolderName] = useState("");
  const [folders, setFolders] = useState<Array<{ id: string; name: string }>>([]);
  async function reloadFolders() {
    const response = await fetch("/api/cms/media/folders");
    if (response.ok) setFolders(await response.json());
  }
  useEffect(() => {
    fetch("/api/cms/media/folders")
      .then((response) => (response.ok ? response.json() : []))
      .then(setFolders);
  }, []);
  async function upload(files: File[]) {
    if (!files.length) return;
    setBusy(true);
    setMessage("");
    const payload = new FormData();
    files.forEach((file) => payload.append("files", file));
    const response = await fetch("/api/cms/media", { method: "POST", body: payload });
    const result = await response.json();
    setMessage(
      response.ok ? `${result.items.length} media uploaded.` : (result.error ?? "Upload failed"),
    );
    if (response.ok) setRefreshKey((value) => value + 1);
    setBusy(false);
  }
  async function open(item: MediaAsset) {
    const response = await fetch(`/api/cms/media/${item.id}`);
    if (response.ok) {
      setDetail(await response.json());
      await reloadFolders();
    }
  }
  async function saveMetadata() {
    if (!detail) return;
    setBusy(true);
    const response = await fetch(`/api/cms/media/${detail.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: detail.title || null,
        alt: detail.alt,
        caption: detail.caption,
        description: detail.description,
        folder: detail.folder || null,
      }),
    });
    const result = await response.json();
    setMessage(response.ok ? "Media metadata saved." : (result.error ?? "Unable to save metadata"));
    if (response.ok) {
      setDetail({ ...detail, ...result });
      setRefreshKey((value) => value + 1);
    }
    setBusy(false);
  }
  async function createFolder() {
    if (!folderName.trim()) return;
    const response = await fetch("/api/cms/media/folders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: folderName }),
    });
    const result = await response.json();
    setMessage(response.ok ? "Folder created." : (result.error ?? "Unable to create folder"));
    if (response.ok) {
      setFolderName("");
      await reloadFolders();
      setRefreshKey((value) => value + 1);
    }
  }
  async function renameFolder(folder: { id: string; name: string }) {
    const name = window.prompt("New folder name", folder.name)?.trim();
    if (!name || name === folder.name) return;
    const response = await fetch(`/api/cms/media/folders/${folder.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
    const result = await response.json();
    setMessage(response.ok ? "Folder renamed." : (result.error ?? "Unable to rename folder"));
    if (response.ok) {
      await reloadFolders();
      setRefreshKey((value) => value + 1);
      if (detail?.folder === folder.name) setDetail({ ...detail, folder: name });
    }
  }
  async function deleteFolder(folder: { id: string; name: string }) {
    if (!window.confirm(`Delete empty folder “${folder.name}”?`)) return;
    const response = await fetch(`/api/cms/media/folders/${folder.id}`, { method: "DELETE" });
    const result = response.ok ? null : await response.json();
    setMessage(response.ok ? "Folder deleted." : (result.error ?? "Unable to delete folder"));
    if (response.ok) {
      await reloadFolders();
      setRefreshKey((value) => value + 1);
    }
  }
  async function deleteMedia() {
    if (
      !detail ||
      !window.confirm(`Delete “${detail.title || detail.filename}” from the library and storage?`)
    )
      return;
    setBusy(true);
    const response = await fetch(`/api/cms/media/${detail.id}`, { method: "DELETE" });
    const result = response.ok ? null : await response.json();
    if (response.ok) {
      setDetail(null);
      setSelected([]);
      setMessage("Media deleted from the library and storage.");
      setRefreshKey((value) => value + 1);
    } else {
      setMessage(result.error ?? "Unable to delete media");
      if (result.usages) setDetail({ ...detail, usages: result.usages });
    }
    setBusy(false);
  }
  async function replace(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file || !detail) return;
    setBusy(true);
    const payload = new FormData();
    payload.set("files", file);
    const response = await fetch(`/api/cms/media/${detail.id}/replace`, {
      method: "POST",
      body: payload,
    });
    const result = await response.json();
    setMessage(
      response.ok
        ? "Physical asset replaced; existing references remain attached."
        : (result.error ?? "Replacement failed"),
    );
    if (response.ok) {
      await open(result);
      setRefreshKey((value) => value + 1);
    }
    setBusy(false);
  }
  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragging(false);
    void upload(Array.from(event.dataTransfer.files));
  };
  return (
    <div className="space-y-6 p-6">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            CMS assets
          </p>
          <h1 className="font-space text-3xl font-semibold">Media Library</h1>
          <p className="mt-1 text-sm text-slate-500">Upload, organize and reuse approved images.</p>
        </div>
        <button
          onClick={() => uploadRef.current?.click()}
          disabled={busy}
          className="flex h-10 items-center gap-2 rounded-lg bg-slate-950 px-4 text-sm font-semibold text-white disabled:opacity-50"
        >
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}{" "}
          Upload media
        </button>
        <input
          ref={uploadRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          multiple
          hidden
          onChange={(event) => {
            void upload(Array.from(event.target.files ?? []));
            event.target.value = "";
          }}
        />
      </header>
      {message && (
        <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-white p-3 text-sm">
          <span>{message}</span>
          <button onClick={() => setMessage("")}>
            <X className="h-4 w-4" />
          </button>
        </div>
      )}
      <div
        onDragOver={(event) => {
          event.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        className={`rounded-xl border-2 border-dashed p-6 text-center ${dragging ? "border-slate-950 bg-slate-100" : "border-slate-300"}`}
      >
        <Upload className="mx-auto h-6 w-6 text-slate-400" />
        <p className="mt-2 text-sm font-semibold">Drop JPG, PNG, WebP or GIF files here</p>
        <p className="text-xs text-slate-500">Maximum 5 MB each, up to 20 files</p>
      </div>
      <section className="rounded-xl border border-slate-200 bg-slate-50 p-4">
        <div className="flex flex-wrap items-center gap-2">
          <FolderPlus className="h-4 w-4" />
          <input
            value={folderName}
            onChange={(event) => setFolderName(event.target.value)}
            placeholder="New folder name"
            className="h-9 rounded-lg border border-slate-300 px-3 text-sm"
          />
          <button
            onClick={createFolder}
            className="h-9 rounded-lg bg-slate-950 px-3 text-xs font-semibold text-white"
          >
            Create folder
          </button>
          <button onClick={reloadFolders} className="p-2" aria-label="Refresh folders">
            <RefreshCw className="h-4 w-4" />
          </button>
        </div>
        {folders.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {folders.map((folder) => (
              <span
                key={folder.id}
                className="flex items-center gap-1 rounded-full border border-slate-300 bg-white px-3 py-1 text-xs"
              >
                <button onClick={() => renameFolder(folder)}>{folder.name}</button>
                <button onClick={() => deleteFolder(folder)} aria-label={`Delete ${folder.name}`}>
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
        )}
      </section>
      <MediaBrowser
        selected={selected}
        onSelectionChange={setSelected}
        onOpen={open}
        refreshKey={refreshKey}
      />
      {detail && (
        <div
          className="fixed inset-0 z-[150] flex justify-end bg-slate-950/35"
          role="dialog"
          aria-modal="true"
          aria-label="Media details"
        >
          <aside className="h-full w-full max-w-2xl overflow-y-auto bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold">Media details</h2>
                <p className="text-xs text-slate-500">
                  Metadata is editable; storage keys are protected.
                </p>
              </div>
              <button onClick={() => setDetail(null)} aria-label="Close details">
                <X />
              </button>
            </div>
            <div className="relative mt-5 aspect-video overflow-hidden rounded-xl bg-slate-100">
              <Image src={detail.url} alt={detail.alt?.fr ?? ""} fill className="object-contain" />
            </div>
            <dl className="mt-4 grid grid-cols-2 gap-3 text-xs">
              <div>
                <dt className="text-slate-500">Original filename</dt>
                <dd className="break-all font-semibold">{detail.filename}</dd>
              </div>
              <div>
                <dt className="text-slate-500">MIME / size</dt>
                <dd className="font-semibold">
                  {detail.mimeType} · {formatBytes(detail.size)}
                </dd>
              </div>
              <div>
                <dt className="text-slate-500">Dimensions</dt>
                <dd>
                  {detail.width && detail.height
                    ? `${detail.width} × ${detail.height}`
                    : "Unavailable"}
                </dd>
              </div>
              <div>
                <dt className="text-slate-500">Uploaded</dt>
                <dd>{new Date(detail.createdAt).toLocaleString()}</dd>
              </div>
            </dl>
            <div className="mt-6 space-y-4">
              <label className="block text-xs font-semibold">
                Title
                <input
                  value={detail.title ?? ""}
                  onChange={(event) => setDetail({ ...detail, title: event.target.value })}
                  className={`mt-1 ${input}`}
                />
              </label>
              {(["alt", "caption", "description"] as const).map((field) => (
                <fieldset key={field} className="border border-slate-200 p-3">
                  <legend className="px-1 text-xs font-semibold capitalize">{field}</legend>
                  <div className="grid gap-2 sm:grid-cols-3">
                    {(["fr", "en", "ar"] as const).map((locale) => (
                      <label key={locale} className="text-[10px] font-semibold uppercase">
                        {locale}
                        <input
                          value={detail[field]?.[locale] ?? ""}
                          onChange={(event) =>
                            setDetail({
                              ...detail,
                              [field]: { ...detail[field], [locale]: event.target.value },
                            })
                          }
                          dir={locale === "ar" ? "rtl" : "ltr"}
                          className={`mt-1 ${input}`}
                        />
                      </label>
                    ))}
                  </div>
                </fieldset>
              ))}
              <label className="block text-xs font-semibold">
                Folder
                <select
                  value={detail.folder ?? ""}
                  onChange={(event) => setDetail({ ...detail, folder: event.target.value || null })}
                  className={`mt-1 ${input}`}
                >
                  <option value="">Unfiled</option>
                  {folders.map((folder) => (
                    <option key={folder.id} value={folder.name}>
                      {folder.name}
                    </option>
                  ))}
                </select>
              </label>
              <button
                onClick={saveMetadata}
                disabled={busy}
                className="rounded-lg bg-slate-950 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
              >
                Save metadata
              </button>
            </div>
            <section className="mt-7 border-t pt-5">
              <h3 className="font-semibold">Used in {detail.usages.length} places</h3>
              {detail.usages.length ? (
                <div className="mt-2 space-y-2">
                  {detail.usages.map((usage) => (
                    <div
                      key={`${usage.entityType}-${usage.entityId}-${usage.path}`}
                      className="border border-slate-200 p-3 text-xs"
                    >
                      <strong>{usage.entityType}</strong> · {usage.label}
                      <span className="block text-slate-500">{usage.path}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="mt-1 text-sm text-slate-500">No current references were found.</p>
              )}
            </section>
            <section className="mt-7 flex flex-wrap gap-2 border-t pt-5">
              <button
                onClick={() => replaceRef.current?.click()}
                disabled={busy || !detail.publicId}
                className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold disabled:opacity-40"
              >
                Replace physical asset
              </button>
              <input
                ref={replaceRef}
                type="file"
                hidden
                accept={detail.mimeType}
                onChange={replace}
              />
              <button
                onClick={deleteMedia}
                disabled={busy || detail.usages.length > 0}
                className="flex items-center gap-2 rounded-lg border border-red-200 px-4 py-2 text-sm font-semibold text-red-700 disabled:opacity-40"
              >
                <Trash2 className="h-4 w-4" /> Delete unused media
              </button>
            </section>
          </aside>
        </div>
      )}
    </div>
  );
}
