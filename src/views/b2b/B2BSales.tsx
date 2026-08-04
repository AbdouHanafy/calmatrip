"use client";

import { useEffect, useState } from "react";
import { Calendar, Package } from "lucide-react";

// Older bookings snapshot a price without a currency suffix — add it only if missing.
function withTnd(price: string) {
  return /tnd/i.test(price) ? price : `${price} TND`;
}

interface BookingRow {
  id: number;
  service: string;
  date: string;
  time: string;
  status: string;
  customerName: string | null;
  price: string | null;
  commissionRate: number | null;
  commissionAmount: number | null;
}

interface OrderItemRow {
  id: number;
  productName: string;
  quantity: number;
  price: number;
  commissionRate: number | null;
  commissionAmount: number | null;
  order: { customerName: string; createdAt: string; status: string };
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    pending: "bg-calma-gold/10 text-[#8A6B2E]",
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
  const [b2bType, setB2bType] = useState<string | null>(null);
  const [rows, setRows] = useState<(BookingRow | OrderItemRow)[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/b2b/sales")
      .then((res) => res.json())
      .then((data) => {
        setB2bType(data.b2bType ?? null);
        setRows(Array.isArray(data.rows) ? data.rows : []);
      })
      .catch(() => setRows([]))
      .finally(() => setLoading(false));
  }, []);

  const isAgency = b2bType === "AGENCY";

  const totalCommission = rows.reduce((sum, r) => sum + (r.commissionAmount ?? 0), 0);

  return (
    <div className="max-w-5xl">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-fraunces text-2xl font-normal text-calma-ink">
            {isAgency ? "Mes réservations" : "Mes ventes"}
          </h1>
          <p className="mt-1 text-sm text-calma-taupe">
            {rows.length} {isAgency ? "réservation" : "vente"}
            {rows.length !== 1 ? "s" : ""}
          </p>
        </div>
        <div className="rounded-xl bg-calma-terracotta/10 px-4 py-2.5 text-sm font-semibold text-calma-terracotta">
          {totalCommission.toFixed(2)} TND de commission prélevée au total
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
          {isAgency ? (
            <Calendar className="mx-auto mb-3 h-10 w-10 opacity-30" />
          ) : (
            <Package className="mx-auto mb-3 h-10 w-10 opacity-30" />
          )}
          <p>{isAgency ? "Aucune réservation pour le moment" : "Aucune vente pour le moment"}</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-calma-border bg-white">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-calma-sand text-xs uppercase tracking-wide text-calma-taupe">
                <tr>
                  <th className="px-5 py-3 font-medium">{isAgency ? "Service" : "Produit"}</th>
                  <th className="px-5 py-3 font-medium">Client</th>
                  <th className="px-5 py-3 font-medium">Date</th>
                  <th className="px-5 py-3 font-medium">Statut</th>
                  <th className="px-5 py-3 font-medium">Prix</th>
                  <th className="px-5 py-3 font-medium">Commission</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => {
                  if (isAgency) {
                    const b = row as BookingRow;
                    return (
                      <tr key={b.id} className="border-t border-calma-border">
                        <td className="px-5 py-3.5 font-medium text-calma-ink">{b.service}</td>
                        <td className="px-5 py-3.5 text-calma-taupe">{b.customerName ?? "—"}</td>
                        <td className="px-5 py-3.5 text-calma-taupe">
                          {new Date(b.date).toLocaleDateString("fr-FR")} {b.time}
                        </td>
                        <td className="px-5 py-3.5">
                          <StatusBadge status={b.status} />
                        </td>
                        <td className="px-5 py-3.5 text-calma-ink">
                          {b.price ? withTnd(b.price) : "—"}
                        </td>
                        <td className="px-5 py-3.5 text-calma-terracotta">
                          {b.commissionAmount !== null
                            ? `${b.commissionAmount.toFixed(2)} TND (${b.commissionRate}%)`
                            : "—"}
                        </td>
                      </tr>
                    );
                  }
                  const o = row as OrderItemRow;
                  return (
                    <tr key={o.id} className="border-t border-calma-border">
                      <td className="px-5 py-3.5 font-medium text-calma-ink">
                        {o.productName}{" "}
                        <span className="text-xs text-calma-taupe">×{o.quantity}</span>
                      </td>
                      <td className="px-5 py-3.5 text-calma-taupe">{o.order.customerName}</td>
                      <td className="px-5 py-3.5 text-calma-taupe">
                        {new Date(o.order.createdAt).toLocaleDateString("fr-FR")}
                      </td>
                      <td className="px-5 py-3.5">
                        <StatusBadge status={o.order.status} />
                      </td>
                      <td className="px-5 py-3.5 text-calma-ink">
                        {(o.price * o.quantity).toFixed(2)} TND
                      </td>
                      <td className="px-5 py-3.5 text-calma-terracotta">
                        {o.commissionAmount !== null
                          ? `${o.commissionAmount.toFixed(2)} TND (${o.commissionRate}%)`
                          : "—"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
