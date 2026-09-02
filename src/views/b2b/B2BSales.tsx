"use client";

import { useEffect, useState } from "react";
import { Package } from "lucide-react";

interface SaleRow {
  id: string;
  kind: "PRODUCT" | "SERVICE";
  title: string;
  quantity: number;
  date: string;
  status: string;
  customerName: string | null;
  gross: number;
  commissionRate: number | null;
  commissionAmount: number | null;
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    pending: "bg-amber-50 text-amber-700",
    confirmed: "bg-calma-success/10 text-calma-success",
    shipped: "bg-calma-success/10 text-calma-success",
    delivered: "bg-calma-success/10 text-calma-success",
    cancelled: "bg-red-50 text-red-600",
  };
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${map[status] ?? "bg-calma-sand text-calma-taupe"}`}
    >
      {status}
    </span>
  );
}

export default function B2BSales() {
  const [rows, setRows] = useState<SaleRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/b2b/sales")
      .then((res) => res.json())
      .then((data) => {
        setRows(Array.isArray(data.rows) ? data.rows : []);
      })
      .catch(() => setRows([]))
      .finally(() => setLoading(false));
  }, []);

  const totalCommission = rows.reduce((sum, r) => sum + (r.commissionAmount ?? 0), 0);
  const netRevenue = rows
    .filter((row) => ["confirmed", "shipped", "delivered"].includes(row.status))
    .reduce((sum, row) => sum + row.gross - (row.commissionAmount ?? 0), 0);

  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-fraunces text-2xl font-normal text-calma-ink">Ventes et revenus</h1>
          <p className="mt-1 text-sm text-calma-taupe">
            {rows.length} transaction{rows.length !== 1 ? "s" : ""} produit et service
          </p>
        </div>
        <div className="flex gap-2">
          <div className="rounded-xl bg-calma-success/10 px-4 py-2.5 text-sm font-semibold text-calma-success">
            {netRevenue.toFixed(2)} TND net confirmé
          </div>
          <div className="rounded-xl bg-calma-terracotta/10 px-4 py-2.5 text-sm font-semibold text-calma-terracotta">
            {totalCommission.toFixed(2)} TND de commission
          </div>
        </div>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 animate-pulse rounded-2xl bg-calma-sand" />
          ))}
        </div>
      ) : rows.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-calma-border py-16 text-center text-calma-taupe">
          <Package className="mx-auto mb-3 h-10 w-10 opacity-30" />
          <p>Aucune vente pour le moment</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-calma-border bg-white">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-calma-sand text-xs uppercase tracking-wide text-calma-taupe">
                <tr>
                  <th className="px-5 py-3 font-medium">Offre</th>
                  <th className="px-5 py-3 font-medium">Client</th>
                  <th className="px-5 py-3 font-medium">Date</th>
                  <th className="px-5 py-3 font-medium">Statut</th>
                  <th className="px-5 py-3 font-medium">Prix</th>
                  <th className="px-5 py-3 font-medium">Commission</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.id} className="border-t border-calma-border">
                    <td className="px-5 py-3.5 font-medium text-calma-ink">
                      {row.title}{" "}
                      <span className="ml-1 rounded-full bg-calma-sand px-2 py-0.5 text-[10px] text-calma-taupe">
                        {row.kind === "SERVICE" ? "Service" : `Produit ×${row.quantity}`}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-calma-taupe">{row.customerName ?? "—"}</td>
                    <td className="px-5 py-3.5 text-calma-taupe">
                      {new Date(row.date).toLocaleDateString("fr-FR")}
                    </td>
                    <td className="px-5 py-3.5">
                      <StatusBadge status={row.status} />
                    </td>
                    <td className="px-5 py-3.5 text-calma-ink">{row.gross.toFixed(2)} TND</td>
                    <td className="px-5 py-3.5 text-calma-terracotta">
                      {row.commissionAmount !== null
                        ? `${row.commissionAmount.toFixed(2)} TND (${row.commissionRate}%)`
                        : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
