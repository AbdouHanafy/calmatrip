"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Archive,
  ArrowDown,
  ArrowLeft,
  ArrowUp,
  Check,
  ChevronLeft,
  ChevronRight,
  Copy,
  Loader2,
  Pencil,
  Plus,
  Search,
  Settings2,
  Trash2,
  X,
} from "lucide-react";
import { RichTextEditor } from "@/components/admin/RichTextEditor";
import MediaFieldPicker from "@/features/cms/components/media/MediaFieldPicker";
import { FIELD_TYPES } from "@/features/cms/types";

type LocalizedText = { fr?: string; en?: string; ar?: string };
type Option = { value: string; label: LocalizedText };
type Field = {
  id?: string;
  key: string;
  label: string;
  type: string;
  required: boolean;
  unique: boolean;
  localized: boolean;
  searchable: boolean;
  sortable: boolean;
  position: number;
  defaultValue?: unknown;
  validation?: { min?: number; max?: number; pattern?: string };
  options?: Option[];
  helpText?: LocalizedText;
  relation?: { contentType: string; multiple?: boolean };
  visibility?: { hidden?: boolean; readOnly?: boolean };
};
type TypeDefinition = {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  active: boolean;
  localized: boolean;
  publishingEnabled: boolean;
  listColumns?: string[] | null;
  fields: Field[];
};
type Entry = {
  id: string;
  slug: string;
  locale: string;
  status: string;
  data: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
};
type EntryResponse = { items: Entry[]; total: number; page: number; pages: number };

const inputClass =
  "h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm outline-none focus:border-admin-gold";
const blankField = (position: number): Field => ({
  key: "",
  label: "",
  type: "TEXT",
  required: false,
  unique: false,
  localized: false,
  searchable: false,
  sortable: false,
  position,
});

function valueText(value: unknown) {
  if (value === null || value === undefined) return "";
  return typeof value === "string" ? value : JSON.stringify(value);
}

function RelationInput({
  field,
  value,
  onChange,
}: {
  field: Field;
  value: unknown;
  onChange: (value: unknown) => void;
}) {
  const [options, setOptions] = useState<Entry[]>([]);
  useEffect(() => {
    if (!field.relation?.contentType) return;
    fetch(`/api/cms/content-types/${field.relation.contentType}/entries?limit=100&status=PUBLISHED`)
      .then((response) => (response.ok ? response.json() : { items: [] }))
      .then((result) => setOptions(result.items ?? []));
  }, [field.relation?.contentType]);
  const multiple = field.type === "MULTI_RELATION" || field.relation?.multiple;
  return (
    <select
      multiple={multiple}
      value={multiple ? (Array.isArray(value) ? (value as string[]) : []) : valueText(value)}
      onChange={(event) =>
        onChange(
          multiple
            ? Array.from(event.currentTarget.selectedOptions, (option) => option.value)
            : event.target.value,
        )
      }
      className={`${inputClass} ${multiple ? "h-28 py-2" : ""}`}
    >
      <option value="">Select an entry</option>
      {options.map((entry) => (
        <option key={entry.id} value={entry.id}>
          {valueText(entry.data.title || entry.data.name) || entry.slug}
        </option>
      ))}
    </select>
  );
}

export default function ContentEntryEditor({ contentTypeSlug }: { contentTypeSlug: string }) {
  const router = useRouter();
  const [definition, setDefinition] = useState<TypeDefinition | null>(null);
  const [allTypes, setAllTypes] = useState<TypeDefinition[]>([]);
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [localeFilter, setLocaleFilter] = useState("ALL");
  const [sortBy, setSortBy] = useState("updatedAt");
  const [sortDirection, setSortDirection] = useState("desc");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [editorOpen, setEditorOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [entrySlug, setEntrySlug] = useState("");
  const [locale, setLocale] = useState("fr");
  const [status, setStatus] = useState("DRAFT");
  const [values, setValues] = useState<Record<string, unknown>>({});
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [schemaOpen, setSchemaOpen] = useState(false);
  const [schema, setSchema] = useState<TypeDefinition | null>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  const loadDefinition = useCallback(async () => {
    const [definitionResponse, typesResponse] = await Promise.all([
      fetch(`/api/cms/content-types/${contentTypeSlug}`),
      fetch("/api/cms/content-types"),
    ]);
    if (!definitionResponse.ok) {
      setMessage("Unable to load collection schema");
      return;
    }
    const result = await definitionResponse.json();
    setDefinition(result);
    setSchema(structuredClone(result));
    if (typesResponse.ok) setAllTypes(await typesResponse.json());
  }, [contentTypeSlug]);

  const loadEntries = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({
      page: String(page),
      limit: "25",
      status: statusFilter,
      locale: localeFilter,
      sort: sortBy,
      direction: sortDirection,
    });
    if (search.trim()) params.set("search", search.trim());
    const response = await fetch(`/api/cms/content-types/${contentTypeSlug}/entries?${params}`);
    if (response.ok) {
      const result: EntryResponse = await response.json();
      setEntries(result.items);
      setTotal(result.total);
      setPages(Math.max(1, result.pages));
      setSelected(new Set());
    } else setMessage("Unable to load entries");
    setLoading(false);
  }, [contentTypeSlug, localeFilter, page, search, sortBy, sortDirection, statusFilter]);

  useEffect(() => {
    void loadDefinition();
  }, [loadDefinition]);
  useEffect(() => {
    void loadEntries();
  }, [loadEntries]);

  const listFields = useMemo(() => {
    if (!definition) return [];
    const keys =
      Array.isArray(definition.listColumns) && definition.listColumns.length
        ? definition.listColumns
        : definition.fields.slice(0, 3).map((field) => field.key);
    return keys
      .flatMap((key) => {
        const field = definition.fields.find((candidate) => candidate.key === key);
        return field ? [field] : [];
      })
      .slice(0, 4);
  }, [definition]);

  function openNew(source?: Entry) {
    setEditingId(null);
    setEntrySlug(source ? `${source.slug}-copy` : "");
    setLocale(source?.locale ?? "fr");
    setStatus("DRAFT");
    setValues(source ? structuredClone(source.data) : {});
    setFieldErrors({});
    setMessage("");
    setEditorOpen(true);
  }

  function openEdit(entry: Entry) {
    setEditingId(entry.id);
    setEntrySlug(entry.slug);
    setLocale(entry.locale);
    setStatus(entry.status);
    setValues(structuredClone(entry.data));
    setFieldErrors({});
    setMessage("");
    setEditorOpen(true);
  }

  async function saveEntry() {
    setBusy(true);
    setMessage("");
    setFieldErrors({});
    const endpoint = editingId
      ? `/api/cms/content-types/${contentTypeSlug}/entries/${editingId}`
      : `/api/cms/content-types/${contentTypeSlug}/entries`;
    const response = await fetch(endpoint, {
      method: editingId ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug: entrySlug, locale, status, data: values }),
    });
    const result = await response.json();
    if (response.ok) {
      setEditorOpen(false);
      await loadEntries();
    } else {
      setMessage(result.error ?? "Unable to save entry");
      setFieldErrors(result.fields ?? {});
    }
    setBusy(false);
  }

  async function deleteEntry(entry: Entry) {
    if (!window.confirm(`Delete “${entry.slug}”? This cannot be undone.`)) return;
    const response = await fetch(`/api/cms/content-types/${contentTypeSlug}/entries/${entry.id}`, {
      method: "DELETE",
    });
    if (response.ok) await loadEntries();
    else setMessage("Unable to delete entry");
  }

  async function bulk(action: "PUBLISH" | "ARCHIVE" | "DELETE") {
    if (
      !selected.size ||
      (action === "DELETE" && !window.confirm(`Delete ${selected.size} selected entries?`))
    )
      return;
    setBusy(true);
    const response = await fetch(`/api/cms/content-types/${contentTypeSlug}/entries/bulk`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids: [...selected], action }),
    });
    const result = await response.json();
    setMessage(
      response.ok ? `${result.affected} entries updated` : (result.error ?? "Bulk action failed"),
    );
    if (response.ok) await loadEntries();
    setBusy(false);
  }

  function updateSchemaField(index: number, patch: Partial<Field>) {
    setSchema((current) => {
      if (!current) return current;
      const previousKey = current.fields[index]?.key;
      const listColumns =
        patch.key && previousKey
          ? (current.listColumns ?? []).map((key) => (key === previousKey ? patch.key! : key))
          : current.listColumns;
      return {
        ...current,
        listColumns,
        fields: current.fields.map((field, fieldIndex) =>
          fieldIndex === index ? { ...field, ...patch } : field,
        ),
      };
    });
  }

  function toggleListColumn(key: string, enabled: boolean) {
    setSchema((current) => {
      if (!current) return current;
      const columns = new Set(current.listColumns ?? []);
      if (enabled) columns.add(key);
      else columns.delete(key);
      return { ...current, listColumns: [...columns].slice(0, 12) };
    });
  }

  function moveSchemaField(index: number, direction: -1 | 1) {
    if (!schema) return;
    const target = index + direction;
    if (target < 0 || target >= schema.fields.length) return;
    const fields = [...schema.fields];
    [fields[index], fields[target]] = [fields[target], fields[index]];
    setSchema({ ...schema, fields: fields.map((field, position) => ({ ...field, position })) });
  }

  async function saveSchema() {
    if (!schema) return;
    setBusy(true);
    setMessage("");
    const validKeys = new Set(schema.fields.map((field) => field.key));
    const body = {
      ...schema,
      fields: schema.fields.map((field, position) => ({ ...field, position })),
      listColumns: (schema.listColumns ?? []).filter((key) => validKeys.has(key)).slice(0, 12),
    };
    const response = await fetch(`/api/cms/content-types/${contentTypeSlug}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const result = await response.json();
    if (response.ok) {
      setSchemaOpen(false);
      if (result.slug !== contentTypeSlug) router.replace(`/admin/cms/content/${result.slug}`);
      else await loadDefinition();
    } else
      setMessage(
        result.error === "Schema change is incompatible with existing entries"
          ? `${result.error}: ${Object.entries(result.fields ?? {})
              .map(([key, value]) => `${key} ${value}`)
              .join(", ")}`
          : (result.error ?? "Unable to update collection"),
      );
    setBusy(false);
  }

  async function duplicateCollection() {
    if (!schema) return;
    const name = window.prompt("Name for the duplicated collection", `${schema.name} copy`);
    if (!name) return;
    const slug = window.prompt("Slug for the duplicated collection", `${schema.slug}-copy`);
    if (!slug) return;
    const response = await fetch(`/api/cms/content-types/${contentTypeSlug}/duplicate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, slug }),
    });
    const result = await response.json();
    if (response.ok) router.push(`/admin/cms/content/${result.slug}`);
    else setMessage(result.error ?? "Unable to duplicate collection");
  }

  async function deleteCollection() {
    if (!definition || !window.confirm(`Delete the empty collection “${definition.name}”?`)) return;
    const response = await fetch(`/api/cms/content-types/${contentTypeSlug}`, { method: "DELETE" });
    if (response.ok) router.push("/admin/cms");
    else {
      const result = await response.json();
      setMessage(result.error ?? "Unable to delete collection");
    }
  }

  if (!definition || !schema)
    return (
      <div className="flex min-h-96 items-center justify-center">
        {message || <Loader2 className="h-5 w-5 animate-spin text-slate-500" />}
      </div>
    );

  return (
    <div className="space-y-5">
      <div className="flex flex-col justify-between gap-4 border-b border-slate-200 pb-5 lg:flex-row lg:items-start">
        <div>
          <Link
            href="/admin/cms"
            className="mb-3 inline-flex items-center gap-1 text-xs text-slate-500 hover:text-slate-900"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Collections
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="font-space text-3xl font-semibold text-slate-950">{definition.name}</h1>
            <span
              className={`rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase ${definition.active ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-500"}`}
            >
              {definition.active ? "Active" : "Inactive"}
            </span>
          </div>
          <p className="mt-1 text-sm text-slate-500">
            {definition.description || `Structured entries for /${definition.slug}`}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSchemaOpen(true)}
            className="flex h-9 items-center gap-1.5 rounded-lg border border-slate-300 px-3 text-xs font-semibold text-slate-700"
          >
            <Settings2 className="h-3.5 w-3.5" /> Configure
          </button>
          <button
            onClick={() => openNew()}
            disabled={!definition.active}
            className="flex h-9 items-center gap-1.5 rounded-lg bg-slate-950 px-3 text-xs font-semibold text-white disabled:opacity-40"
          >
            <Plus className="h-3.5 w-3.5" /> New entry
          </button>
        </div>
      </div>

      {message && (
        <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700">
          <span>{message}</span>
          <button onClick={() => setMessage("")}>
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      <div className="flex flex-col justify-between gap-3 lg:flex-row lg:items-center">
        <div className="flex flex-1 flex-wrap gap-2">
          <div className="relative min-w-60 flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                setPage(1);
              }}
              placeholder="Search entries"
              className="h-10 w-full rounded-lg border border-slate-300 pl-9 pr-3 text-sm outline-none focus:border-admin-gold"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(event) => {
              setStatusFilter(event.target.value);
              setPage(1);
            }}
            className={inputClass}
          >
            <option value="ALL">All statuses</option>
            <option>DRAFT</option>
            <option>IN_REVIEW</option>
            <option>PUBLISHED</option>
            <option>ARCHIVED</option>
          </select>
          <select
            value={localeFilter}
            onChange={(event) => {
              setLocaleFilter(event.target.value);
              setPage(1);
            }}
            className={inputClass}
          >
            <option value="ALL">All languages</option>
            <option value="fr">FR</option>
            <option value="en">EN</option>
            <option value="ar">AR</option>
          </select>
          <select
            value={sortBy}
            onChange={(event) => {
              setSortBy(event.target.value);
              setPage(1);
            }}
            aria-label="Sort entries by"
            className={inputClass}
          >
            <option value="updatedAt">Last updated</option>
            <option value="createdAt">Created date</option>
            <option value="slug">Slug</option>
            <option value="status">Status</option>
          </select>
          <button
            onClick={() => {
              setSortDirection((current) => (current === "asc" ? "desc" : "asc"));
              setPage(1);
            }}
            className="flex h-10 shrink-0 items-center gap-1.5 rounded-lg border border-slate-300 px-3 text-xs font-semibold text-slate-700"
            title={sortDirection === "asc" ? "Ascending" : "Descending"}
          >
            {sortDirection === "asc" ? (
              <ArrowUp className="h-4 w-4" />
            ) : (
              <ArrowDown className="h-4 w-4" />
            )}
            {sortDirection === "asc" ? "Ascending" : "Descending"}
          </button>
        </div>
        {selected.size > 0 && (
          <div className="flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-50 p-1">
            <span className="px-2 text-xs font-semibold text-slate-600">
              {selected.size} selected
            </span>
            <button
              onClick={() => bulk("PUBLISH")}
              className="p-2 text-slate-600 hover:text-emerald-700"
              title="Publish"
            >
              <Check className="h-4 w-4" />
            </button>
            <button onClick={() => bulk("ARCHIVE")} className="p-2 text-slate-600" title="Archive">
              <Archive className="h-4 w-4" />
            </button>
            <button
              onClick={() => bulk("DELETE")}
              className="p-2 text-slate-600 hover:text-red-600"
              title="Delete"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="bg-slate-50 text-xs font-semibold text-slate-500">
              <tr>
                <th className="w-12 p-3">
                  <input
                    type="checkbox"
                    checked={entries.length > 0 && selected.size === entries.length}
                    onChange={(event) =>
                      setSelected(
                        event.target.checked
                          ? new Set(entries.map((entry) => entry.id))
                          : new Set(),
                      )
                    }
                  />
                </th>
                <th className="p-3">Slug</th>
                {listFields.map((field) => (
                  <th key={field.key} className="p-3">
                    {field.label}
                  </th>
                ))}
                <th className="p-3">Language</th>
                <th className="p-3">Status</th>
                <th className="p-3">Updated</th>
                <th className="w-32 p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={listFields.length + 6} className="p-12 text-center">
                    <Loader2 className="mx-auto h-5 w-5 animate-spin" />
                  </td>
                </tr>
              ) : (
                entries.map((entry) => (
                  <tr key={entry.id} className="border-t border-slate-100 hover:bg-slate-50/70">
                    <td className="p-3">
                      <input
                        type="checkbox"
                        checked={selected.has(entry.id)}
                        onChange={(event) =>
                          setSelected((current) => {
                            const next = new Set(current);
                            if (event.target.checked) next.add(entry.id);
                            else next.delete(entry.id);
                            return next;
                          })
                        }
                      />
                    </td>
                    <td className="p-3 font-mono text-xs font-medium text-slate-800">
                      {entry.slug}
                    </td>
                    {listFields.map((field) => (
                      <td key={field.key} className="max-w-52 truncate p-3 text-slate-600">
                        {valueText(entry.data[field.key]) || "—"}
                      </td>
                    ))}
                    <td className="p-3 uppercase text-slate-500">{entry.locale}</td>
                    <td className="p-3">
                      <span className="rounded-full bg-slate-100 px-2 py-1 text-[10px] font-semibold text-slate-600">
                        {entry.status.replaceAll("_", " ")}
                      </span>
                    </td>
                    <td className="p-3 text-xs text-slate-500">
                      {new Date(entry.updatedAt).toLocaleDateString()}
                    </td>
                    <td className="p-3">
                      <div className="flex justify-end gap-1">
                        <button
                          onClick={() => openEdit(entry)}
                          className="p-2 text-slate-500 hover:text-slate-950"
                          title="Edit"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => openNew(entry)}
                          className="p-2 text-slate-500 hover:text-slate-950"
                          title="Duplicate"
                        >
                          <Copy className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => deleteEntry(entry)}
                          className="p-2 text-slate-500 hover:text-red-600"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {!loading && !entries.length && (
          <div className="border-t border-slate-100 p-12 text-center text-sm text-slate-500">
            No entries match these filters.
          </div>
        )}
        <div className="flex items-center justify-between border-t border-slate-200 px-4 py-3 text-xs text-slate-500">
          <span>{total} entries</span>
          <div className="flex items-center gap-2">
            <button
              disabled={page <= 1}
              onClick={() => setPage((current) => current - 1)}
              className="rounded border border-slate-200 p-1.5 disabled:opacity-30"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
            </button>
            <span>
              Page {page} of {pages}
            </span>
            <button
              disabled={page >= pages}
              onClick={() => setPage((current) => current + 1)}
              className="rounded border border-slate-200 p-1.5 disabled:opacity-30"
            >
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>

      {editorOpen && (
        <div
          className="fixed inset-0 z-[100] flex justify-end bg-slate-950/30"
          role="dialog"
          aria-modal="true"
        >
          <div className="flex h-full w-full max-w-2xl flex-col bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
              <div>
                <h2 className="font-semibold text-slate-950">
                  {editingId ? "Edit" : "New"} {definition.name}
                </h2>
                <p className="text-xs text-slate-500">
                  Fields are generated from the active collection schema.
                </p>
              </div>
              <button onClick={() => setEditorOpen(false)}>
                <X className="h-5 w-5 text-slate-500" />
              </button>
            </div>
            <div className="flex-1 space-y-5 overflow-y-auto p-6">
              {definition.fields
                .filter((field) => !field.visibility?.hidden)
                .map((field) => (
                  <label
                    key={field.id ?? field.key}
                    className="block text-xs font-semibold text-slate-700"
                  >
                    {field.label}
                    {field.required && <span className="text-red-600"> *</span>}
                    {field.type === "BOOLEAN" || field.type === "CHECKBOX" ? (
                      <span className="mt-2 flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={Boolean(values[field.key])}
                          disabled={field.visibility?.readOnly}
                          onChange={(event) =>
                            setValues((current) => ({
                              ...current,
                              [field.key]: event.target.checked,
                            }))
                          }
                        />{" "}
                        Enabled
                      </span>
                    ) : field.type === "RICH_TEXT" ? (
                      <div className="mt-2">
                        <RichTextEditor
                          value={valueText(values[field.key])}
                          onChange={(value) =>
                            setValues((current) => ({ ...current, [field.key]: value }))
                          }
                        />
                      </div>
                    ) : field.type === "IMAGE" ? (
                      <div className="mt-2">
                        <MediaFieldPicker
                          value={valueText(values[field.key])}
                          onChange={(value) =>
                            setValues((current) => ({ ...current, [field.key]: value }))
                          }
                        />
                      </div>
                    ) : ["RELATION", "MULTI_RELATION"].includes(field.type) ? (
                      <div className="mt-2">
                        <RelationInput
                          field={field}
                          value={values[field.key]}
                          onChange={(value) =>
                            setValues((current) => ({ ...current, [field.key]: value }))
                          }
                        />
                      </div>
                    ) : ["SELECT", "RADIO", "MULTI_SELECT"].includes(field.type) ? (
                      <select
                        multiple={field.type === "MULTI_SELECT"}
                        value={
                          field.type === "MULTI_SELECT"
                            ? Array.isArray(values[field.key])
                              ? (values[field.key] as string[])
                              : []
                            : valueText(values[field.key])
                        }
                        onChange={(event) =>
                          setValues((current) => ({
                            ...current,
                            [field.key]:
                              field.type === "MULTI_SELECT"
                                ? Array.from(
                                    event.currentTarget.selectedOptions,
                                    (option) => option.value,
                                  )
                                : event.target.value,
                          }))
                        }
                        className={`mt-2 ${inputClass} ${field.type === "MULTI_SELECT" ? "h-28 py-2" : ""}`}
                      >
                        <option value="">Select…</option>
                        {field.options?.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label.fr ?? option.value}
                          </option>
                        ))}
                      </select>
                    ) : ["TEXTAREA", "JSON", "GALLERY"].includes(field.type) ? (
                      <textarea
                        rows={field.type === "TEXTAREA" ? 4 : 7}
                        value={valueText(values[field.key])}
                        onChange={(event) => {
                          const raw = event.target.value;
                          if (["JSON", "GALLERY"].includes(field.type)) {
                            try {
                              setValues((current) => ({
                                ...current,
                                [field.key]: JSON.parse(raw),
                              }));
                              setFieldErrors((current) => ({ ...current, [field.key]: "" }));
                            } catch {
                              setFieldErrors((current) => ({
                                ...current,
                                [field.key]: "Invalid JSON",
                              }));
                            }
                          } else setValues((current) => ({ ...current, [field.key]: raw }));
                        }}
                        className="mt-2 min-h-28 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-admin-gold"
                      />
                    ) : (
                      <input
                        type={
                          field.type === "NUMBER"
                            ? "number"
                            : field.type === "DATE"
                              ? "date"
                              : field.type === "DATETIME"
                                ? "datetime-local"
                                : field.type === "EMAIL"
                                  ? "email"
                                  : field.type === "URL"
                                    ? "url"
                                    : "text"
                        }
                        value={valueText(values[field.key])}
                        disabled={field.visibility?.readOnly}
                        onChange={(event) =>
                          setValues((current) => ({
                            ...current,
                            [field.key]:
                              field.type === "NUMBER"
                                ? event.target.valueAsNumber
                                : event.target.value,
                          }))
                        }
                        className={`mt-2 ${inputClass}`}
                      />
                    )}
                    {field.helpText?.fr && (
                      <span className="mt-1 block font-normal text-slate-500">
                        {field.helpText.fr}
                      </span>
                    )}
                    {fieldErrors[field.key] && (
                      <span className="mt-1 block font-normal text-red-600">
                        {fieldErrors[field.key]}
                      </span>
                    )}
                  </label>
                ))}
            </div>
            <div className="grid gap-3 border-t border-slate-200 bg-slate-50 p-5 sm:grid-cols-3">
              <label className="text-xs font-semibold text-slate-600">
                Slug
                <input
                  value={entrySlug}
                  onChange={(event) =>
                    setEntrySlug(event.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-"))
                  }
                  className={`mt-1 ${inputClass}`}
                />
              </label>
              <label className="text-xs font-semibold text-slate-600">
                Language
                <select
                  value={locale}
                  onChange={(event) => setLocale(event.target.value)}
                  className={`mt-1 ${inputClass}`}
                >
                  <option value="fr">FR</option>
                  <option value="en">EN</option>
                  <option value="ar">AR</option>
                </select>
              </label>
              <label className="text-xs font-semibold text-slate-600">
                Status
                <select
                  value={status}
                  onChange={(event) => setStatus(event.target.value)}
                  className={`mt-1 ${inputClass}`}
                >
                  <option>DRAFT</option>
                  <option>IN_REVIEW</option>
                  <option>PUBLISHED</option>
                  <option>ARCHIVED</option>
                </select>
              </label>
              <div className="flex items-center justify-between sm:col-span-3">
                {message && <p className="text-xs text-red-600">{message}</p>}
                <button
                  onClick={saveEntry}
                  disabled={busy || !entrySlug}
                  className="ml-auto flex h-10 items-center gap-2 rounded-lg bg-slate-950 px-5 text-sm font-semibold text-white disabled:opacity-40"
                >
                  {busy && <Loader2 className="h-4 w-4 animate-spin" />} Save entry
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {schemaOpen && (
        <div
          className="fixed inset-0 z-[100] flex justify-end bg-slate-950/30"
          role="dialog"
          aria-modal="true"
        >
          <div className="flex h-full w-full max-w-4xl flex-col bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
              <div>
                <h2 className="font-semibold text-slate-950">Configure collection</h2>
                <p className="text-xs text-slate-500">
                  Unsafe changes are rejected when existing entries would become invalid.
                </p>
              </div>
              <button onClick={() => setSchemaOpen(false)}>
                <X className="h-5 w-5 text-slate-500" />
              </button>
            </div>
            <div className="flex-1 space-y-6 overflow-y-auto p-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="text-xs font-semibold text-slate-700">
                  Name
                  <input
                    value={schema.name}
                    onChange={(event) => setSchema({ ...schema, name: event.target.value })}
                    className={`mt-2 ${inputClass}`}
                  />
                </label>
                <label className="text-xs font-semibold text-slate-700">
                  Slug
                  <input
                    value={schema.slug}
                    onChange={(event) =>
                      setSchema({
                        ...schema,
                        slug: event.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-"),
                      })
                    }
                    className={`mt-2 ${inputClass}`}
                  />
                </label>
                <label className="text-xs font-semibold text-slate-700 sm:col-span-2">
                  Description
                  <textarea
                    value={schema.description ?? ""}
                    onChange={(event) => setSchema({ ...schema, description: event.target.value })}
                    className="mt-2 min-h-20 w-full rounded-lg border border-slate-300 p-3 text-sm outline-none"
                  />
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={schema.active}
                    onChange={(event) => setSchema({ ...schema, active: event.target.checked })}
                  />{" "}
                  Active collection
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={schema.publishingEnabled}
                    onChange={(event) =>
                      setSchema({ ...schema, publishingEnabled: event.target.checked })
                    }
                  />{" "}
                  Publishing enabled
                </label>
              </div>
              <div>
                <div className="mb-3 flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900">Fields</h3>
                    <p className="text-xs text-slate-500">
                      Reorder and configure the JSON-backed schema.
                    </p>
                  </div>
                  <button
                    onClick={() =>
                      setSchema({
                        ...schema,
                        fields: [...schema.fields, blankField(schema.fields.length)],
                      })
                    }
                    className="flex items-center gap-1.5 rounded-lg border border-slate-300 px-3 py-2 text-xs font-semibold"
                  >
                    <Plus className="h-3.5 w-3.5" /> Add field
                  </button>
                </div>
                <div className="space-y-2">
                  {schema.fields.map((field, index) => (
                    <section
                      key={field.id ?? `new-${index}`}
                      className="border border-slate-200 bg-slate-50 p-4"
                    >
                      <div className="grid gap-3 lg:grid-cols-[1fr_1fr_180px_auto]">
                        <input
                          value={field.label}
                          onChange={(event) =>
                            updateSchemaField(index, { label: event.target.value })
                          }
                          className={inputClass}
                          placeholder="Label"
                        />
                        <input
                          value={field.key}
                          onChange={(event) =>
                            updateSchemaField(index, {
                              key: event.target.value.replace(/[^a-zA-Z0-9_]/g, ""),
                            })
                          }
                          className={`${inputClass} font-mono`}
                          placeholder="fieldKey"
                        />
                        <select
                          value={field.type}
                          onChange={(event) =>
                            updateSchemaField(index, { type: event.target.value })
                          }
                          className={inputClass}
                        >
                          {FIELD_TYPES.map((type) => (
                            <option key={type}>{type}</option>
                          ))}
                        </select>
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => moveSchemaField(index, -1)}
                            disabled={index === 0}
                            className="p-2 disabled:opacity-30"
                          >
                            <ArrowUp className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => moveSchemaField(index, 1)}
                            disabled={index === schema.fields.length - 1}
                            className="p-2 disabled:opacity-30"
                          >
                            <ArrowDown className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() =>
                              setSchema({
                                ...schema,
                                fields: schema.fields.filter(
                                  (_, fieldIndex) => fieldIndex !== index,
                                ),
                              })
                            }
                            className="p-2 text-slate-500 hover:text-red-600"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                      <div className="mt-3 flex flex-wrap gap-4 text-xs text-slate-600">
                        {(
                          ["required", "unique", "localized", "searchable", "sortable"] as const
                        ).map((property) => (
                          <label key={property} className="flex items-center gap-1">
                            <input
                              type="checkbox"
                              checked={Boolean(field[property])}
                              onChange={(event) =>
                                updateSchemaField(index, { [property]: event.target.checked })
                              }
                            />{" "}
                            {property}
                          </label>
                        ))}
                        <label className="flex items-center gap-1">
                          <input
                            type="checkbox"
                            checked={(schema.listColumns ?? []).includes(field.key)}
                            disabled={!field.key}
                            onChange={(event) => toggleListColumn(field.key, event.target.checked)}
                          />
                          list column
                        </label>
                        {(["hidden", "readOnly"] as const).map((property) => (
                          <label key={property} className="flex items-center gap-1">
                            <input
                              type="checkbox"
                              checked={Boolean(field.visibility?.[property])}
                              onChange={(event) =>
                                updateSchemaField(index, {
                                  visibility: {
                                    ...field.visibility,
                                    [property]: event.target.checked,
                                  },
                                })
                              }
                            />
                            {property}
                          </label>
                        ))}
                      </div>
                      <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                        <label className="text-xs font-semibold text-slate-600 sm:col-span-2">
                          Help text
                          <input
                            value={field.helpText?.fr ?? ""}
                            onChange={(event) =>
                              updateSchemaField(index, {
                                helpText: { ...field.helpText, fr: event.target.value },
                              })
                            }
                            className={`mt-1 ${inputClass}`}
                          />
                        </label>
                        <label className="text-xs font-semibold text-slate-600">
                          Minimum
                          <input
                            type="number"
                            value={field.validation?.min ?? ""}
                            onChange={(event) =>
                              updateSchemaField(index, {
                                validation: {
                                  ...field.validation,
                                  min:
                                    event.target.value === ""
                                      ? undefined
                                      : event.target.valueAsNumber,
                                },
                              })
                            }
                            className={`mt-1 ${inputClass}`}
                          />
                        </label>
                        <label className="text-xs font-semibold text-slate-600">
                          Maximum
                          <input
                            type="number"
                            value={field.validation?.max ?? ""}
                            onChange={(event) =>
                              updateSchemaField(index, {
                                validation: {
                                  ...field.validation,
                                  max:
                                    event.target.value === ""
                                      ? undefined
                                      : event.target.valueAsNumber,
                                },
                              })
                            }
                            className={`mt-1 ${inputClass}`}
                          />
                        </label>
                        <label className="text-xs font-semibold text-slate-600 sm:col-span-2">
                          Validation pattern
                          <input
                            value={field.validation?.pattern ?? ""}
                            onChange={(event) =>
                              updateSchemaField(index, {
                                validation: {
                                  ...field.validation,
                                  pattern: event.target.value || undefined,
                                },
                              })
                            }
                            placeholder="Regular expression"
                            className={`mt-1 ${inputClass} font-mono`}
                          />
                        </label>
                        <label className="text-xs font-semibold text-slate-600 sm:col-span-2">
                          Default value
                          <input
                            value={valueText(field.defaultValue)}
                            onChange={(event) =>
                              updateSchemaField(index, { defaultValue: event.target.value })
                            }
                            className={`mt-1 ${inputClass}`}
                          />
                        </label>
                      </div>
                      {["SELECT", "MULTI_SELECT", "RADIO"].includes(field.type) && (
                        <label className="mt-3 block text-xs font-semibold text-slate-600">
                          Options (one per line: value|label)
                          <textarea
                            value={(field.options ?? [])
                              .map((option) => `${option.value}|${option.label.fr ?? option.value}`)
                              .join("\n")}
                            onChange={(event) =>
                              updateSchemaField(index, {
                                options: event.target.value
                                  .split("\n")
                                  .filter(Boolean)
                                  .map((line) => {
                                    const [value, label = value] = line.split("|");
                                    return {
                                      value: value.trim(),
                                      label: {
                                        fr: label.trim(),
                                        en: label.trim(),
                                        ar: label.trim(),
                                      },
                                    };
                                  }),
                              })
                            }
                            className="mt-1 min-h-20 w-full rounded-lg border border-slate-300 p-2 font-mono text-xs"
                          />
                        </label>
                      )}
                      {["RELATION", "MULTI_RELATION"].includes(field.type) && (
                        <label className="mt-3 block text-xs font-semibold text-slate-600">
                          Related collection
                          <select
                            value={field.relation?.contentType ?? ""}
                            onChange={(event) =>
                              updateSchemaField(index, {
                                relation: {
                                  contentType: event.target.value,
                                  multiple: field.type === "MULTI_RELATION",
                                },
                              })
                            }
                            className={`mt-1 ${inputClass}`}
                          >
                            <option value="">Select collection</option>
                            {allTypes
                              .filter((type) => type.slug !== schema.slug)
                              .map((type) => (
                                <option key={type.id} value={type.slug}>
                                  {type.name}
                                </option>
                              ))}
                          </select>
                        </label>
                      )}
                    </section>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 bg-slate-50 px-6 py-4">
              <div className="flex gap-2">
                <button
                  onClick={duplicateCollection}
                  className="flex items-center gap-1.5 rounded-lg border border-slate-300 px-3 py-2 text-xs font-semibold"
                >
                  <Copy className="h-3.5 w-3.5" /> Duplicate collection
                </button>
                <button
                  onClick={deleteCollection}
                  className="flex items-center gap-1.5 rounded-lg border border-red-200 px-3 py-2 text-xs font-semibold text-red-700"
                >
                  <Trash2 className="h-3.5 w-3.5" /> Delete
                </button>
              </div>
              <div className="flex items-center gap-3">
                {message && <span className="max-w-md text-xs text-red-600">{message}</span>}
                <button
                  onClick={saveSchema}
                  disabled={
                    busy ||
                    !schema.name ||
                    !schema.slug ||
                    !schema.fields.length ||
                    schema.fields.some((field) => !field.key || !field.label)
                  }
                  className="flex h-10 items-center gap-2 rounded-lg bg-slate-950 px-5 text-sm font-semibold text-white disabled:opacity-40"
                >
                  {busy && <Loader2 className="h-4 w-4 animate-spin" />} Save schema
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
