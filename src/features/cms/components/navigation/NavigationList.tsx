"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { Loader2, Plus, Trash2 } from "lucide-react";

type Navigation = {
  id: string;
  name: string;
  key: string;
  status: string;
  updatedAt: string;
  _count: { items: number };
};

export default function NavigationList() {
  const [items, setItems] = useState<Navigation[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [name, setName] = useState("");
  const [key, setKey] = useState("");
  const [message, setMessage] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    const response = await fetch("/api/cms/navigation");
    if (response.ok) setItems(await response.json());
    else setMessage("Unable to load navigations.");
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function create() {
    setCreating(true);
    const response = await fetch("/api/cms/navigation", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, key, status: "DRAFT" }),
    });
    const result = await response.json();
    if (response.ok) {
      setName("");
      setKey("");
      setMessage("Navigation created.");
      await load();
    } else setMessage(result.error ?? "Unable to create navigation.");
    setCreating(false);
  }

  async function remove(item: Navigation) {
    if (!window.confirm(`Delete "${item.name}" and all its items?`)) return;
    const response = await fetch(`/api/cms/navigation/${item.id}`, { method: "DELETE" });
    if (response.ok) {
      setMessage("Navigation deleted.");
      await load();
    } else setMessage((await response.json()).error ?? "Unable to delete navigation.");
  }

  return (
    <div className="space-y-6 p-5 sm:p-7">
      <header>
        <p className="text-xs font-semibold uppercase tracking-[.14em] text-slate-500">CMS</p>
        <h1 className="mt-1 font-space text-3xl font-semibold text-slate-950">Navigation</h1>
        <p className="mt-1 text-sm text-slate-500">
          Create and publish the menus used by the public header, mobile menu and footer.
        </p>
      </header>

      {message && (
        <p role="status" className="rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm">
          {message}
        </p>
      )}

      <section className="rounded-xl border border-slate-200 bg-white p-4">
        <h2 className="text-sm font-semibold">Create navigation</h2>
        <div className="mt-3 grid gap-3 sm:grid-cols-[1fr_1fr_auto]">
          <label className="text-xs font-medium text-slate-600">
            Name
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="mt-1 h-10 w-full rounded-lg border border-slate-300 px-3 text-sm outline-none focus:border-slate-700"
              placeholder="Footer Explore"
            />
          </label>
          <label className="text-xs font-medium text-slate-600">
            Unique key
            <input
              value={key}
              onChange={(event) => setKey(event.target.value.toLowerCase().replace(/\s+/g, "-"))}
              className="mt-1 h-10 w-full rounded-lg border border-slate-300 px-3 text-sm outline-none focus:border-slate-700"
              placeholder="footer-explore"
            />
          </label>
          <button
            onClick={create}
            disabled={creating || !name.trim() || !key.trim()}
            className="mt-5 flex h-10 items-center justify-center gap-2 rounded-lg bg-slate-950 px-4 text-sm font-semibold text-white disabled:opacity-40"
          >
            {creating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
            Create
          </button>
        </div>
        <p className="mt-2 text-xs text-slate-500">
          Reserved public keys: <code>main</code>, <code>footer-explore</code> and{" "}
          <code>footer-company</code>.
        </p>
      </section>

      {loading ? (
        <div className="flex min-h-56 items-center justify-center">
          <Loader2 className="h-5 w-5 animate-spin text-slate-500" />
        </div>
      ) : items.length ? (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
          <div className="hidden grid-cols-[1fr_180px_120px_100px_150px_80px] gap-3 border-b bg-slate-50 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500 md:grid">
            <span>Name</span>
            <span>Key</span>
            <span>Status</span>
            <span>Items</span>
            <span>Updated</span>
            <span />
          </div>
          {items.map((item) => (
            <div
              key={item.id}
              className="grid gap-3 border-b border-slate-100 px-4 py-4 last:border-0 md:grid-cols-[1fr_180px_120px_100px_150px_80px] md:items-center"
            >
              <Link
                href={`/admin/cms/navigation/${item.id}`}
                className="font-semibold text-slate-950 hover:underline"
              >
                {item.name}
              </Link>
              <code className="text-xs text-slate-600">{item.key}</code>
              <span className="w-fit rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">
                {item.status}
              </span>
              <span className="text-sm text-slate-600">{item._count.items}</span>
              <span className="text-xs text-slate-500">
                {new Date(item.updatedAt).toLocaleString()}
              </span>
              <button
                onClick={() => remove(item)}
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-red-200 text-red-700 hover:bg-red-50"
                aria-label={`Delete ${item.name}`}
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex min-h-56 flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 text-center">
          <p className="font-semibold">No navigation yet</p>
          <p className="text-sm text-slate-500">Create the first menu above.</p>
        </div>
      )}
    </div>
  );
}
