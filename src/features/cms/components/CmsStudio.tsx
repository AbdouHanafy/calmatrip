"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  Braces,
  ChevronRight,
  FileText,
  FormInput,
  Layers3,
  Loader2,
  Plus,
  Search,
  X,
} from "lucide-react";
import { FIELD_TYPES, FORM_FIELD_TYPES } from "@/features/cms/types";
import { hasPermission } from "@/features/cms/services/permissions";
import NotificationBell from "@/components/ui/NotificationBell";

type Section = "pages" | "types" | "forms";
type PageItem = {
  id: string;
  title: string;
  slug: string;
  locale: string;
  status: string;
  updatedAt: string;
  blocks: unknown[];
};
type TypeItem = {
  id: string;
  name: string;
  slug: string;
  fields: unknown[];
  _count?: { entries: number };
};
type FormItem = {
  id: string;
  name: string;
  slug: string;
  status: string;
  _count?: { submissions: number };
};
type FieldDraft = { label: string; key: string; type: string; required: boolean };

const inputClass =
  "mt-1.5 h-10 w-full border border-slate-300 bg-white px-3 text-sm font-normal text-slate-900 outline-none focus:border-slate-600";
const blankField = (): FieldDraft => ({
  label: "Title",
  key: "title",
  type: "TEXT",
  required: true,
});

export default function CmsStudio() {
  const router = useRouter();
  const { data: session } = useSession();
  const role = session?.user?.role;
  const canManageContent = hasPermission(role, "content.manage");
  const canManageForms = hasPermission(role, "forms.manage");
  const [section, setSection] = useState<Section>("pages");
  const [pages, setPages] = useState<PageItem[]>([]);
  const [types, setTypes] = useState<TypeItem[]>([]);
  const [forms, setForms] = useState<FormItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [locale, setLocale] = useState("fr");
  const [fields, setFields] = useState<FieldDraft[]>([blankField()]);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  async function load() {
    setLoading(true);
    try {
      const [pageResponse, typeResponse, formResponse] = await Promise.all([
        fetch("/api/cms/pages"),
        fetch("/api/cms/content-types"),
        canManageForms ? fetch("/api/cms/forms") : Promise.resolve(null),
      ]);
      if (pageResponse.ok) setPages(await pageResponse.json());
      if (typeResponse.ok) setTypes(await typeResponse.json());
      if (formResponse?.ok) setForms(await formResponse.json());
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const items = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    const source = section === "pages" ? pages : section === "types" ? types : forms;
    if (!normalized) return source;
    return source.filter((item) =>
      `${"title" in item ? item.title : item.name} ${item.slug}`.toLowerCase().includes(normalized),
    );
  }, [forms, pages, query, section, types]);

  const title = section === "pages" ? "Pages" : section === "types" ? "Collections" : "Forms";
  const subtitle =
    section === "pages"
      ? "Compose and publish website pages"
      : section === "types"
        ? "Reusable schemas and structured content"
        : "Public forms and submission workflows";

  function resetDialog() {
    setName("");
    setSlug("");
    setLocale("fr");
    setFields([blankField()]);
    setMessage("");
  }

  function openCreate() {
    resetDialog();
    setDialogOpen(true);
  }

  function updateName(value: string) {
    setName(value);
    setSlug(
      value
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, ""),
    );
  }

  function updateField(index: number, patch: Partial<FieldDraft>) {
    setFields((current) =>
      current.map((field, fieldIndex) => (fieldIndex === index ? { ...field, ...patch } : field)),
    );
  }

  async function create() {
    setSaving(true);
    setMessage("");
    try {
      let endpoint = "/api/cms/pages";
      let body: unknown;
      if (section === "pages") {
        body = {
          title: name,
          slug,
          locale,
          status: "DRAFT",
          seo: { title: name, index: true, follow: true, sitemap: true },
          blocks: [
            {
              type: "HERO",
              data: {
                title: name,
                subtitle: "",
                description: "",
                backgroundImage: "",
                primaryButtonLabel: "",
                primaryButtonUrl: "",
                alignment: "left",
              },
            },
            { type: "RICH_TEXT", data: { html: "<p>Start writing your page content.</p>" } },
          ],
        };
      } else if (section === "types") {
        endpoint = "/api/cms/content-types";
        body = {
          name,
          slug,
          localized: true,
          publishingEnabled: true,
          fields: fields.map((field, position) => ({
            ...field,
            position,
            localized: true,
            searchable: position === 0,
            sortable: position === 0,
          })),
          listColumns: fields.slice(0, 4).map((field) => field.key),
        };
      } else {
        endpoint = "/api/cms/forms";
        body = {
          name,
          slug,
          status: "DRAFT",
          settings: { progressIndicator: true, saveDraft: true },
          steps: [
            {
              title: { fr: "Informations", en: "Information", ar: "المعلومات" },
              position: 0,
              fields: fields.map((field, position) => ({
                ...field,
                label: { fr: field.label, en: field.label, ar: field.label },
                position,
              })),
            },
          ],
        };
      }
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error ?? "Unable to create item");
      setDialogOpen(false);
      resetDialog();
      await load();
      if (section === "pages") router.push(`/admin/cms/pages/${result.id}`);
      if (section === "types") router.push(`/admin/cms/content/${result.slug}`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to create item");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="grid min-h-screen md:grid-cols-[220px_minmax(0,1fr)]">
        <aside className="hidden border-r border-slate-200 bg-white md:block">
          <div className="sticky top-0 p-4">
            <div className="mb-5 flex items-center gap-2 px-2 text-sm font-semibold text-slate-950">
              <Layers3 className="h-4 w-4" /> Content workspace
            </div>
            <p className="mb-1 px-2 text-[10px] font-semibold uppercase tracking-[.14em] text-slate-400">
              Collections
            </p>
            <nav className="space-y-0.5">
              <button
                onClick={() => setSection("pages")}
                className={`flex w-full items-center justify-between px-2 py-2 text-left text-xs ${section === "pages" ? "bg-slate-100 font-semibold text-slate-950" : "text-slate-600 hover:bg-slate-50"}`}
              >
                <span className="flex items-center gap-2">
                  <FileText className="h-3.5 w-3.5" /> Pages
                </span>
                <span>{pages.length}</span>
              </button>
              {types.map((type) => (
                <Link
                  key={type.id}
                  href={`/admin/cms/content/${type.slug}`}
                  className="flex items-center justify-between px-2 py-2 text-xs text-slate-600 hover:bg-slate-50"
                >
                  <span className="truncate">{type.name}</span>
                  <span>{type._count?.entries ?? 0}</span>
                </Link>
              ))}
              <button
                onClick={() => setSection("types")}
                className={`flex w-full items-center justify-between px-2 py-2 text-left text-xs ${section === "types" ? "bg-slate-100 font-semibold text-slate-950" : "text-slate-600 hover:bg-slate-50"}`}
              >
                <span className="flex items-center gap-2">
                  <Braces className="h-3.5 w-3.5" /> All collections
                </span>
                <span>{types.length}</span>
              </button>
            </nav>
            {canManageForms && (
              <>
                <p className="mb-1 mt-6 px-2 text-[10px] font-semibold uppercase tracking-[.14em] text-slate-400">
                  Forms
                </p>
                <button
                  onClick={() => setSection("forms")}
                  className={`flex w-full items-center justify-between px-2 py-2 text-left text-xs ${section === "forms" ? "bg-slate-100 font-semibold text-slate-950" : "text-slate-600 hover:bg-slate-50"}`}
                >
                  <span className="flex items-center gap-2">
                    <FormInput className="h-3.5 w-3.5" /> Form builder
                  </span>
                  <span>{forms.length}</span>
                </button>
                <Link
                  href="/admin/cms/submissions"
                  className="flex items-center justify-between px-2 py-2 text-xs text-slate-600 hover:bg-slate-50"
                >
                  <span>Submissions</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </Link>
              </>
            )}
          </div>
        </aside>

        <main className="min-w-0 px-5 py-7 lg:px-9">
          <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
            <div>
              <h1 className="font-space text-3xl font-semibold tracking-tight text-slate-950">
                {title}
              </h1>
              <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder={`Search ${title.toLowerCase()}`}
                  className="h-9 w-56 border border-slate-300 pl-9 pr-3 text-xs outline-none focus:border-slate-600"
                />
              </div>
              <select
                value={locale}
                onChange={(event) => setLocale(event.target.value)}
                className="h-9 border-0 bg-white px-2 text-xs text-slate-600 outline-none"
              >
                <option value="fr">FR</option>
                <option value="en">EN</option>
                <option value="ar">AR</option>
              </select>
              <NotificationBell tone="admin" />
            </div>
          </div>
          <div className="mb-4 flex items-center justify-between border-b border-slate-200 pb-3 md:hidden">
            <select
              value={section}
              onChange={(event) => setSection(event.target.value as Section)}
              className="border-0 bg-white text-sm font-medium"
            >
              <option value="pages">Pages</option>
              <option value="types">Collections</option>
              {canManageForms && <option value="forms">Forms</option>}
            </select>
          </div>

          {loading ? (
            <div className="flex min-h-72 items-center justify-center">
              <Loader2 className="h-5 w-5 animate-spin text-slate-500" />
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-5">
              {items.map((raw) => {
                const item = raw as PageItem | TypeItem | FormItem;
                const label = "title" in item ? item.title : item.name;
                const count =
                  section === "pages"
                    ? (item as PageItem).blocks.length
                    : section === "types"
                      ? ((item as TypeItem)._count?.entries ?? 0)
                      : ((item as FormItem)._count?.submissions ?? 0);
                const href =
                  section === "pages"
                    ? `/admin/cms/pages/${item.id}`
                    : section === "types"
                      ? `/admin/cms/content/${item.slug}`
                      : `/admin/cms/forms/${item.id}`;
                return (
                  <Link
                    key={item.id}
                    href={href}
                    className="group flex min-h-36 flex-col justify-between border border-slate-200 bg-slate-50 p-4 transition-colors hover:border-slate-400 hover:bg-white"
                  >
                    <div>
                      <p className="truncate text-sm font-semibold text-slate-900">{label}</p>
                      <p className="mt-1 truncate font-mono text-[11px] text-slate-500">
                        /{item.slug}
                      </p>
                    </div>
                    <div className="flex items-end justify-between text-[11px] text-slate-500">
                      <span>
                        {section === "pages"
                          ? `${count} blocks`
                          : section === "types"
                            ? `${count} entries`
                            : `${count} submissions`}
                      </span>
                      <span className="flex h-6 w-6 items-center justify-center rounded-full border border-slate-400 text-slate-700 transition-colors group-hover:bg-slate-950 group-hover:text-white">
                        <ChevronRight className="h-3 w-3" />
                      </span>
                    </div>
                  </Link>
                );
              })}
              {(section !== "forms" ? canManageContent : canManageForms) && (
                <button
                  onClick={openCreate}
                  className="flex min-h-36 flex-col items-start justify-between border border-dashed border-slate-300 bg-white p-4 text-left transition-colors hover:border-slate-500 hover:bg-slate-50"
                >
                  <span className="text-sm font-semibold text-slate-800">
                    New {section === "pages" ? "page" : section === "types" ? "collection" : "form"}
                  </span>
                  <span className="flex h-7 w-7 items-center justify-center rounded-full border border-slate-500">
                    <Plus className="h-3.5 w-3.5" />
                  </span>
                </button>
              )}
            </div>
          )}
        </main>
      </div>

      {dialogOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto bg-slate-950/35 p-4 pt-[8vh]"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-2xl border border-slate-300 bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
              <div>
                <h2 className="text-base font-semibold text-slate-950">
                  Create{" "}
                  {section === "pages" ? "page" : section === "types" ? "collection" : "form"}
                </h2>
                <p className="mt-0.5 text-xs text-slate-500">
                  Configure the foundation now; every field remains editable.
                </p>
              </div>
              <button
                onClick={() => setDialogOpen(false)}
                className="p-1 text-slate-500"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="space-y-5 p-5">
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="text-xs font-medium text-slate-700">
                  Name
                  <input
                    autoFocus
                    value={name}
                    onChange={(event) => updateName(event.target.value)}
                    className={inputClass}
                    placeholder={
                      section === "pages"
                        ? "Homepage"
                        : section === "types"
                          ? "Travel guides"
                          : "Partner application"
                    }
                  />
                </label>
                <label className="text-xs font-medium text-slate-700">
                  Slug
                  <input
                    value={slug}
                    onChange={(event) =>
                      setSlug(event.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-"))
                    }
                    className={`${inputClass} font-mono`}
                    placeholder="travel-guides"
                  />
                </label>
              </div>
              {section === "pages" ? (
                <label className="block text-xs font-medium text-slate-700">
                  Locale
                  <select
                    value={locale}
                    onChange={(event) => setLocale(event.target.value)}
                    className={inputClass}
                  >
                    <option value="fr">French</option>
                    <option value="en">English</option>
                    <option value="ar">Arabic</option>
                  </select>
                </label>
              ) : (
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-semibold text-slate-800">Fields</p>
                      <p className="text-[11px] text-slate-500">Define the schema without code.</p>
                    </div>
                    <button
                      onClick={() =>
                        setFields((current) => [
                          ...current,
                          { label: "", key: "", type: "TEXT", required: false },
                        ])
                      }
                      className="flex items-center gap-1 text-xs font-semibold text-slate-700"
                    >
                      <Plus className="h-3.5 w-3.5" /> Add field
                    </button>
                  </div>
                  <div className="space-y-2">
                    {fields.map((field, index) => (
                      <div
                        key={index}
                        className="grid gap-2 border border-slate-200 bg-slate-50 p-3 sm:grid-cols-[1fr_1fr_150px_auto]"
                      >
                        <input
                          value={field.label}
                          onChange={(event) => {
                            const label = event.target.value;
                            updateField(index, {
                              label,
                              key:
                                field.key ||
                                label
                                  .toLowerCase()
                                  .replace(/[^a-z0-9]+(.)/g, (_, letter: string) =>
                                    letter.toUpperCase(),
                                  )
                                  .replace(/[^a-zA-Z0-9_]/g, ""),
                            });
                          }}
                          className="h-9 border border-slate-300 px-2 text-xs outline-none"
                          placeholder="Label"
                        />
                        <input
                          value={field.key}
                          onChange={(event) =>
                            updateField(index, {
                              key: event.target.value.replace(/[^a-zA-Z0-9_]/g, ""),
                            })
                          }
                          className="h-9 border border-slate-300 px-2 font-mono text-xs outline-none"
                          placeholder="fieldKey"
                        />
                        <select
                          value={field.type}
                          onChange={(event) => updateField(index, { type: event.target.value })}
                          className="h-9 border border-slate-300 bg-white px-2 text-xs outline-none"
                        >
                          {(section === "forms" ? FORM_FIELD_TYPES : FIELD_TYPES).map((type) => (
                            <option key={type}>{type}</option>
                          ))}
                        </select>
                        <div className="flex items-center gap-2">
                          <label className="flex items-center gap-1 text-[11px] text-slate-600">
                            <input
                              type="checkbox"
                              checked={field.required}
                              onChange={(event) =>
                                updateField(index, { required: event.target.checked })
                              }
                            />{" "}
                            Required
                          </label>
                          {fields.length > 1 && (
                            <button
                              onClick={() =>
                                setFields((current) =>
                                  current.filter((_, fieldIndex) => fieldIndex !== index),
                                )
                              }
                              className="text-slate-400 hover:text-red-600"
                            >
                              <X className="h-3.5 w-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {message && <p className="text-xs text-red-600">{message}</p>}
            </div>
            <div className="flex items-center justify-end gap-2 border-t border-slate-200 px-5 py-4">
              <button
                onClick={() => setDialogOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600"
              >
                Cancel
              </button>
              <button
                onClick={create}
                disabled={
                  saving ||
                  !name ||
                  !slug ||
                  (section !== "pages" && fields.some((field) => !field.label || !field.key))
                }
                className="flex items-center gap-1.5 bg-slate-950 px-4 py-2 text-xs font-semibold text-white disabled:opacity-40"
              >
                {saving && <Loader2 className="h-3.5 w-3.5 animate-spin" />} Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
