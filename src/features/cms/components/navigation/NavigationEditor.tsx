"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowUp,
  ArrowDown,
  ChevronDown,
  ChevronRight,
  CornerDownLeft,
  CornerDownRight,
  Eye,
  EyeOff,
  Loader2,
  Pencil,
  Plus,
  Save,
  Trash2,
  X,
} from "lucide-react";

type Label = { fr?: string; en?: string; ar?: string };
type Item = {
  id: string;
  parentId: string | null;
  label: Label;
  type: "PAGE" | "CUSTOM" | "EXTERNAL" | "GROUP" | "INTERNAL";
  pageId: string | null;
  url: string;
  target: string;
  visible: boolean;
  position: number;
};
type Navigation = {
  id: string;
  name: string;
  key: string;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  items: Item[];
};
type Page = { id: string; title: string; slug: string; locale: string; status: string };
type Draft = {
  id?: string;
  label: Label;
  type: "PAGE" | "CUSTOM" | "EXTERNAL" | "GROUP";
  pageId: string;
  url: string;
  target: "_self" | "_blank";
  visible: boolean;
  parentId: string;
};

const blankDraft = (parentId = ""): Draft => ({
  label: { fr: "", en: "", ar: "" },
  type: "CUSTOM",
  pageId: "",
  url: "/",
  target: "_self",
  visible: true,
  parentId,
});
const input =
  "mt-1 h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm outline-none focus:border-slate-700";

function displayLabel(item: Item) {
  return item.label.fr || item.label.en || item.label.ar || "Untitled item";
}

export default function NavigationEditor({ navigationId }: { navigationId: string }) {
  const [navigation, setNavigation] = useState<Navigation | null>(null);
  const [pages, setPages] = useState<Page[]>([]);
  const [draft, setDraft] = useState<Draft | null>(null);
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set());
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  const load = useCallback(async () => {
    const [navigationResponse, pagesResponse] = await Promise.all([
      fetch(`/api/cms/navigation/${navigationId}`),
      fetch("/api/cms/pages"),
    ]);
    if (!navigationResponse.ok) {
      setMessage("Unable to load this navigation.");
      return;
    }
    setNavigation(await navigationResponse.json());
    if (pagesResponse.ok) setPages(await pagesResponse.json());
  }, [navigationId]);

  useEffect(() => {
    void load();
  }, [load]);

  const childrenByParent = useMemo(() => {
    const map = new Map<string | null, Item[]>();
    navigation?.items.forEach((item) => {
      const parent = item.parentId ?? null;
      map.set(parent, [...(map.get(parent) ?? []), item]);
    });
    map.forEach((items) => items.sort((a, b) => a.position - b.position));
    return map;
  }, [navigation?.items]);

  async function saveNavigation(status = navigation?.status) {
    if (!navigation || !status) return;
    setBusy(true);
    const response = await fetch(`/api/cms/navigation/${navigation.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: navigation.name, key: navigation.key, status }),
    });
    const result = await response.json();
    setMessage(
      response.ok
        ? status === "PUBLISHED"
          ? "Navigation published."
          : "Navigation saved."
        : result.error,
    );
    if (response.ok) await load();
    setBusy(false);
  }

  function editItem(item: Item) {
    setDraft({
      id: item.id,
      label: item.label,
      type: item.type === "INTERNAL" ? "CUSTOM" : item.type,
      pageId: item.pageId ?? "",
      url: item.url,
      target: item.target === "_blank" ? "_blank" : "_self",
      visible: item.visible,
      parentId: item.parentId ?? "",
    });
  }

  async function saveItem() {
    if (!navigation || !draft) return;
    setBusy(true);
    const endpoint = draft.id
      ? `/api/cms/navigation/${navigation.id}/items/${draft.id}`
      : `/api/cms/navigation/${navigation.id}/items`;
    const response = await fetch(endpoint, {
      method: draft.id ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...draft,
        pageId: draft.pageId || null,
        parentId: draft.parentId || null,
        position: draft.id
          ? (navigation.items.find((item) => item.id === draft.id)?.position ?? 0)
          : 0,
      }),
    });
    const result = await response.json();
    setMessage(response.ok ? `Item ${draft.id ? "updated" : "created"}.` : result.error);
    if (response.ok) {
      setDraft(null);
      await load();
    }
    setBusy(false);
  }

  async function removeItem(item: Item) {
    if (!navigation) return;
    const descendants = navigation.items.filter(
      (candidate) => candidate.parentId === item.id,
    ).length;
    if (
      !window.confirm(`Delete "${displayLabel(item)}"${descendants ? " and its child items" : ""}?`)
    )
      return;
    const response = await fetch(`/api/cms/navigation/${navigation.id}/items/${item.id}`, {
      method: "DELETE",
    });
    setMessage(response.ok ? "Item deleted." : (await response.json()).error);
    if (response.ok) await load();
  }

  async function persistTree(items: Item[]) {
    if (!navigation) return;
    setBusy(true);
    const normalized = items.map((item) => {
      const siblings = items
        .filter((candidate) => candidate.parentId === item.parentId)
        .sort((a, b) => a.position - b.position || a.id.localeCompare(b.id));
      return { ...item, position: siblings.findIndex((candidate) => candidate.id === item.id) };
    });
    setNavigation({ ...navigation, items: normalized });
    const response = await fetch(`/api/cms/navigation/${navigation.id}/reorder`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        items: normalized.map(({ id, parentId, position }) => ({ id, parentId, position })),
      }),
    });
    if (!response.ok) {
      setMessage((await response.json()).error ?? "Unable to save the tree.");
      await load();
    } else setMessage("Navigation order saved.");
    setBusy(false);
  }

  function move(item: Item, direction: -1 | 1) {
    if (!navigation) return;
    const siblings = childrenByParent.get(item.parentId) ?? [];
    const index = siblings.findIndex((candidate) => candidate.id === item.id);
    const target = index + direction;
    if (target < 0 || target >= siblings.length) return;
    const targetItem = siblings[target];
    void persistTree(
      navigation.items.map((candidate) =>
        candidate.id === item.id
          ? { ...candidate, position: targetItem.position }
          : candidate.id === targetItem.id
            ? { ...candidate, position: item.position }
            : candidate,
      ),
    );
  }

  function indent(item: Item) {
    if (!navigation) return;
    const siblings = childrenByParent.get(item.parentId) ?? [];
    const index = siblings.findIndex((candidate) => candidate.id === item.id);
    if (index <= 0) return;
    const parent = siblings[index - 1];
    const nextPosition = (childrenByParent.get(parent.id) ?? []).length;
    void persistTree(
      navigation.items.map((candidate) =>
        candidate.id === item.id
          ? { ...candidate, parentId: parent.id, position: nextPosition }
          : candidate,
      ),
    );
  }

  function outdent(item: Item) {
    if (!navigation || !item.parentId) return;
    const parent = navigation.items.find((candidate) => candidate.id === item.parentId);
    if (!parent) return;
    const nextPosition = (childrenByParent.get(parent.parentId) ?? []).length;
    void persistTree(
      navigation.items.map((candidate) =>
        candidate.id === item.id
          ? { ...candidate, parentId: parent.parentId, position: nextPosition }
          : candidate,
      ),
    );
  }

  function renderLevel(parentId: string | null, depth = 0): React.ReactNode {
    return (childrenByParent.get(parentId) ?? []).map((item, index, siblings) => {
      const children = childrenByParent.get(item.id) ?? [];
      const page = pages.find((candidate) => candidate.id === item.pageId);
      return (
        <div key={item.id}>
          <div
            className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-2 border-b border-slate-100 bg-white px-3 py-3"
            style={{ paddingLeft: `${12 + depth * 28}px` }}
          >
            <button
              type="button"
              disabled={!children.length}
              onClick={() =>
                setCollapsed((current) => {
                  const next = new Set(current);
                  if (next.has(item.id)) next.delete(item.id);
                  else next.add(item.id);
                  return next;
                })
              }
              className="flex h-8 w-8 items-center justify-center rounded disabled:opacity-20"
              aria-label={`${collapsed.has(item.id) ? "Expand" : "Collapse"} ${displayLabel(item)}`}
            >
              {collapsed.has(item.id) ? (
                <ChevronRight className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </button>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="truncate text-sm font-semibold text-slate-900">
                  {displayLabel(item)}
                </span>
                {item.visible ? (
                  <Eye className="h-3.5 w-3.5 text-slate-400" />
                ) : (
                  <EyeOff className="h-3.5 w-3.5 text-slate-400" />
                )}
              </div>
              <p className="truncate text-xs text-slate-500">
                {item.type === "PAGE"
                  ? `${page?.title ?? "Missing page"} / ${page?.status ?? "INVALID"}`
                  : item.type === "GROUP"
                    ? "Non-link group"
                    : item.url}
              </p>
            </div>
            <div className="flex flex-wrap justify-end gap-1">
              <button
                disabled={index === 0 || busy}
                onClick={() => move(item, -1)}
                className="rounded border p-1.5 disabled:opacity-25"
                aria-label={`Move ${displayLabel(item)} up`}
              >
                <ArrowUp className="h-3.5 w-3.5" />
              </button>
              <button
                disabled={index === siblings.length - 1 || busy}
                onClick={() => move(item, 1)}
                className="rounded border p-1.5 disabled:opacity-25"
                aria-label={`Move ${displayLabel(item)} down`}
              >
                <ArrowDown className="h-3.5 w-3.5" />
              </button>
              <button
                disabled={index === 0 || busy}
                onClick={() => indent(item)}
                className="rounded border p-1.5 disabled:opacity-25"
                aria-label={`Nest ${displayLabel(item)}`}
              >
                <CornerDownRight className="h-3.5 w-3.5" />
              </button>
              <button
                disabled={!item.parentId || busy}
                onClick={() => outdent(item)}
                className="rounded border p-1.5 disabled:opacity-25"
                aria-label={`Unnest ${displayLabel(item)}`}
              >
                <CornerDownLeft className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={() => setDraft(blankDraft(item.id))}
                className="rounded border p-1.5"
                aria-label={`Add child to ${displayLabel(item)}`}
              >
                <Plus className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={() => editItem(item)}
                className="rounded border p-1.5"
                aria-label={`Edit ${displayLabel(item)}`}
              >
                <Pencil className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={() => removeItem(item)}
                className="rounded border border-red-200 p-1.5 text-red-700"
                aria-label={`Delete ${displayLabel(item)}`}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
          {!collapsed.has(item.id) && renderLevel(item.id, depth + 1)}
        </div>
      );
    });
  }

  if (!navigation)
    return (
      <div className="flex min-h-96 items-center justify-center text-slate-500">
        {message || <Loader2 className="h-5 w-5 animate-spin" />}
      </div>
    );

  return (
    <div className="space-y-6 p-5 sm:p-7">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <Link
            href="/admin/cms/navigation"
            className="mb-3 flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-slate-900"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> All navigations
          </Link>
          <h1 className="font-space text-3xl font-semibold text-slate-950">{navigation.name}</h1>
          <p className="mt-1 text-sm text-slate-500">
            Build a deterministic, accessible menu hierarchy.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => saveNavigation()}
            disabled={busy}
            className="flex h-10 items-center gap-2 rounded-lg border border-slate-300 px-4 text-sm font-semibold disabled:opacity-40"
          >
            <Save className="h-4 w-4" /> Save
          </button>
          <button
            onClick={() =>
              saveNavigation(navigation.status === "PUBLISHED" ? "DRAFT" : "PUBLISHED")
            }
            disabled={busy}
            className="h-10 rounded-lg bg-slate-950 px-4 text-sm font-semibold text-white disabled:opacity-40"
          >
            {navigation.status === "PUBLISHED" ? "Unpublish" : "Publish"}
          </button>
        </div>
      </header>

      {message && (
        <p role="status" className="rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm">
          {message}
        </p>
      )}

      <section className="grid gap-3 rounded-xl border border-slate-200 bg-white p-4 sm:grid-cols-[1fr_1fr_130px]">
        <label className="text-xs font-medium text-slate-600">
          Name
          <input
            value={navigation.name}
            onChange={(event) => setNavigation({ ...navigation, name: event.target.value })}
            className={input}
          />
        </label>
        <label className="text-xs font-medium text-slate-600">
          Public key
          <input
            value={navigation.key}
            onChange={(event) => setNavigation({ ...navigation, key: event.target.value })}
            className={input}
          />
        </label>
        <div>
          <span className="text-xs font-medium text-slate-600">Status</span>
          <span className="mt-1 flex h-10 items-center justify-center rounded-lg bg-slate-100 text-xs font-bold">
            {navigation.status}
          </span>
        </div>
      </section>

      <section className="overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
        <div className="flex items-center justify-between border-b border-slate-200 p-4">
          <div>
            <h2 className="font-semibold">Menu items</h2>
            <p className="text-xs text-slate-500">
              Use the arrow controls to reorder, nest or unnest items.
            </p>
          </div>
          <button
            onClick={() => setDraft(blankDraft())}
            className="flex items-center gap-2 rounded-lg bg-slate-950 px-3 py-2 text-xs font-semibold text-white"
          >
            <Plus className="h-4 w-4" /> Add item
          </button>
        </div>
        {navigation.items.length ? (
          renderLevel(null)
        ) : (
          <div className="p-12 text-center text-sm text-slate-500">
            This navigation has no items yet.
          </div>
        )}
      </section>

      {draft && (
        <div
          className="fixed inset-0 z-[200] flex justify-end bg-slate-950/35"
          role="dialog"
          aria-modal="true"
          aria-label="Navigation item editor"
        >
          <div className="h-full w-full max-w-xl overflow-y-auto bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold">{draft.id ? "Edit item" : "Add item"}</h2>
                <p className="text-xs text-slate-500">
                  Labels are ready for the current FR, EN and AR locales.
                </p>
              </div>
              <button onClick={() => setDraft(null)} aria-label="Close item editor">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="mt-6 space-y-4">
              <fieldset className="rounded-lg border border-slate-200 p-3">
                <legend className="px-1 text-xs font-semibold">Labels</legend>
                <div className="grid gap-3 sm:grid-cols-3">
                  {(["fr", "en", "ar"] as const).map((locale) => (
                    <label key={locale} className="text-xs font-medium uppercase text-slate-600">
                      {locale}
                      <input
                        value={draft.label[locale] ?? ""}
                        dir={locale === "ar" ? "rtl" : "ltr"}
                        onChange={(event) =>
                          setDraft({
                            ...draft,
                            label: { ...draft.label, [locale]: event.target.value },
                          })
                        }
                        className={input}
                      />
                    </label>
                  ))}
                </div>
              </fieldset>
              <label className="block text-xs font-medium text-slate-600">
                Type
                <select
                  value={draft.type}
                  onChange={(event) =>
                    setDraft({ ...draft, type: event.target.value as Draft["type"] })
                  }
                  className={input}
                >
                  <option value="PAGE">CMS page</option>
                  <option value="CUSTOM">Internal path</option>
                  <option value="EXTERNAL">External URL</option>
                  <option value="GROUP">Non-link parent</option>
                </select>
              </label>
              {draft.type === "PAGE" && (
                <label className="block text-xs font-medium text-slate-600">
                  CMS page
                  <select
                    value={draft.pageId}
                    onChange={(event) => setDraft({ ...draft, pageId: event.target.value })}
                    className={input}
                  >
                    <option value="">Select a page</option>
                    {pages.map((page) => (
                      <option key={page.id} value={page.id}>
                        {page.title} ({page.locale} / {page.status})
                      </option>
                    ))}
                  </select>
                </label>
              )}
              {["CUSTOM", "EXTERNAL"].includes(draft.type) && (
                <label className="block text-xs font-medium text-slate-600">
                  {draft.type === "EXTERNAL" ? "External URL" : "Internal path"}
                  <input
                    value={draft.url}
                    onChange={(event) => setDraft({ ...draft, url: event.target.value })}
                    placeholder={draft.type === "EXTERNAL" ? "https://example.com" : "/services"}
                    className={input}
                  />
                </label>
              )}
              <label className="block text-xs font-medium text-slate-600">
                Parent
                <select
                  value={draft.parentId}
                  onChange={(event) => setDraft({ ...draft, parentId: event.target.value })}
                  className={input}
                >
                  <option value="">Top level</option>
                  {navigation.items
                    .filter((item) => item.id !== draft.id)
                    .map((item) => (
                      <option key={item.id} value={item.id}>
                        {displayLabel(item)}
                      </option>
                    ))}
                </select>
              </label>
              {draft.type === "EXTERNAL" && (
                <label className="block text-xs font-medium text-slate-600">
                  Open link
                  <select
                    value={draft.target}
                    onChange={(event) =>
                      setDraft({ ...draft, target: event.target.value as Draft["target"] })
                    }
                    className={input}
                  >
                    <option value="_self">In the same tab</option>
                    <option value="_blank">In a new tab</option>
                  </select>
                </label>
              )}
              <label className="flex items-center gap-3 rounded-lg border border-slate-200 p-3 text-sm">
                <input
                  type="checkbox"
                  checked={draft.visible}
                  onChange={(event) => setDraft({ ...draft, visible: event.target.checked })}
                />{" "}
                Visible on the public website
              </label>
              <button
                onClick={saveItem}
                disabled={busy}
                className="flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-slate-950 text-sm font-semibold text-white disabled:opacity-40"
              >
                {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}{" "}
                Save item
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
