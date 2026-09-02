"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowDown,
  ArrowLeft,
  ArrowUp,
  Check,
  ChevronDown,
  ChevronRight,
  Copy,
  ExternalLink,
  FileText,
  GripVertical,
  Loader2,
  Plus,
  Save,
  Search,
  Trash2,
} from "lucide-react";
import {
  BLOCK_REGISTRY,
  type EditorField,
  type RegisteredBlockType,
} from "@/features/cms/blocks/registry";
import { RichTextEditor } from "@/components/admin/RichTextEditor";
import MediaFieldPicker, {
  type GalleryImage,
} from "@/features/cms/components/media/MediaFieldPicker";

type CmsBlock = {
  id?: string;
  type: RegisteredBlockType;
  data: Record<string, unknown>;
};

type CmsPage = {
  id: string;
  title: string;
  slug: string;
  locale: "fr" | "en" | "ar";
  status: "DRAFT" | "IN_REVIEW" | "PUBLISHED" | "ARCHIVED";
  seo?: Record<string, unknown> | null;
  blocks: CmsBlock[];
  updatedAt: string;
  publishedAt?: string | null;
};

const fieldLabel = (value: string) =>
  value.replace(/([A-Z])/g, " $1").replace(/^./, (letter) => letter.toUpperCase());

const isNumberField = (field: string) =>
  ["numberOfItems", "latitude", "longitude", "zoom"].includes(field);

const isStructuredField = (field: string) =>
  ["items", "images", "manualSelection", "entrySlugs"].includes(field);

function emptyBlock(type: RegisteredBlockType): CmsBlock {
  const data = {
    ...Object.fromEntries(BLOCK_REGISTRY[type].fields.map((field) => [field, ""])),
    ...BLOCK_REGISTRY[type].defaults,
  };
  return { type, data };
}

export default function CmsPageEditor({ pageId }: { pageId: string }) {
  const [page, setPage] = useState<CmsPage | null>(null);
  const [activeTab, setActiveTab] = useState<"content" | "seo">("content");
  const [expanded, setExpanded] = useState<Set<number>>(new Set([0]));
  const [newBlockType, setNewBlockType] = useState<RegisteredBlockType>("HERO");
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [message, setMessage] = useState("");
  const [contentTypes, setContentTypes] = useState<
    Array<{ id: string; name: string; slug: string }>
  >([]);
  const [forms, setForms] = useState<
    Array<{ id: string; name: string; slug: string; status: string }>
  >([]);

  useEffect(() => {
    fetch(`/api/cms/pages/${pageId}`)
      .then(async (response) => {
        if (!response.ok) throw new Error("Unable to load this page");
        return response.json();
      })
      .then(setPage)
      .catch((error) =>
        setMessage(error instanceof Error ? error.message : "Unable to load this page"),
      );
  }, [pageId]);

  useEffect(() => {
    Promise.all([fetch("/api/cms/content-types"), fetch("/api/cms/forms")]).then(
      async ([typesResponse, formsResponse]) => {
        if (typesResponse.ok) setContentTypes(await typesResponse.json());
        if (formsResponse.ok) setForms(await formsResponse.json());
      },
    );
  }, []);

  useEffect(() => {
    if (!dirty) return;
    const warn = (event: BeforeUnloadEvent) => event.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  const seoScore = useMemo(() => {
    if (!page) return 0;
    const seo = page.seo ?? {};
    const checks = [
      seo.title,
      seo.metaDescription,
      seo.canonicalUrl,
      seo.ogTitle,
      seo.ogDescription,
    ];
    return Math.round((checks.filter(Boolean).length / checks.length) * 100);
  }, [page]);

  function change(patch: Partial<CmsPage>) {
    setPage((current) => (current ? { ...current, ...patch } : current));
    setDirty(true);
  }

  function updateBlock(index: number, patch: Partial<CmsBlock>) {
    if (!page) return;
    change({
      blocks: page.blocks.map((block, blockIndex) =>
        blockIndex === index ? { ...block, ...patch } : block,
      ),
    });
  }

  function updateBlockField(index: number, field: string, rawValue: string) {
    if (!page) return;
    const block = page.blocks[index];
    let value: unknown = rawValue;
    if (isNumberField(field)) value = rawValue === "" ? "" : Number(rawValue);
    if (isStructuredField(field)) {
      try {
        value = rawValue.trim() ? JSON.parse(rawValue) : [];
        setMessage("");
      } catch {
        value = rawValue;
        setMessage(`${fieldLabel(field)} must contain valid JSON.`);
      }
    }
    updateBlock(index, { data: { ...block.data, [field]: value } });
  }

  function moveBlock(index: number, direction: -1 | 1) {
    if (!page) return;
    const target = index + direction;
    if (target < 0 || target >= page.blocks.length) return;
    const blocks = [...page.blocks];
    [blocks[index], blocks[target]] = [blocks[target], blocks[index]];
    change({ blocks });
    setExpanded((current) => new Set([...current, target]));
  }

  function addBlock() {
    if (!page) return;
    const nextIndex = page.blocks.length;
    change({ blocks: [...page.blocks, emptyBlock(newBlockType)] });
    setExpanded((current) => new Set([...current, nextIndex]));
  }

  function duplicateBlock(index: number) {
    if (!page) return;
    const copy = {
      ...page.blocks[index],
      id: undefined,
      data: structuredClone(page.blocks[index].data),
    };
    const blocks = [...page.blocks];
    blocks.splice(index + 1, 0, copy);
    change({ blocks });
  }

  async function save(status = page?.status) {
    if (!page || !status) return;
    setSaving(true);
    setMessage("");
    try {
      const cleanSeo = Object.fromEntries(
        Object.entries(page.seo ?? {}).filter(
          ([, value]) => value !== "" && value !== null && value !== undefined,
        ),
      );
      const response = await fetch(`/api/cms/pages/${page.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: page.title,
          slug: page.slug,
          locale: page.locale,
          status,
          seo: Object.keys(cleanSeo).length ? cleanSeo : undefined,
          blocks: page.blocks.map(({ type, data }) => ({ type, data })),
        }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error ?? "Unable to save");
      setPage(result);
      setDirty(false);
      setMessage(status === "PUBLISHED" ? "Page published." : "Changes saved.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to save");
    } finally {
      setSaving(false);
    }
  }

  if (!page) {
    return (
      <div className="flex min-h-[440px] items-center justify-center text-slate-500">
        {message || <Loader2 className="h-5 w-5 animate-spin" />}
      </div>
    );
  }

  const seo = page.seo ?? {};

  return (
    <div className="flex bg-white">
      <aside className="hidden w-[210px] flex-shrink-0 self-start border-r border-slate-200 bg-white p-4 md:block">
        <Link
          href="/admin/cms"
          className="mb-6 flex items-center gap-2 px-2 text-sm font-semibold text-slate-950"
        >
          <FileText className="h-4 w-4" /> Content workspace
        </Link>
        <p className="mb-1 px-2 text-[10px] font-semibold uppercase tracking-[.14em] text-slate-400">
          Collections
        </p>
        <nav className="space-y-0.5 text-xs">
          <Link
            href="/admin/cms"
            className="flex items-center justify-between bg-slate-100 px-2 py-2 font-semibold text-slate-950"
          >
            <span>Pages</span>
            <ChevronRight className="h-3.5 w-3.5" />
          </Link>
          <Link
            href="/admin/cms"
            className="flex items-center justify-between px-2 py-2 text-slate-600 hover:bg-slate-50"
          >
            <span>All collections</span>
            <ChevronRight className="h-3.5 w-3.5" />
          </Link>
        </nav>
        <p className="mb-1 mt-6 px-2 text-[10px] font-semibold uppercase tracking-[.14em] text-slate-400">
          Forms
        </p>
        <nav className="space-y-0.5 text-xs">
          <Link href="/admin/cms" className="block px-2 py-2 text-slate-600 hover:bg-slate-50">
            Form builder
          </Link>
          <Link
            href="/admin/cms/submissions"
            className="block px-2 py-2 text-slate-600 hover:bg-slate-50"
          >
            Submissions
          </Link>
        </nav>
      </aside>

      <div className="min-w-0 flex-1">
        <header className="border-b border-slate-200 bg-white">
          <div className="flex min-h-14 items-center justify-between gap-4 px-5">
            <div className="flex min-w-0 items-center gap-2 text-xs text-slate-500">
              <Link
                href="/admin/cms"
                className="rounded p-1 hover:bg-slate-100"
                aria-label="Back to collections"
              >
                <ArrowLeft className="h-4 w-4" />
              </Link>
              <FileText className="h-3.5 w-3.5" />
              <span>Pages</span>
              <ChevronRight className="h-3 w-3" />
              <span className="truncate font-medium text-slate-800">{page.title}</span>
            </div>
            <div className="flex items-center gap-2">
              <Link
                href={`/admin/cms/pages/${page.id}/preview`}
                target="_blank"
                className="hidden items-center gap-1.5 px-2 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-950 sm:flex"
              >
                Preview <ExternalLink className="h-3.5 w-3.5" />
              </Link>
              <button
                onClick={() => save()}
                disabled={saving || !dirty}
                className="flex items-center gap-1.5 border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700 disabled:opacity-40"
              >
                <Save className="h-3.5 w-3.5" /> Save
              </button>
              <button
                onClick={() => save("PUBLISHED")}
                disabled={saving}
                className="flex items-center gap-1.5 bg-slate-950 px-3 py-2 text-xs font-semibold text-white disabled:opacity-50"
              >
                {saving ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Check className="h-3.5 w-3.5" />
                )}
                Publish changes
              </button>
            </div>
          </div>
        </header>

        <div className="grid lg:grid-cols-[minmax(0,1fr)_300px]">
          <main className="min-w-0 px-6 py-7 xl:px-10">
            <div className="mb-6 flex items-start justify-between gap-5">
              <div className="min-w-0 flex-1">
                <input
                  value={page.title}
                  onChange={(event) => change({ title: event.target.value })}
                  className="w-full border-0 bg-transparent p-0 font-space text-3xl font-semibold tracking-tight text-slate-950 outline-none"
                  aria-label="Page title"
                />
                <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
                  <span>
                    Status:{" "}
                    <strong className="font-medium text-slate-800">
                      {page.status.replaceAll("_", " ")}
                    </strong>
                  </span>
                  <span>Last modified: {new Date(page.updatedAt).toLocaleString()}</span>
                  <span>{page.blocks.length} blocks</span>
                </div>
              </div>
            </div>

            <div className="mb-6 flex border-b border-slate-200">
              {(["content", "seo"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`border-b-2 px-4 py-2.5 text-sm font-medium capitalize ${activeTab === tab ? "border-slate-950 text-slate-950" : "border-transparent text-slate-500"}`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {activeTab === "content" ? (
              <div>
                <div className="mb-3 flex items-center justify-between">
                  <div>
                    <h2 className="text-sm font-semibold text-slate-950">Layout</h2>
                    <p className="mt-0.5 text-xs text-slate-500">
                      Build the page from reusable, reorderable blocks.
                    </p>
                  </div>
                  <button
                    onClick={() => setExpanded(new Set(page.blocks.map((_, index) => index)))}
                    className="text-xs font-medium text-slate-600"
                  >
                    Expand all
                  </button>
                </div>

                <div className="space-y-2">
                  {page.blocks.map((block, index) => {
                    const isOpen = expanded.has(index);
                    const config = BLOCK_REGISTRY[block.type];
                    return (
                      <section
                        key={`${block.id ?? block.type}-${index}`}
                        className="border border-slate-200 bg-white"
                      >
                        <div className="flex min-h-12 items-center gap-2 bg-slate-50 px-3">
                          <GripVertical className="h-4 w-4 text-slate-400" />
                          <span className="w-7 text-xs tabular-nums text-slate-400">
                            {String(index + 1).padStart(2, "0")}
                          </span>
                          <button
                            onClick={() =>
                              setExpanded((current) => {
                                const next = new Set(current);
                                if (isOpen) next.delete(index);
                                else next.add(index);
                                return next;
                              })
                            }
                            className="flex min-w-0 flex-1 items-center justify-between text-left"
                          >
                            <span className="truncate text-sm font-medium text-slate-800">
                              {config.label}
                            </span>
                            <ChevronDown
                              className={`h-4 w-4 text-slate-500 transition-transform ${isOpen ? "rotate-180" : ""}`}
                            />
                          </button>
                          <div className="flex items-center gap-0.5 border-l border-slate-200 pl-2">
                            <button
                              onClick={() => moveBlock(index, -1)}
                              disabled={index === 0}
                              className="p-1.5 text-slate-500 disabled:opacity-25"
                              aria-label="Move block up"
                            >
                              <ArrowUp className="h-3.5 w-3.5" />
                            </button>
                            <button
                              onClick={() => moveBlock(index, 1)}
                              disabled={index === page.blocks.length - 1}
                              className="p-1.5 text-slate-500 disabled:opacity-25"
                              aria-label="Move block down"
                            >
                              <ArrowDown className="h-3.5 w-3.5" />
                            </button>
                            <button
                              onClick={() => duplicateBlock(index)}
                              className="p-1.5 text-slate-500"
                              aria-label="Duplicate block"
                            >
                              <Copy className="h-3.5 w-3.5" />
                            </button>
                            <button
                              onClick={() =>
                                change({
                                  blocks: page.blocks.filter(
                                    (_, blockIndex) => blockIndex !== index,
                                  ),
                                })
                              }
                              className="p-1.5 text-slate-500 hover:text-red-600"
                              aria-label="Delete block"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>
                        {isOpen && (
                          <div className="grid gap-4 border-t border-slate-200 p-4 md:grid-cols-2">
                            {config.fields.map((field) => {
                              const value = block.data[field];
                              const editor = (config.editor as Record<string, EditorField>)[field];
                              const structured = editor.type === "json";
                              const displayed =
                                structured && typeof value !== "string"
                                  ? JSON.stringify(value ?? [], null, 2)
                                  : String(value ?? "");
                              return (
                                <label
                                  key={field}
                                  className={`block text-xs font-medium text-slate-700 ${["textarea", "richtext", "json", "media", "media-multiple"].includes(editor.type) ? "md:col-span-2" : ""}`}
                                >
                                  {editor.label}
                                  {editor.type === "richtext" ? (
                                    <div className="mt-1.5">
                                      <RichTextEditor
                                        value={displayed}
                                        onChange={(next) => updateBlockField(index, field, next)}
                                      />
                                    </div>
                                  ) : ["media", "media-multiple"].includes(editor.type) ? (
                                    <div className="mt-1.5">
                                      <MediaFieldPicker
                                        multiple={editor.type === "media-multiple"}
                                        value={
                                          editor.type === "media-multiple"
                                            ? Array.isArray(value)
                                              ? (value as GalleryImage[])
                                              : []
                                            : displayed
                                        }
                                        onChange={(next) =>
                                          updateBlock(index, {
                                            data: { ...block.data, [field]: next },
                                          })
                                        }
                                      />
                                    </div>
                                  ) : ["select", "collection", "form"].includes(editor.type) ? (
                                    <select
                                      value={displayed}
                                      onChange={(event) =>
                                        updateBlockField(index, field, event.target.value)
                                      }
                                      className="mt-1.5 h-10 w-full border border-slate-300 bg-white px-3 font-normal text-slate-900 outline-none focus:border-slate-600"
                                    >
                                      <option value="">Select…</option>
                                      {editor.type === "collection" &&
                                        contentTypes.map((item) => (
                                          <option key={item.id} value={item.slug}>
                                            {item.name}
                                          </option>
                                        ))}
                                      {editor.type === "form" &&
                                        forms
                                          .filter((item) => item.status === "PUBLISHED")
                                          .map((item) => (
                                            <option key={item.id} value={item.slug}>
                                              {item.name}
                                            </option>
                                          ))}
                                      {editor.type === "select" &&
                                        editor.options?.map((option) => (
                                          <option key={option.value} value={option.value}>
                                            {option.label}
                                          </option>
                                        ))}
                                    </select>
                                  ) : editor.type === "textarea" || structured ? (
                                    <textarea
                                      value={displayed}
                                      rows={field === "html" ? 8 : 4}
                                      onChange={(event) =>
                                        updateBlockField(index, field, event.target.value)
                                      }
                                      className="mt-1.5 w-full border border-slate-300 bg-white px-3 py-2.5 font-normal text-slate-900 outline-none focus:border-slate-600"
                                    />
                                  ) : (
                                    <input
                                      type={
                                        editor.type === "number"
                                          ? "number"
                                          : editor.type === "url"
                                            ? "url"
                                            : "text"
                                      }
                                      value={displayed}
                                      onChange={(event) =>
                                        updateBlockField(index, field, event.target.value)
                                      }
                                      className="mt-1.5 h-10 w-full border border-slate-300 bg-white px-3 font-normal text-slate-900 outline-none focus:border-slate-600"
                                    />
                                  )}
                                  {editor.help && (
                                    <span className="mt-1 block font-normal text-slate-500">
                                      {editor.help}
                                    </span>
                                  )}
                                </label>
                              );
                            })}
                          </div>
                        )}
                      </section>
                    );
                  })}
                </div>

                <div className="mt-4 flex border border-dashed border-slate-300 p-3">
                  <select
                    value={newBlockType}
                    onChange={(event) => setNewBlockType(event.target.value as RegisteredBlockType)}
                    className="min-w-0 flex-1 border-0 bg-transparent px-2 text-sm outline-none"
                  >
                    {Object.entries(BLOCK_REGISTRY).map(([type, config]) => (
                      <option key={type} value={type}>
                        {config.label}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={addBlock}
                    className="flex items-center gap-1.5 bg-slate-950 px-3 py-2 text-xs font-semibold text-white"
                  >
                    <Plus className="h-3.5 w-3.5" /> Add block
                  </button>
                </div>
              </div>
            ) : (
              <div className="max-w-3xl space-y-5">
                <div className="flex items-center justify-between border border-slate-200 bg-slate-50 p-4">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">SEO completeness</p>
                    <p className="text-xs text-slate-500">
                      Editorial checklist, not a ranking score.
                    </p>
                  </div>
                  <span className="text-2xl font-semibold text-slate-900">{seoScore}%</span>
                </div>
                {[
                  ["title", "SEO title", 70],
                  ["metaDescription", "Meta description", 180],
                  ["canonicalUrl", "Canonical URL", 250],
                  ["ogTitle", "Open Graph title", 100],
                  ["ogDescription", "Open Graph description", 200],
                ].map(([key, label, max]) => (
                  <label key={String(key)} className="block text-sm font-medium text-slate-700">
                    {label}
                    {key === "metaDescription" || key === "ogDescription" ? (
                      <textarea
                        value={String(seo[String(key)] ?? "")}
                        maxLength={Number(max)}
                        rows={3}
                        onChange={(event) =>
                          change({ seo: { ...seo, [String(key)]: event.target.value } })
                        }
                        className="mt-1.5 w-full border border-slate-300 px-3 py-2.5 font-normal outline-none focus:border-slate-600"
                      />
                    ) : (
                      <input
                        value={String(seo[String(key)] ?? "")}
                        maxLength={Number(max)}
                        onChange={(event) =>
                          change({ seo: { ...seo, [String(key)]: event.target.value } })
                        }
                        className="mt-1.5 h-10 w-full border border-slate-300 px-3 font-normal outline-none focus:border-slate-600"
                      />
                    )}
                  </label>
                ))}
                <div className="border border-slate-200 p-4">
                  <div className="mb-2 flex items-center gap-2 text-xs text-slate-500">
                    <Search className="h-3.5 w-3.5" /> Search preview
                  </div>
                  <p className="text-lg text-blue-700">{String(seo.title || page.title)}</p>
                  <p className="text-xs text-emerald-700">calmatrip.com/{page.slug}</p>
                  <p className="mt-1 text-sm text-slate-600">
                    {String(
                      seo.metaDescription || "Add a meta description to control this preview.",
                    )}
                  </p>
                </div>
              </div>
            )}
          </main>

          <aside className="border-l border-slate-200 bg-slate-50/60 p-5">
            <div className="sticky top-20 space-y-6">
              <section>
                <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Publishing
                </h2>
                <label className="block text-xs font-medium text-slate-700">
                  Status
                  <select
                    value={page.status}
                    onChange={(event) =>
                      change({ status: event.target.value as CmsPage["status"] })
                    }
                    className="mt-1.5 h-10 w-full border border-slate-300 bg-white px-3 text-sm outline-none"
                  >
                    <option value="DRAFT">Draft</option>
                    <option value="IN_REVIEW">In review</option>
                    <option value="PUBLISHED">Published</option>
                    <option value="ARCHIVED">Archived</option>
                  </select>
                </label>
                <label className="mt-4 block text-xs font-medium text-slate-700">
                  Published at
                  <input
                    value={
                      page.publishedAt
                        ? new Date(page.publishedAt).toLocaleString()
                        : "Not published"
                    }
                    readOnly
                    className="mt-1.5 h-10 w-full border border-slate-200 bg-slate-100 px-3 text-sm text-slate-500"
                  />
                </label>
              </section>
              <section className="border-t border-slate-200 pt-5">
                <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Document
                </h2>
                <label className="block text-xs font-medium text-slate-700">
                  Slug
                  <input
                    value={page.slug}
                    onChange={(event) =>
                      change({ slug: event.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-") })
                    }
                    className="mt-1.5 h-10 w-full border border-slate-300 bg-white px-3 font-mono text-sm outline-none"
                  />
                </label>
                <label className="mt-4 block text-xs font-medium text-slate-700">
                  Locale
                  <select
                    value={page.locale}
                    onChange={(event) =>
                      change({ locale: event.target.value as CmsPage["locale"] })
                    }
                    className="mt-1.5 h-10 w-full border border-slate-300 bg-white px-3 text-sm outline-none"
                  >
                    <option value="fr">French</option>
                    <option value="en">English</option>
                    <option value="ar">Arabic</option>
                  </select>
                </label>
              </section>
              {message && (
                <p
                  role="status"
                  className="border border-slate-200 bg-white p-3 text-xs text-slate-700"
                >
                  {message}
                </p>
              )}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
