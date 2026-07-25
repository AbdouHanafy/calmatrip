"use client";

import { useEffect, useState } from "react";
import { Mail, Trash2, Download } from "lucide-react";

interface Subscriber {
  id: number;
  email: string;
  active: boolean;
  createdAt: string;
}

export default function AdminNewsletter() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const res = await fetch("/api/admin/newsletter");
    const data = await res.json();
    setSubscribers(Array.isArray(data) ? data : []);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const remove = async (id: number) => {
    if (!confirm("Supprimer cet abonné ?")) return;
    await fetch(`/api/admin/newsletter/${id}`, { method: "DELETE" });
    load();
  };

  const exportCsv = () => {
    const rows = ["email,inscrit le", ...subscribers.map((s) => `${s.email},${new Date(s.createdAt).toLocaleDateString("fr-FR")}`)];
    const blob = new Blob([rows.join("\n")], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "newsletter-subscribers.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="mx-auto max-w-4xl p-6">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-fraunces text-2xl font-normal text-calma-ink">Newsletter</h1>
          <p className="mt-1 text-sm text-calma-taupe">
            {subscribers.length} abonné{subscribers.length !== 1 ? "s" : ""}
          </p>
        </div>
        <button
          onClick={exportCsv}
          disabled={subscribers.length === 0}
          className="flex items-center gap-2 rounded-xl bg-calma-terracotta px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-calma-terracotta-deep disabled:opacity-50"
        >
          <Download className="h-4 w-4" />
          Exporter CSV
        </button>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-14 animate-pulse rounded-2xl bg-calma-sand" />
          ))}
        </div>
      ) : subscribers.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-calma-border py-16 text-center text-calma-taupe">
          <Mail className="mx-auto mb-3 h-10 w-10 opacity-30" />
          <p>Aucun abonné pour le moment</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-calma-border bg-white">
          <table className="w-full text-left text-sm">
            <thead className="bg-calma-sand text-xs uppercase tracking-wide text-calma-taupe">
              <tr>
                <th className="px-5 py-3 font-medium">Email</th>
                <th className="px-5 py-3 font-medium">Inscrit le</th>
                <th className="px-5 py-3 font-medium" />
              </tr>
            </thead>
            <tbody>
              {subscribers.map((s) => (
                <tr key={s.id} className="border-t border-calma-border">
                  <td className="px-5 py-3.5 text-calma-ink">{s.email}</td>
                  <td className="px-5 py-3.5 text-calma-taupe">
                    {new Date(s.createdAt).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <button
                      onClick={() => remove(s.id)}
                      className="rounded-lg p-1.5 text-red-600 transition-colors hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
