"use client";
import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Download, Loader2, Search, X } from "lucide-react";
type Item = {
  id: string;
  status: string;
  locale: string;
  data: Record<string, unknown>;
  notes?: unknown;
  assignedTo?: string | null;
  submittedAt?: string | null;
  createdAt: string;
  form: { name: string; slug: string };
  history?: Array<{ id: string; action: string; createdAt: string }>;
};
const input =
  "h-10 border border-slate-300 bg-white px-3 text-sm outline-none focus:border-slate-600";
const statuses = ["DRAFT", "NEW", "IN_PROGRESS", "WAITING", "RESOLVED", "REJECTED", "ARCHIVED"];
export default function SubmissionInbox() {
  const [items, setItems] = useState<Item[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [status, setStatus] = useState("ALL");
  const [form, setForm] = useState("ALL");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Item | null>(null);
  const [note, setNote] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [message, setMessage] = useState("");
  const load = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(page), limit: "25" });
    if (status !== "ALL") params.set("status", status);
    if (form !== "ALL") params.set("form", form);
    if (search.trim()) params.set("search", search.trim());
    const response = await fetch(`/api/cms/submissions?${params}`);
    if (response.ok) {
      const result = await response.json();
      setItems(result.items);
      setTotal(result.total);
      setPages(Math.max(1, result.pages));
    }
    setLoading(false);
  }, [form, page, search, status]);
  useEffect(() => {
    void load();
  }, [load]);
  async function open(id: string) {
    const response = await fetch(`/api/cms/submissions/${id}`);
    if (response.ok) {
      const result = await response.json();
      setSelected(result);
      setAssignedTo(result.assignedTo ?? "");
      setNote("");
    }
  }
  async function update(patch: Record<string, unknown>) {
    if (!selected) return;
    const response = await fetch(`/api/cms/submissions/${selected.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patch),
    });
    const result = await response.json();
    if (response.ok) {
      setMessage("Submission updated.");
      await open(selected.id);
      await load();
    } else setMessage(result.error ?? "Update failed");
  }
  const forms = Array.from(
    new Map(items.map((item) => [item.form.slug, item.form.name])).entries(),
  );
  const exportParams = new URLSearchParams();
  if (status !== "ALL") exportParams.set("status", status);
  if (form !== "ALL") exportParams.set("form", form);
  return (
    <div className="space-y-5 p-6">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Forms</p>
          <h1 className="font-space text-3xl font-semibold">Submission inbox</h1>
          <p className="mt-1 text-sm text-slate-500">{total} submissions</p>
        </div>
        <a
          href={`/api/cms/submissions/export?${exportParams}`}
          className="flex h-10 items-center gap-2 border border-slate-300 px-4 text-sm font-semibold"
        >
          <Download className="h-4 w-4" /> Export CSV
        </a>
      </header>
      <div className="flex flex-wrap gap-2">
        <div className="relative min-w-60 flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
          <input
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(1);
            }}
            placeholder="Search ID, form or assignee"
            className={`${input} w-full pl-9`}
          />
        </div>
        <select
          value={status}
          onChange={(event) => {
            setStatus(event.target.value);
            setPage(1);
          }}
          className={input}
        >
          <option value="ALL">All statuses</option>
          {statuses.map((value) => (
            <option key={value}>{value}</option>
          ))}
        </select>
        <select
          value={form}
          onChange={(event) => {
            setForm(event.target.value);
            setPage(1);
          }}
          className={input}
        >
          <option value="ALL">All forms</option>
          {forms.map(([slug, name]) => (
            <option key={slug} value={slug}>
              {name}
            </option>
          ))}
        </select>
      </div>
      <div className="overflow-x-auto border border-slate-200 bg-white">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="bg-slate-50 text-xs text-slate-500">
            <tr>
              <th className="p-3">Form</th>
              <th>Status</th>
              <th>Language</th>
              <th>Assigned</th>
              <th>Submitted</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="p-12 text-center">
                  <Loader2 className="mx-auto h-5 w-5 animate-spin" />
                </td>
              </tr>
            ) : (
              items.map((item) => (
                <tr key={item.id} className="border-t border-slate-100">
                  <td className="p-3">
                    <strong>{item.form.name}</strong>
                    <span className="block font-mono text-[10px] text-slate-400">{item.id}</span>
                  </td>
                  <td>
                    <span className="bg-slate-100 px-2 py-1 text-xs">{item.status}</span>
                  </td>
                  <td>{item.locale.toUpperCase()}</td>
                  <td>{item.assignedTo || "—"}</td>
                  <td>{new Date(item.submittedAt ?? item.createdAt).toLocaleString()}</td>
                  <td className="pr-3 text-right">
                    <button onClick={() => void open(item.id)} className="font-semibold underline">
                      Open
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        <div className="flex items-center justify-between border-t border-slate-200 p-3 text-xs">
          <span>{total} results</span>
          <div className="flex items-center gap-2">
            <button disabled={page <= 1} onClick={() => setPage((value) => value - 1)}>
              <ChevronLeft />
            </button>
            <span>
              {page} / {pages}
            </span>
            <button disabled={page >= pages} onClick={() => setPage((value) => value + 1)}>
              <ChevronRight />
            </button>
          </div>
        </div>
      </div>
      {selected && (
        <div className="fixed inset-0 z-[100] flex justify-end bg-slate-950/30">
          <aside className="h-full w-full max-w-2xl overflow-y-auto bg-white p-6 shadow-2xl">
            <div className="flex justify-between">
              <div>
                <h2 className="text-xl font-semibold">{selected.form.name}</h2>
                <p className="font-mono text-xs text-slate-500">{selected.id}</p>
              </div>
              <button onClick={() => setSelected(null)}>
                <X />
              </button>
            </div>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {Object.entries(selected.data).map(([key, value]) => (
                <div key={key} className="border border-slate-200 p-3">
                  <span className="block text-xs font-semibold text-slate-500">{key}</span>
                  <span className="mt-1 block break-words text-sm">{String(value)}</span>
                </div>
              ))}
            </div>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <label className="text-xs font-semibold">
                Status
                <select
                  value={selected.status}
                  onChange={(event) => void update({ status: event.target.value })}
                  className={`mt-1 ${input} w-full`}
                >
                  {statuses.map((value) => (
                    <option key={value}>{value}</option>
                  ))}
                </select>
              </label>
              <label className="text-xs font-semibold">
                Assigned to
                <input
                  value={assignedTo}
                  onChange={(event) => setAssignedTo(event.target.value)}
                  onBlur={() => void update({ assignedTo: assignedTo || null })}
                  className={`mt-1 ${input} w-full`}
                />
              </label>
            </div>
            <section className="mt-6">
              <h3 className="font-semibold">Internal notes</h3>
              <div className="mt-2 space-y-2">
                {(Array.isArray(selected.notes) ? selected.notes : []).map((raw, index) => {
                  const item = raw as { text?: string; createdAt?: string };
                  return (
                    <div key={index} className="border border-slate-200 p-3 text-sm">
                      <p>{item.text}</p>
                      <span className="mt-1 block text-xs text-slate-400">
                        {item.createdAt ? new Date(item.createdAt).toLocaleString() : ""}
                      </span>
                    </div>
                  );
                })}
              </div>
              <textarea
                value={note}
                onChange={(event) => setNote(event.target.value)}
                className="mt-3 min-h-24 w-full border border-slate-300 p-3 text-sm"
                placeholder="Add a private note"
              />
              <button
                disabled={!note.trim()}
                onClick={() => void update({ note })}
                className="mt-2 bg-slate-950 px-4 py-2 text-sm font-semibold text-white disabled:opacity-40"
              >
                Add note
              </button>
            </section>
            <section className="mt-6">
              <h3 className="font-semibold">History</h3>
              <div className="mt-2 space-y-2">
                {selected.history?.map((entry) => (
                  <div
                    key={entry.id}
                    className="flex justify-between border-b border-slate-100 py-2 text-xs"
                  >
                    <span>{entry.action}</span>
                    <span>{new Date(entry.createdAt).toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </section>
            {message && <p className="mt-4 text-sm">{message}</p>}
          </aside>
        </div>
      )}
    </div>
  );
}
